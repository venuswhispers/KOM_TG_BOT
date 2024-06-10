import { 
    menu
} from '../../controllers/staking/v3/main.controller';

export default (_bot: any) => {
    _bot.command('menu_staking_v3', menu);
}


