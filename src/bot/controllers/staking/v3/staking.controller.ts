import {
    getDateAfterXDays,
    getKOMBalance,
} from "@/bot/utils";
import { calculateReard } from "@/bot/utils/staking";
import { startNoWallet } from "@/bot/controllers/main.controller";
import { menu } from "@/bot/controllers/staking/v3/main.controller";
import { Markup } from "telegraf";

const PERIODS = [30, 60, 90, 180, 365, 730];
const APRs = [
    '(or approx. 2% p.a)',
    '(or approx. 3% p.a)',
    '(or approx. 4% p.a)',
    '(or approx. 6% p.a)',
    '(or approx. 8% p.a)',
    '(or approx. 10% p.a)',
];

const days: Record<string, number> = { '30 days': 0, '60 days': 1, '90 days': 2, '180 days': 3, '365 days': 4, '730 days': 5 };
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
    const _balance = await getKOMBalance(chainId, address);

    console.log("staking====>", {address});

    ctx.scene.state.balance = _balance;
    ctx.reply(`\n⏱ 1. Please enter token amount to stake. (minimum 100, max ${_balance})`, {
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
}

// input token amount
export const textHandler = async (ctx: any) => {

    if (ctx.message.text === '👈 BACK') {
        await ctx.scene.leave();
        return menu(ctx);
    }

    const stakingPeriod = ctx.scene.state.stakingPeriod;
    const stakingMode = ctx.scene.state.stakingMode;
    const stakingAmount = ctx.scene.state.stakingAmount;

    if (!stakingAmount && stakingAmount !== 0) { // enter token amount to stake
        const stakingAmount = Number(ctx.message.text);
        const _balance = ctx.scene.state.balance;
        if (isNaN(stakingAmount)) {
            ctx.reply(`\n✔  1. Not number, Please input valid token amount ( minimum 100 tokens )`, {
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
        } else if (stakingAmount < 100) {
            ctx.reply(`\n⚠ 1. Staking amount must greater than 100, Please re-enter token amount to stake`, {
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
        } else if (stakingAmount > _balance) {
            ctx.reply(`\n⚠ 1. Your KOM balance is ${_balance}$KOM , Please re-enter token amount to stake`, {
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
            ctx.scene.state.stakingAmount = stakingAmount;
            ctx.reply(`\n✔  2. You entered ${stakingAmount} $KOM tokens.\nChoose how many days you will stake`, {
                parse_mode: 'HTML',
                reply_markup: {
                    inline_keyboard: [
                        [{ text: '30 days (2% p.a)', callback_data: '30 days' }, { text: '60 days (3% p.a)', callback_data: '60 days' }, { text: '90 days (4% p.a)', callback_data: '90 days' }],
                        [{ text: '180 days (6% p.a)', callback_data: '180 days' }, { text: '365 days (8% p.a)', callback_data: '365 days' }, { text: '730 days (10% p.a)', callback_data: '730 days' }],
                    ],
                }
            });
        }
    } else if (!stakingPeriod && stakingPeriod !== 0) { // select staking period
        return ctx.reply('\n⚠  2. Not selected staking period.\nChoose how many days you will stake', {
            parse_mode: 'HTML',
            reply_markup: {
                inline_keyboard: [
                    [{ text: '30 days (2% p.a)', callback_data: '30 days' }, { text: '60 days (3% p.a)', callback_data: '60 days' }, { text: '90 days (4% p.a)', callback_data: '90 days' }],
                    [{ text: '180 days (6% p.a)', callback_data: '180 days' }, { text: '365 days (8% p.a)', callback_data: '365 days' }, { text: '730 days (10% p.a)', callback_data: '730 days' }],
                ],
            }
        });
    } else if (!stakingMode && stakingMode !== 0) { // select compound mode
        return ctx.reply(
            `\n✔  2. Not selected compound mode, Choose your compounding mode`,
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
}

// enter scene
export const stakeScene = async (ctx: any) => {
    await ctx.scene.enter("stakingV3Scene");
}

// when click option for stakingV3 ( compound mode, days, )
export const callbackQuery = async (ctx: any) => {
    const chainId = ctx.session.chainId ?? 137;
    const selectedOption = ctx.callbackQuery.data;

    const stakingAmount = ctx.scene.state.stakingAmount;
    if (!stakingAmount && stakingAmount !== 0) {
        ctx.reply(`\n✔  1. You didn't enter token amount to stake,\nPlease enter token amount`, {
            parse_mode: 'HTML',
            reply_markup: {
                force_reply: true,
            }
        });
    }

    if (Object.keys(days).includes(selectedOption)) { // select staking period
        ctx.answerCbQuery(`You selected: ${selectedOption}`);
        ctx.scene.state.stakingPeriod = days[selectedOption];
        ctx.reply(
            `\n✔  3. You selected <b>${selectedOption}</b> Choose your compounding mode`,
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
    } else if (Object.keys(modes).includes(selectedOption)) { // select compound option
        ctx.answerCbQuery(`You selected: ${selectedOption}`);
        await ctx.reply('⏰ Loading ...');
        ctx.scene.state.stakingMode = modes[selectedOption];
        const {
            stakingAmount,
            stakingPeriod,
            stakingMode
        } = ctx.scene.state;

        const _reward = await calculateReard(stakingAmount, stakingPeriod);
        const _period = PERIODS[stakingPeriod];
        const _rewardAPR = APRs[stakingPeriod];
        const _end = getDateAfterXDays(_period);

        const msg = `👁‍🗨 Preview\nI am staking ${stakingAmount} $KOM for ${PERIODS[stakingPeriod]} days until ${_end.toLocaleDateString()}. I will be getting ${_reward} $KOM rewards ${_rewardAPR}, but If I withdraw before ${_end.toLocaleDateString()}, I will not get the rewards and I will only be getting ${stakingAmount / 2} $KOM (I am aware that there is a 50% prematurity withdraw penalty). I choose the compounding method of '${Object.keys(modes)[stakingMode]}' which I can change / alter before the end date of my staking.\n\n✔ Do you want to run this transaction? ...👇`
        ctx.reply(msg, {
            parse_mode: 'HTML',
            reply_markup: {
                force_reply: true,
                keyboard: [
                    [Markup.button.webApp("✔ O K", `${process.env.MINIAPP_URL}/transactions/staking/v3/stake?chainId=${chainId}&stakingAmount=${stakingAmount}&stakingPeriod=${stakingPeriod}&stakingMode=${stakingMode}`)],
                    [{ text: '👈 BACK' }],
                ],
                one_time_keyboard: true,
                resize_keyboard: true,
            }
        });
    }
}

