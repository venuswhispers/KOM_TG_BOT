import { Telegraf, Scenes, session } from "telegraf";
// scenes
import { 
  importWalletScene, 
  createWalletScene, 
  exportWalletScene,
  passwordScene, 
  walletScene,
  stakingV3Scene,
  withdrawV3Scene,
  transferStakershipScene,
  acceptStakershipScene,
  changeCompoundModeScene,
  stakingLPScene,
  claimWithV1Scene,
  claimWithV2Scene,
  deleteWalletScene
} from "./scenes";

// commands
import mainCommands from "./commands/main.commands";
import stakingV1Commands from "./commands/staking/stakingV1.commands";
import stakingV2Commands from "./commands/staking/stakingV2.commands";
import stakingV3Commands from "./commands/staking/stakingV3.commands";
import stakingLPCommands from './commands/staking/lp.commands';
import walletCommands from "./commands/wallet/wallet.commands";
import launchpadCommands from './commands/launchpad/index.commands';

export default () => {
  const _bot = new Telegraf(process.env.BOT_TOKEN, {
    handlerTimeout: 9_000_000, // 2.5 hours in milliseconds
  });
  //@ts-ignore
  const stages = new Scenes.Stage([passwordScene, createWalletScene, exportWalletScene, importWalletScene, stakingV3Scene, withdrawV3Scene, transferStakershipScene, acceptStakershipScene, changeCompoundModeScene, stakingLPScene, claimWithV1Scene, claimWithV2Scene, walletScene, deleteWalletScene]);
  // use TG's session
  _bot.use(session());
  // use tg scene's middlewares
  _bot.use(stages.middleware());


  _bot.command("session", (ctx: any) => {
    console.log(ctx.session)
  })

  //set commands
  const commands = [
    { command: '/start', description: 'Start a dialogue with the bot' },
    { command: '/menu', description: 'Show Main Menu' },
    { command: '/menu_staking', description: 'Show Menu for Stakings' },
    { command: '/menu_staking_v1', description: 'Show Menu for Staking V1' },
    { command: '/menu_staking_v2', description: 'Show Menu for Staking V2' },
    { command: '/menu_staking_v3', description: 'Show Menu for Staking V3' },
    { command: '/menu_staking_lp', description: 'Show Menu for Staking LP' },
    { command: '/create_wallet', description: 'Create New Wallet' },
    { command: '/import_wallet', description: 'Import Existing Wallet' },
    { command: '/export_wallet', description: 'Export Wallet Private Key' },
    { command: '/launchpad', description: 'Show lanunchpad menu' },
    { command: '/help', description: 'Get help and instructions' },
  ];

  _bot.telegram.setMyCommands(commands);

  // launch TG bot instance
  _bot.launch();

  // commands settings
  walletCommands (_bot);
  stakingLPCommands (_bot);
  stakingV3Commands (_bot);
  stakingV1Commands (_bot);
  stakingV2Commands (_bot);
  launchpadCommands (_bot);
  mainCommands (_bot);
  
  console.log("start..");

}