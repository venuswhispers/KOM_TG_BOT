import { Scenes, Context } from 'telegraf';
import { generateAccount, createCallBackBtn, createWallet } from "../../utils";
import { decrypt } from '../../utils';
import { menu, startNoWallet } from '../../controllers/main.controller';

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

  console.log({password})
  try {
    const _walletIndex = ctx.session.walletIndex ?? 0;
    const _wallet = ctx.session.wallet[_walletIndex];
    const key = decrypt(_wallet.privateKey, password);

    if (!key) throw "no key";

    let count = 30;
    const msg = 
      `💦 Your wallet *<code>${_wallet.address}</code>* Private Key is: <code>${key}</code>\n\n` +
      `<b>FOR SECURITY REASON, THIS MESSAGE WILL BE DELETED IN 30 SECONDS</b>\n\n` +
      `<i>⚠  Warning : Never disclose this Private Key to anyone. Store it safely with a password manager and do not make a screenshot. To use this same wallet into a google chrome extension (like Rabby or Metamask), you can import the Private Key there. Anyone with this private key can steal any assets held in your account</i>`;

    const _msg = await ctx.reply(
      msg,
      {
        parse_mode: "HTML",
      }
    );
    const intervalId: NodeJS.Timeout = setInterval (() => {
      try {
        if (count > 0) {
        count --;
        const msg = 
          `💦 Your wallet *<code>${_wallet.address}</code>* Private Key is: <code>${key}</code>\n\n` +
          `<b>FOR SECURITY REASON, THIS MESSAGE WILL BE DELETED IN ${count} SECONDS</b>\n\n` +
          `<i>⚠  Warning : Never disclose this Private Key to anyone. Store it safely with a password manager and do not make a screenshot. To use this same wallet into a google chrome extension (like Rabby or Metamask), you can import the Private Key there. Anyone with this private key can steal any assets held in your account</i>`;

          ctx.telegram.editMessageText(
            ctx.chat.id, _msg.message_id, null, 
            msg,
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
      await startNoWallet(ctx);
    }
    return;
  }
});
