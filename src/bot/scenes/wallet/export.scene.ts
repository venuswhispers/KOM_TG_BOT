import { Scenes, Context } from 'telegraf';
import { generateAccount, createCallBackBtn, createWallet } from "../../utils";
import { decrypt } from '../../utils';
import { menu, start } from '../../controllers/main.controller';

export const exportWalletScene = new Scenes.BaseScene<Context>("exportWalletScene");

exportWalletScene.enter(async (ctx: any) => {
  if (!ctx.session.wallet || !Array.isArray(ctx.session.wallet)) {
    const createWalletButton = createCallBackBtn("Create New Wallet", "create-wallet");
    const importWalletButton = createCallBackBtn("Import Existing Wallet", "import-wallet");
    // Send message with the import wallet button
    const message = `You have no wallet ! Do you have an existing wallet or create new one ?`;
    ctx.reply(message, {
      reply_markup: {
        inline_keyboard: [[createWalletButton, importWalletButton]],
      },
    });
    await ctx.scene.leave();
    return;
  }

  const password: string = ctx.scene.state.password;
  try {
    const _walletIndex = ctx.session.walletIndex ?? 0;
    const key = decrypt(ctx.session.wallet[_walletIndex].privateKey, password);
    if (!key) throw "no key";

    let count = 30;
    const _msg = await ctx.reply(
      `💦 Your wallet private key is\n<code>${key}</code> <i>(this message will be deleted in ${count --} seconds)</i> \n\n<b>⚠ Warning: Never disclose or store digitally this key. Anyone with your private keys can steal any assets held in your account.</b>`,
      {
        parse_mode: "HTML",
      }
    );
    const intervalId: NodeJS.Timeout = setInterval (() => {
      try {
        if (count > 0) {
          ctx.telegram.editMessageText(
            ctx.chat.id, _msg.message_id, null, 
            `💦 Your wallet private key is\n<code>${key}</code> <i>(this message will be deleted in ${count --} seconds)</i> \n\n<b>⚠ Warning: Never disclose or store digitally this key. Anyone with your private keys can steal any assets held in your account.</b>`,
            {
              parse_mode: "HTML",
            }
          );
        } else {
          ctx.deleteMessage(_msg.message_id).catch((err: any) => { });
          clearInterval (intervalId);
        }
      } catch (err) {}
    }, 1000)
    await ctx.scene.leave();
    menu(ctx);
  } catch (err) {
    ctx.reply(
      "😔 Wrong password. Please try again.",
      {
        reply_markup: {
          force_reply: true,
          input_field_placeholder: 'Enter password',
          keyboard: [
            [{ text: '👈 BACK' }],
          ],
          resize_keyboard: true,
          one_time_keyboard: true,
        }
      }
    );
    ctx.scene.enter('passwordScene', { next: 'exportWalletScene' });
  }
});

exportWalletScene.on('text', async (ctx: any) => {
  // when back button is clicked..
  if (ctx.message.text === '👈 BACK') {
    await ctx.scene.leave();
    if (ctx.session.wallet) {
      await menu(ctx);
    } else {
      await start(ctx);
    }
    return;
  }
});
