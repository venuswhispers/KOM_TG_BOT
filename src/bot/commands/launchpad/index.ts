import upcomingCommands from './upcoming.commands';
import mainCommands from './main.commands';
import activeCommands from './active.commands';
import endedCommands from './ended.commands';
import vestingCommands from './vesting.commands';

export default (_bot: any) => {
    mainCommands (_bot);
    upcomingCommands (_bot);
    activeCommands (_bot);
    endedCommands (_bot);
    vestingCommands (_bot);
}


