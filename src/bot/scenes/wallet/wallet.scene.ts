import { Telegraf, Scenes, session, Context } from 'telegraf';
import { menu, startNoWallet } from '../../controllers/main.controller';
// Create a new scene
export const walletScene = new Scenes.BaseScene<Context>('walletScene');



// Handle the password prompt
walletScene.enter((ctx: any) => {
    const { next } = ctx.scene.state;

    ctx.reply(
        `💬 You want to ${ next === 'createWalletScene' ? 'create a new wallet' : 'import an existing wallet' }, Please provide an Account Name for this wallet`,
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
            await startNoWallet(ctx);
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
                `💬 Your Account Name is <b><i>${ctx.scene.state.name}</i></b>\n\nPlease enter your password. <i>(You will need to use this password for any transactions)</i>\n\n<i>password should be no longer than 12 characters</i>`,
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

        if (password.length < 6) {
            return ctx.reply(
                '⚠ Password should be longer than 6 characters, Please try again',
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
        } else if (password.length > 12) {
            return ctx.reply(
                `⚠ Password shouldn't be longer than 12 characters, Please try again`,
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
        }
        
        // delete password
        await ctx.deleteMessage(ctx.message.message_id).catch((err: any) => { });
        // await ctx.reply(`🏆 You will need to use this password for any transactions.`)
        // Return the result
        ctx.scene.enter(next, { password: password, name: ctx.scene.state.name });
    }
});