import { 
    getLPStakingDetails, 
} from "../../../utils";
import { decrypt } from "../../../utils";
import { stakeLP } from "../../../utils/staking";
import { startNoWallet } from "../../main.controller";
import { menu } from "./main.controller";

// when enter stakingV3Scene
export const enterScene = async (ctx: any) => {
    const chainId = ctx.session.chainId ?? 137;
    if (chainId !== 137) {
        await ctx.scene.leave ();
        return ctx.reply(`⚠ Please Switch To POLYGON Network`);
    }

    ctx.reply("⏰ Loading your staking LP details ...");
    if (!ctx.session.wallet || !Array.isArray(ctx.session.wallet)) {
        return startNoWallet(ctx);
    }

    const _walletIndex = ctx.session.walletIndex ?? 0;
    const _wallet = ctx.session.wallet[_walletIndex];

    const address = _wallet.address;
    // const address = '0xeB5768D449a24d0cEb71A8149910C1E02F12e320';
    const { amount, claimableEpoch, index }  = await getLPStakingDetails(address);
    ctx.scene.state.balance = amount;

    const msg = 
        `💦 KomBot | <a href="https://staking.kommunitas.net/"><u>Website</u></a> | <a href='https://youtu.be/CkdGN54ThQI?si=1RZ0T531IeMGfgaQ'><u>Tutorials</u></a> 💦\n\n` +
        `<b>💎 Staked LP Amount :</b>  <b>${ amount }</b> <i><a href='https://polygonscan.com/address/0xe0a1fd98e9d151babce27fa169ae5d0ff180f1a4'>UNI-V2 (WMATIC - KOM)</a></i>` +
        `\n\n*<i>Please note that there is a 30 dayscool down period, which means that you can unstake your LP token anytime, but there will be30 dayscool down period before you can claim the LP token to your wallet.</i>\n` +
        `\n**<i>Please note that the snapshot for rewards calculation will be done every end of each month and rewards (both USDT and tokens) will be transferred to your wallet.</i>\n\n` +
        `💬 <i>Please enter LP token amount to stake.</i>`;

    ctx.reply(msg, {
        parse_mode: 'HTML',
        reply_markup: {
            force_reply: true,
            keyboard: [
                [{ text: '👈 BACK' }],
            ],
            one_time_keyboard: true,
            resize_keyboard: true,
        },
        link_preview_options: {
            is_disabled: true
        }
    });
}

// input token amount
export const textHandler = async (ctx: any) => {

    if (ctx.message.text === '👈 BACK') {
        await ctx.scene.leave ();
        return menu (ctx);
    }

    const { amount } = ctx.scene.state;

    if (amount === undefined) {
        const _amount = Number(ctx.message.text);
        if (isNaN(_amount)) {
            ctx.reply(`\n⚠  Not a number, Please input valid token amount`, {
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
        } else if (_amount <= 0) {
            ctx.reply(`\n⚠ Staking amount must greater than 0, Please re-enter token amount to stake`, {
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
        } else if (_amount > ctx.scene.state.balance ) {
            ctx.reply(`\n💬 Your LP token balance is ${ctx.scene.state.balance}.\nPlease enter valid token amount to stake.`, {
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
            ctx.scene.state.amount = _amount;
            ctx.reply(`\n💬 You entered ${_amount} $LP tokens.\nPlease enter your password to send transaction.`, {
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
    } else {
        const password = ctx.message.text;
        await ctx.deleteMessage(ctx.message.message_id).catch((err: any) => { });

        if (!ctx.session.wallet || !Array.isArray(ctx.session.wallet)) {
            await ctx.scene.leave();
            startNoWallet (ctx);
            return;
        }
        const _walletIndex = ctx.session.walletIndex ?? 0;
        const _wallet = ctx.session.wallet[_walletIndex];

        try {
            const _privateKey = decrypt(_wallet.privateKey, password);
            if (!_privateKey) throw "no key";
            await stakeLP(ctx, _wallet.address, _privateKey, amount);
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

export const callbackQuery = async (ctx: any) => {
}

