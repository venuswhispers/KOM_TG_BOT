import { 
    menu
} from '../../controllers/launchpad';

export default (_bot: any) => {
    _bot.command('launchpad', menu);
    _bot.command('a', menu);
}


