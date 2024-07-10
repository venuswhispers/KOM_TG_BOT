

import { 
    detail,
    menu
} from '@/bot/controllers/launchpad/vesting.controller';

export default (_bot: any) => {
    _bot.command('launchpad_vesting', menu);
    _bot.command('vest', detail);
}