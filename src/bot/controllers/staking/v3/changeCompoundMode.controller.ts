import { getStakingV3Detail } from "@/bot/utils";
import { startNoWallet } from "@/bot/controllers/main.controller";
import { menu } from "@/bot/controllers/staking/v3/main.controller";
import { Markup } from "telegraf";

const modes: Record<string, number> = { 'No Compound': 0, 'Compound My Staked $KOM only': 1, 'Compound The Amount + Reward': 2 };

// when enter stakingV3Scene
export const enterScene = async (ctx: any) => {
    const chainId = ctx.session.chainId ?? 137;
    if (!ctx.session.account) {
        return startNoWallet(ctx);
    } else if (chainId !== 137 && chainId !== 42161) {
        return ctx.reply("⚠ Please switch to Polygon or Arbitrum network");
    }
    const address = ctx.session.account.address;
    // const address = '0xabe34cE4f1423CD9025DB7Eb7637a08AF60d4Af3';

    if (!ctx.scene.state.state) {
        ctx.reply(`\n⚠  Not selected item, Please select staking item to change compound mode.`, {
            parse_mode: 'HTML',
        });
        await ctx.scene.leave();
        return;
    }
    const { index } = ctx.scene.state.state;
    await ctx.reply(
        '⏰ Loading selected staking detail ...',
        {
            parse_mode: 'HTML',
            reply_markup: {
                keyboard: [
                    [{ text: '👈 BACK' }],
                ],
                one_time_keyboard: true,
                resize_keyboard: true,
            }
        }
    );
    const { compoundType } = await getStakingV3Detail(chainId, address, index);
    ctx.scene.state.state.compoundType = compoundType;

    ctx.reply(
        `🎨 Current compound type: *<b><i>${Object.keys(modes)[compoundType]}</i></b>*\n\n` +
        `Compound means Re-staking. If you want to unstake, you need to choose No Compound and wait until Maturity Time. Your KOM token will be automatically transferred to your wallet.` +
        `\n\n🥇 What type of compound do you want to change to?`,
        {
            parse_mode: 'HTML',
            reply_markup: {
                inline_keyboard: [
                    [{ text: 'No Compound', callback_data: 'No Compound' }],
                    [{ text: 'Compound My Staked $KOM only', callback_data: 'Compound My Staked $KOM only' }],
                    [{ text: 'Compound The Amount + Reward', callback_data: 'Compound The Amount + Reward' }]
                ],
            }
        }
    );
}

// input token amount
export const textHandler = async (ctx: any) => {
    if (ctx.message.text === '👈 BACK') {
        await ctx.scene.leave();
        return menu(ctx);
    }
    const { index, version, newCompoundType } = ctx.scene.state.state;
    if (newCompoundType === undefined || isNaN(newCompoundType)) {
        ctx.reply(`
            \n⚠ You haven't selected new compound mode.\nPlease select new compound mode to change.`,
            {
                parse_mode: 'HTML',
                reply_markup: {
                    force_reply: true,
                    keyboard: [
                        [{ text: '👈 BACK' }],
                    ],
                    one_time_keyboard: true,
                    resize_keyboard: true,
                }
            }
        );
    }
}
// when click option for stakingV3 ( compound mode, days, )
export const callbackQuery = async (ctx: any) => {
    const selectedOption = ctx.callbackQuery.data;
    const chainId = ctx.session.chainId ?? 137;
    if (Object.keys(modes).includes(selectedOption)) { // select compound option
        ctx.answerCbQuery(`You selected: ${selectedOption}`);
        await ctx.reply('⏰ Loading ...');
        const { compoundType, index } = ctx.scene.state.state;
        const newCompoundType = modes[selectedOption];
        if (compoundType === newCompoundType) {
            ctx.reply(
                `⚠ You have selected the same compound mode as before.\nPlease select a different mode.`,
                {
                    reply_markup: {
                        keyboard: [
                            [{ text: '👈 BACK' }],
                        ],
                        one_time_keyboard: true,
                        resize_keyboard: true,
                    }
                }
            );
        } else {
            ctx.scene.state.state.newCompoundType = newCompoundType;
            ctx.reply(
                `⚠ You have selected *<b><i>${selectedOption}</i></b>*.\n\nDo you agree to run this transaction? ...👇`,
                {
                    parse_mode: "HTML",
                    reply_markup: {
                        force_reply: true,
                        keyboard: [
                            [Markup.button.webApp("✔ O K", `${process.env.MINIAPP_URL}/transactions/staking/v3/change?chainId=${chainId}&compoundMode=${newCompoundType}&index=${index}`)],
                            [{ text: '👈 BACK' }],
                        ],
                        one_time_keyboard: true,
                        resize_keyboard: true,
                    }
                }
            );
        }
    }
}
