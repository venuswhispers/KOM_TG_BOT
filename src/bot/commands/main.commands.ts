import {
    start,
    menu,
    textHandler,
    callbackQuery
} from '../controllers/main.controller';

export default (_bot: any) => {
    // start
    _bot.command("start", start);
    _bot.action("start", start);

    // menu
    _bot.command('menu', menu);
    _bot.action('menu', menu);

    // text
    _bot.on("text", textHandler);
    // callback
    _bot.on('callback_query', callbackQuery);
}

