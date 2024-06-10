import { 
    menu
} from '../../controllers/staking/v2/main.controller';

export default (_bot: any) => {
    _bot.command('menu_staking_v2', menu);
}


