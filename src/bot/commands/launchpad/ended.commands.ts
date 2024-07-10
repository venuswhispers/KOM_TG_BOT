

import { 
    detail,
    menu
} from '@/bot/controllers/launchpad/ended.controller';

export default (_bot: any) => {
    _bot.command('launchpad_ended', menu);
    _bot.command('end', detail);
}


