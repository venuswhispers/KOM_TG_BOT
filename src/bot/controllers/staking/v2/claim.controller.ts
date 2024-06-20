import { decrypt } from "@/bot/utils";
import { claimKomV1, claimKomV2 } from "@/bot/utils/staking";
import { startNoWallet } from "@/bot/controllers/main.controller";
import { menu } from "@/bot/controllers/staking/v2/main.controller";

// when enter stakingV1Scene
export const enterScene = async (ctx: any) => {
    const chainId = ctx.session.chainId ?? 137;
    if (chainId !== 137) {
        await ctx.scene.leave ();
        return ctx.reply(`⚠ Please Switch To POLYGON Network`);
    }

    await ctx.reply("⏰ Loading your stakingV2 details ...");

    if (!ctx.session.account) {
        return startNoWallet(ctx);
    }
    const address = ctx.session.address;
    // const address = '0xeB5768D449a24d0cEb71A8149910C1E02F12e320';

    const msg = 
        `<b>💎 Your Staked $KOM tokens:</b>  <b>${ 0.0 }</b> <i><a href='https://polygonscan.com/address/0xC004e2318722EA2b15499D6375905d75Ee5390B8'>$KOM</a></i>\n\n` +
        `⚠ <i>Please enter your password to send transaction.</i>`;

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

// text input handler
export const textHandler = async (ctx: any) => {
    const _text = ctx.message.text;
    if (_text === '👈 BACK') {
        await ctx.scene.leave ();
        return menu (ctx);
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
            await claimKomV2(ctx, _privateKey);
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
