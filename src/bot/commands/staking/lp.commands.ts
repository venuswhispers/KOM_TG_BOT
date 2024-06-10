import { 
    menu
} from '../../controllers/staking/lp/main.controller';

export default (_bot: any) => {
    _bot.command('menu_staking_lp', menu);
}


