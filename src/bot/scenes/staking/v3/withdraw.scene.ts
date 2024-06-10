import { Scenes, Context } from 'telegraf';
import { 
    enterScene, 
    textHandler,
    callbackQuery
} from '../../../controllers/staking/v3/withdraw.controller';

export const withdrawV3Scene = new Scenes.BaseScene<Context>('withdrawV3Scene');

// enter withdraw scene
withdrawV3Scene.enter( enterScene );
// text handler
withdrawV3Scene.on('text', textHandler);
// callback query
withdrawV3Scene.on('callback_query', callbackQuery);