import { 
    menu,
    chart,
    leaderBoard
} from '@/bot/controllers/staking/v3/main.controller';

export default (_bot: any) => {
    _bot.command('menu_staking_v3', menu);
    _bot.command('chart', chart);
    _bot.command('leaderboard', leaderBoard);
}


