import { 
    menu
} from '@/bot/controllers/staking/v1/main.controller';

export default (_bot: any) => {
    _bot.command('menu_staking_v1', menu);
}


