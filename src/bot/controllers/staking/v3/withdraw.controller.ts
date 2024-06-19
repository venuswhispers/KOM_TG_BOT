import { getStakingV3Detail } from "../../../utils";
import { decrypt } from "../../../utils";
import { unstakeKomV3 } from "../../../utils/staking";
import { menu } from "./main.controller";
import { startNoWallet } from "../../main.controller";

//switch chain
export const switchChain = async (ctx: any) => {
    const chainId = ctx.session.chainId ?? 137;
    if (chainId === 137 || !chainId) {
        ctx.session.chainId = 42161;
    } else {
        ctx.session.chainId = 137;
    }
}

// when entering withdrawV3 scene
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

    if (ctx.message.text === '👈 BACK') {
        await ctx.scene.leave ();
        return menu (ctx);
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
            ctx.scene.state.withdraw.withdrawAmount = withdrawAmount;
            ctx.reply(`\n✔  You entered ${withdrawAmount} $KOM tokens to withdraw, Please enter your password to send transaction`, {
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
    } else { // input password
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
            await unstakeKomV3(ctx, _wallet.address, _privateKey, withdrawAmount, index);
            ctx.scene.leave();
        } catch (err) {
            ctx.reply(
                "😔 Wrong password. Please re-enter password.",
                {
                    reply_markup: {
                        force_reply: true,
                        input_field_placeholder: 'Enter password',
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

// when try-later button when withdraw
export const callbackQuery = async (ctx: any) => {
    await ctx.scene.leave();
    menu(ctx);
}
