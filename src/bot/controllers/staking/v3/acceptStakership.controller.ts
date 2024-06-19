import { createCallBackBtn, getStakershipDetails } from "../../../utils";
import { decrypt } from "../../../utils";
import { accpetStakership } from "../../../utils/staking";
import { startNoWallet } from "../../main.controller";
import { menu } from "..";

// when enter stakingV3Scene
export const enterScene = async (ctx: any) => {
    ctx.reply('\n🗨  Please enter your password to send AcceptStakership transaction', {
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

// input password for accept staker ship
export const textHandler = async (ctx: any) => {
    
    if (ctx.message.text === '👈 BACK') {
        await ctx.scene.leave ();
        return menu (ctx);
    }

    await ctx.reply("⏰ Loading ...");

    const password = ctx.message.text;
    await ctx.deleteMessage(ctx.message.message_id).catch((err: any) => { });
    
    if (!ctx.session.wallet || !Array.isArray(ctx.session.wallet)) {
        await ctx.scene.leave();
        startNoWallet(ctx);
        return;
    }
    const _walletIndex = ctx.session.walletIndex ?? 0;
    const _wallet = ctx.session.wallet[_walletIndex];
    const _address = _wallet.address;
    const { originStakership } = await getStakershipDetails(137, _address);

    if (originStakership === '0x0000000000000000000000000000000000000000') {
        await ctx.reply(
            "😔 No pending stakership for your wallet address.",
        );
        ctx.scene.leave();
        return;
    }

    try {
        const _privateKey = decrypt(_wallet.privateKey, password);
        if (!_privateKey) throw "no key";
        await accpetStakership(ctx, _privateKey, originStakership);
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

// enter transferStakership scene
export const acceptStakershipScene = async (ctx: any) => {
    const chainId = ctx.session.chainId ?? 137;
    if (chainId === 137) {
        await ctx.scene.enter("acceptStakershipScene");
    } else {
        ctx.reply(`\n⚠  acceptStakershipScene function is only available in Polygon network.`, {
            parse_mode: 'HTML',
        });
    }
}
