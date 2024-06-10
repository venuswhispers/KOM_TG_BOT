import { Telegraf, Scenes, session, Context } from 'telegraf';
import { menu, start } from '../../controllers/main.controller';
// Create a new scene
export const walletScene = new Scenes.BaseScene<Context>('walletScene');



// Handle the password prompt
walletScene.enter((ctx: any) => {
    ctx.reply(
        '💬 Please Enter Account Name.',
        {
            reply_markup: {
                force_reply: true,
                input_field_placeholder: 'Enter account name',
                keyboard: [
                    [{ text: '👈 BACK' }],
                ],
                one_time_keyboard: true,
                resize_keyboard: true,
            }
        }
    );
});

// Handle the input
walletScene.on('text', async (ctx: any) => {
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

    if (ctx.scene.state.name === undefined) {
        const name = ctx.message.text;
        if (name === "") {
            ctx.reply("⚠ You have to enter account name.");
        } else {
            ctx.scene.state.name = ctx.message.text;
            ctx.reply(
                `💬 Your Account Name is <b><i>${ctx.scene.state.name}</i></b>\n\nPlease enter your password. <i>(You will need to use this password for any transactions)</i>`,
                {
                    parse_mode: "HTML",
                    reply_markup: {
                        force_reply: true,
                        input_field_placeholder: 'Enter Password',
                        keyboard: [
                            [{ text: '👈 BACK' }],
                        ],
                        one_time_keyboard: true,
                        resize_keyboard: true,
                    }
                }
            );
        }
    } else {
        const password: string = ctx.message.text;
        const next: string = ctx.scene.state.next;
        // delete password
        await ctx.deleteMessage(ctx.message.message_id).catch((err: any) => { });
        // await ctx.reply(`🏆 You will need to use this password for any transactions.`)
        // Return the result
        ctx.scene.enter(next, { password: password, name: ctx.scene.state.name });
    }
});