import { 
    menu
} from '@/bot/controllers/staking/index';

export default (_bot: any) => {
    _bot.command('menu_staking', menu);
}


