import { menu } from "@/bot/controllers/staking/v3/main.controller";
import { Markup } from "telegraf";

// when enter stakingV3Scene
export const enterScene = async (ctx: any) => {
    const chainId = ctx.session.chainId ?? 137;
    ctx.reply('\n🗨  Please enter your password to send AcceptStakership transaction.\n\n✔ Do you want to execute this transaction ...👇.', {
        parse_mode: "HTML",
        reply_markup: {
            force_reply: true,
            keyboard: [
                [Markup.button.webApp("✔ O K", `${process.env.MINIAPP_URL}/transactions/staking/v3/stakership/accept?chainId=${chainId}`)],
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
        await ctx.scene.leave();
        return menu(ctx);
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
