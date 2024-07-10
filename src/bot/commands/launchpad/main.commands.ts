import { 
    menu
} from '@/bot/controllers/launchpad/index';

export default (_bot: any) => {
    _bot.command('launchpad', menu);
}


