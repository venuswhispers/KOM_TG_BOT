import { 
    menu
} from '../../controllers/staking/index';

export default (_bot: any) => {
    _bot.command('menu_staking_lp', menu);
}


