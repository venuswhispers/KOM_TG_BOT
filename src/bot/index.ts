import { Telegraf, Scenes, session } from "telegraf";
// scenes
import { 
  stakingV3Scene,
  withdrawV3Scene,
  transferStakershipScene,
  acceptStakershipScene,
  changeCompoundModeScene,
  stakingLPScene,
  claimWithV1Scene,
  claimWithV2Scene,
} from "./scenes";
// commands
import mainCommands from "./commands/main.commands";
import stakingCommands from "./commands/staking";
import launchpadCommands from './commands/launchpad';

export default () => {
  const _bot = new Telegraf(process.env.BOT_TOKEN, {
    handlerTimeout: 9_000_000, // 2.5 hours in milliseconds
  });
  //@ts-ignore
  const stages = new Scenes.Stage([stakingV3Scene, withdrawV3Scene, transferStakershipScene, acceptStakershipScene, changeCompoundModeScene, stakingLPScene, claimWithV1Scene, claimWithV2Scene]);
  // use TG's session
  _bot.use(session());
  // use tg scene's middlewares
  _bot.use(stages.middleware());
  //set commands
  const commands = [
    { command: '/start', description: 'Start a dialogue with the bot' },
    { command: '/launchpad_upcoming', description: 'Show lanunchpad menu' },
    { command: '/menu', description: 'Show Main Menu' },
    { command: '/menu_staking', description: 'Show Menu for Stakings' },
    { command: '/menu_staking_v1', description: 'Show Menu for Staking V1' },
    { command: '/menu_staking_v2', description: 'Show Menu for Staking V2' },
    { command: '/menu_staking_v3', description: 'Show Menu for Staking V3' },
    { command: '/menu_staking_lp', description: 'Show Menu for Staking LP' },
    { command: '/launchpad', description: 'Show lanunchpad menu' },
    { command: '/launchpad_active', description: 'Show lanunchpad menu' },
    { command: '/launchpad_ended', description: 'Show lanunchpad menu' },
    { command: '/launchpad_vesting', description: 'Show lanunchpad menu' },
    { command: '/help', description: 'Get help and instructions' },
  ];
  _bot.telegram.setMyCommands(commands);
  // launch TG bot instance
  _bot.launch();
  // staking comds
  stakingCommands (_bot);
  // launchpad comds
  launchpadCommands (_bot);
  // main comds
  mainCommands (_bot);
  console.log("start..");
}