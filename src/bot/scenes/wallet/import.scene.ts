import { Scenes } from 'telegraf';
import { generateAccount, createCallBackBtn } from "../../utils";
import { menu, start } from '../../controllers/main.controller';

export const importWalletScene = new Scenes.BaseScene("importWalletScene");

importWalletScene.enter((ctx) =>
  ctx.reply("Please enter private key or 12-word mnemonic.", {
    reply_markup: {
      force_reply: true,
      input_field_placeholder: 'Enter password',
      keyboard: [
        [{ text: 'BACK 👈' }],
      ],
      one_time_keyboard: true,
      resize_keyboard: true,
    }
  })
);

importWalletScene.on("text", async (ctx: any) => {
    // when back button is clicked..
    if (ctx.message.text === '👈 BACK') {
      await ctx.scene.leave ();
      if (ctx.session.wallet) {
          await menu (ctx);
      } else {
          await start (ctx);
      }
      return;
  }

  const { password, name } = ctx.scene.state;
  const phrase = ctx.message.text;
  await ctx.deleteMessage(ctx.message.message_id).catch((err: any) => { });
  try {
    console.log({
      key: phrase,
      desc: "import"
    })
    const wallet = generateAccount(phrase, 0, password, name);
    await ctx.reply(
      `🎉 Your wallet has been successfully imported.\n\n- Account Name: <code>${name}</code>\n- Address: <code>${wallet.address}</code>.`,
      { parse_mode: "HTML" }
    );
    
    if (!ctx.session.wallet || !Array.isArray(ctx.session.wallet)) {
      ctx.session.wallet = [];
    } 
    ctx.session.wallet.push(wallet);
    ctx.session.walletIndex = ctx.session.wallet.length - 1;
    console.log(ctx.session.walletIndex, ctx.session.wallet, ctx.session.wallet ? ctx.session.wallet.length : undefined)

    await ctx.scene.leave();
    menu (ctx);
  } catch (error) {
    ctx.reply(
      "😔 This does not appear to be a valid private key / mnemonic phrase. Please try again.",
      {
        reply_markup: {
          force_reply: true,
          input_field_placeholder: 'Enter password',
          keyboard: [
            [{ text: '👈 BACK' }],
          ],
          resize_keyboard: true,
        }
      }
    )
  }
});