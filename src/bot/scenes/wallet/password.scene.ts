import { Telegraf, Scenes, session, Context } from 'telegraf';
import { menu, start } from '../../controllers/main.controller';
// Create a new scene
export const passwordScene = new Scenes.BaseScene<Context>('passwordScene');



// Handle the password prompt
passwordScene.enter((ctx: any) => {
    ctx.reply(
        'Please enter your password',
        {
            reply_markup: {
                force_reply: true,
                input_field_placeholder: 'Enter password',
                keyboard: [
                    [{ text: '👈 BACK' }],
                ],
                one_time_keyboard: true,
                resize_keyboard: true,
            }
        }
    );
});

// Handle the password input
passwordScene.on('text', async (ctx: any) => {
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
    // Get the user's input
    const password: string = ctx.message.text;
    const next: string = ctx.scene.state.next;
    // delete password
    await ctx.deleteMessage(ctx.message.message_id).catch((err: any) => { });
    // Return the result
    return ctx.scene.enter(next, { password: password });
});