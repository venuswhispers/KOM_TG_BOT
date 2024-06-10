import { Scenes, Context } from 'telegraf';
import { createCallBackBtn, createWallet } from "../../utils";

export const createWalletScene = new Scenes.BaseScene<Context>("createWalletScene");
import { menu } from '../../controllers/main.controller';

createWalletScene.enter(async (ctx: any) => {
    const { name, password } = ctx.scene.state;
    const wallet = createWallet(name, password);
    // Create a button for export private key
    const exportPrivatekeyButton = createCallBackBtn("Export Private Key", "export_wallet");
    // Send message with the import wallet button
    ctx.reply(`🎉   Your wallet has been successfully created.\n\n- Account Name: <code>${name}</code>\n- Address: <code>${wallet.address}</code>.`,
        {
            parse_mode: "HTML",
            reply_markup: {
                inline_keyboard: [[exportPrivatekeyButton]],
            }
        }
    );

    if (!ctx.session.wallet || !Array.isArray(ctx.session.wallet)) {
        ctx.session.wallet = [];
    }
    ctx.session.wallet.push(wallet);
    ctx.session.walletIndex = ctx.session.wallet.length - 1;
    console.log(ctx.session.walletIndex, ctx.session.wallet ? ctx.session.wallet.length : undefined);
});

// message handler
createWalletScene.on('text', async (ctx: any) => {
    // when back button is clicked..
    if (ctx.message.text === '👈 BACK') {
        await ctx.scene.leave();
        menu(ctx);
    }
});
