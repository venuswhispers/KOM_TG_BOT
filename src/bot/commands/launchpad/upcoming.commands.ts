import { 
    detail,
    menu
} from '@/bot/controllers/launchpad/upcoming.controller';

export default (_bot: any) => {
    _bot.command('launchpad_upcoming', menu);
}


