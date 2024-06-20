import {
    welcome,
    menu,
    textHandler,
    messageHandler,
    callbackQuery
} from '@/bot/controllers/main.controller';
import { Markup } from 'telegraf';

export default (_bot: any) => {
    // start
    _bot.command("start", welcome);
    _bot.action("start", welcome);

    // menu
    _bot.command('menu', menu);
    _bot.action('menu', menu);

    // _bot.hears('Wallet 🧰', (ctx: any) => {
    //     return ctx.answerInlineQuery('asdfasdfsadf');
    //     ctx.reply('Action 1 was triggered.');
    // });

    _bot.on("text", textHandler);
    // message from web app
    _bot.on("message", messageHandler);
    // callback
    _bot.on('callback_query', callbackQuery);

    
}

