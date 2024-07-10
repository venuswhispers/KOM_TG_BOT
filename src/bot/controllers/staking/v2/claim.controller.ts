import { startNoWallet } from "@/bot/controllers/main.controller";
import { menu } from "@/bot/controllers/staking/v2/main.controller";
import { Markup } from "telegraf";

// when enter stakingV1Scene
export const enterScene = async (ctx: any) => {
    const chainId = ctx.session.chainId ?? 137;
    if (chainId !== 137) {
        await ctx.scene.leave();
        return ctx.reply(`⚠ Please Switch To POLYGON Network`);
    }

    await ctx.reply("⏰ Loading your stakingV2 details ...");

    if (!ctx.session.account) {
        return startNoWallet(ctx);
    } else if (chainId !== 137 && chainId !== 42161) {
        return ctx.reply("⚠ Please switch to Polygon or Arbitrum network");
    }
    const address = ctx.session.account.address;
    // const address = '0xeB5768D449a24d0cEb71A8149910C1E02F12e320';
    const msg = `⚠ <i>Do you want to claim $KOM tokens from V2 staking pool? ...👇</i>`;

    ctx.reply(msg, {
        parse_mode: 'HTML',
        reply_markup: {
            force_reply: true,
            keyboard: [
                [Markup.button.webApp("✔ O K", `${process.env.MINIAPP_URL}/transactions/staking/v2/unstake?chainId=137`)],
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
        await ctx.scene.leave();
        return menu(ctx);
    } 
}

export const callbackQuery = async (ctx: any) => {
}
