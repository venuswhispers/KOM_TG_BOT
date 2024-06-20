import { Scenes, Context } from 'telegraf';
import { startNoWallet } from "@/bot/controllers/main.controller";
export const deleteWalletScene = new Scenes.BaseScene<Context>("deleteWalletScene");
import { menu } from '@/bot/controllers/main.controller';
import { deleteWallet, showWallets } from '@/bot/controllers/wallet/wallet.controller';

deleteWalletScene.enter(async (ctx: any) => {
    const { index } = ctx.scene.state;
    if (!ctx.session.wallet || !Array.isArray(ctx.session.wallet) || ctx.session.wallet.length === 0) {
        return startNoWallet(ctx);
    } else if (ctx.session.wallet.length < index) {
        return ctx.reply("⚠ No wallet for selected index");
    }
    const _wallet = ctx.session.wallet[index];
    await ctx.reply(
        `💬 Do you want delete <b><i>${_wallet.address}</i></b> <i>(${_wallet.name})</i> ?`,
        {
            parse_mode: "HTML",
            reply_markup: {
                inline_keyboard: [
                    [
                        { text: `✔ OK`, callback_data: `deletescene_wallet_${index}` },
                        { text: `⭕ Cancel`, callback_data: `back` },
                    ]
                ],
            },
            link_preview_options: {
                is_disabled: true
            }
        }
    );
});

// message handler
deleteWalletScene.on('text', async (ctx: any) => {
    // when back button is clicked..
    if (ctx.message.text === '👈 BACK') {
        await ctx.scene.leave();
        menu(ctx);
    }
});

// callback query
deleteWalletScene.on("callback_query", async (ctx: any) => {
    const selectedOption = ctx.callbackQuery.data;
    await ctx.scene.leave ();
    if (selectedOption.includes('deletescene_wallet_')) {
        const [,,index] = selectedOption.split("_");
        await deleteWallet (ctx, index);
        return;
    } else {
        await ctx.reply("💬 Canceled.");
        await showWallets (ctx);
    }
});
