import { getStakingV3Detail } from "@/bot/utils";
import { menu } from "@/bot/controllers/staking/v3/main.controller";
import { Markup } from "telegraf";
import { startNoWallet } from "@/bot/controllers/main.controller";

// when entering withdrawV3 scene
export const enterScene = async (ctx: any) => {

    const chainId = ctx.session.chainId ?? 137;
    if (!ctx.session.account) {
        return startNoWallet(ctx);
    } else if (chainId !== 137 && chainId !== 42161) {
        return ctx.reply("⚠ Please switch to Polygon or Arbitrum network");
    }
    const address = ctx.session.account.address;
    // const address = '0xabe34cE4f1423CD9025DB7Eb7637a08AF60d4Af3';

    if (!ctx.scene.state.withdraw) {
        ctx.reply(
            `\n⚠  Not selected withdrawal staking, Please select staking item to withdraw.`,
            {
                parse_mode: 'HTML',
            }
        );
        await ctx.scene.leave();
        return;
    }

    const { version, index } = ctx.scene.state.withdraw;
    await ctx.reply('⏰ Loading selected staking detail ...');
    const { amount } = await getStakingV3Detail(chainId, address, index);
    ctx.scene.state.withdraw.available = amount;
    ctx.reply(
        `🎲 <b>Prematurity Withdrawal (available: ${amount} $KOM)</b>\n\n<i>(Warning! Please note that you will NOT get any rewards and there will be a penalty of 50% of the amount you withdraw)\nStaked Amount : ${amount} $KOM</i>\n\nPlease enter token amount how much you wanna withdraw?`,
        {
            parse_mode: "HTML",
            reply_markup: {
                force_reply: true,
                keyboard: [
                    [{ text: '👈 BACK' }],
                ],
                one_time_keyboard: true,
                resize_keyboard: true,
            }
        }
    )
}

// input token amount
export const textHandler = async (ctx: any) => {
    const chainId = ctx.session.chainId ?? 137;
    if (ctx.message.text === '👈 BACK') {
        await ctx.scene.leave();
        return menu(ctx);
    }
    const { withdraw: { version, index, available, withdrawAmount } } = ctx.scene.state;

    if (!withdrawAmount) { // input withdraw amount
        const withdrawAmount = Number(ctx.message.text);
        if (isNaN(withdrawAmount)) {
            ctx.reply(`\n⚠  Not a number, Please input valid token amount to withdraw. <i>( min: 1, max: ${available} )</i>`, {
                parse_mode: 'HTML',
                reply_markup: {
                    force_reply: true,
                    keyboard: [
                        [{ text: '👈 BACK' }],
                    ],
                    one_time_keyboard: true,
                    resize_keyboard: true,
                }
            });
        } else if (withdrawAmount <= 0 || withdrawAmount > available) {
            ctx.reply(`\n⚠  Invalid staking amount, Please re-enter token amount to withdraw. <i>( min: 1, max: ${available} )</i>`, {
                parse_mode: 'HTML',
                reply_markup: {
                    force_reply: true,
                    keyboard: [
                        [{ text: '👈 BACK' }],
                    ],
                    one_time_keyboard: true,
                    resize_keyboard: true,
                }
            });
        } else {
            ctx.reply(`\n✔  You entered ${withdrawAmount} $KOM tokens to withdraw, \n\nDo you agree to run this transaction? ...👇`, {
                parse_mode: 'HTML',
                reply_markup: {
                    force_reply: true,
                    keyboard: [
                        [Markup.button.webApp("✔ O K", `${process.env.MINIAPP_URL}/transactions/staking/v3/unstake?chainId=${chainId}&withdrawAmount=${withdrawAmount}&index=${index}`)],
                        [{ text: '👈 BACK' }],
                    ],
                    one_time_keyboard: true,
                    resize_keyboard: true,
                }
            });
        }
    }
}

// when try-later button when withdraw
export const callbackQuery = async (ctx: any) => {
    await ctx.scene.leave();
    menu(ctx);
}
