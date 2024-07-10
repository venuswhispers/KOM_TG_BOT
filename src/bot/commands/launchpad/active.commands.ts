
import { 
    detail,
    menu
} from '@/bot/controllers/launchpad/active.controller';

export default (_bot: any) => {
    _bot.command('launchpad_active', menu);
}


