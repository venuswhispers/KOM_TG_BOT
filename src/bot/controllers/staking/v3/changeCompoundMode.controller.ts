import { createCallBackBtn, getDateAfterXDays, getStakershipDetails, getStakingV3Detail, getStakingV3StakedDetails, reduceAmount } from "@/bot/utils";
import { chains } from "@/constants/config";
import { getNativeTokenPrice } from "@/bot/utils";
import { getTokenBalances } from "@/bot/utils";
import { CONTRACTS } from "@/constants/config";
import { getStakingV3Details } from "@/bot/utils";
import { decrypt } from "@/bot/utils";
import { calculateReard, stakeKomV3, transferStakerShip, accpetStakership, changeCompoundType } from "@/bot/utils/staking";
import { startNoWallet } from "@/bot/controllers/main.controller";
import { menu } from "@/bot/controllers/staking/v2/main.controller";

const { ethers } = require('ethers');

const PERIODS = [30, 60, 90, 180, 365, 730];
const APRs = [
    '(or approx. 2% p.a)',
    '(or approx. 3% p.a)',
    '(or approx. 4% p.a)',
    '(or approx. 6% p.a)',
    '(or approx. 8% p.a)',
    '(or approx. 10% p.a)',
];
const modes: Record<string, number> = { 'No Compound': 0, 'Compound My Staked $KOM only': 1, 'Compound The Amount + Reward': 2 };


// when enter stakingV3Scene
export const enterScene = async (ctx: any) => {
    const chainId = ctx.session.chainId ?? 137;
    if (!ctx.session.wallet || !Array.isArray(ctx.session.wallet)) {
        await ctx.scene.leave();
        return startNoWallet (ctx);
    }

    const _walletIndex = ctx.session.walletIndex ?? 0;
    const _wallet = ctx.session.wallet[_walletIndex];

    const address = _wallet.address;
    // const address = '0xabe34cE4f1423CD9025DB7Eb7637a08AF60d4Af3';

    if (!ctx.scene.state.state) {
        ctx.reply(`\n⚠  Not selected item, Please select staking item to change compound mode.`, {
            parse_mode: 'HTML',
        });
        await ctx.scene.leave();
        return;
    }
    const { version, index } = ctx.scene.state.state;
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
    } else {
        const password = ctx.message.text;
        await ctx.deleteMessage(ctx.message.message_id).catch((err: any) => { });

        if (!ctx.session.wallet || !Array.isArray(ctx.session.wallet)) {
            await ctx.scene.leave();
            startNoWallet(ctx);
            return;
        }
        const _walletIndex = ctx.session.walletIndex ?? 0;
        const _wallet = ctx.session.wallet[_walletIndex];

        try {
            const _privateKey = decrypt(_wallet.privateKey, password);
            if (!_privateKey) throw "no key";
            await changeCompoundType(ctx, _wallet.address, _privateKey, index, newCompoundType);
            ctx.scene.leave();
        } catch (err) {
            ctx.reply(
                "😔 Wrong password. Please re-enter password.",
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
}

// when click option for stakingV3 ( compound mode, days, )
export const callbackQuery = async (ctx: any) => {
    const selectedOption = ctx.callbackQuery.data;
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
                `⚠ You have selected *<b><i>${selectedOption}</i></b>*.\nPlease enter your password to send transaction.`,
                {
                    parse_mode: "HTML",
                    reply_markup: {
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
}
