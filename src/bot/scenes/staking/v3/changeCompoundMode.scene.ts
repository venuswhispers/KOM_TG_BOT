import { Scenes, Context } from 'telegraf';
import { enterScene, textHandler, callbackQuery } from '../../../controllers/staking/v3/changeCompoundMode.controller';

// Create a new scene
export const changeCompoundModeScene = new Scenes.BaseScene<Context>('changeCompoundModeScene');

// enter staing scene
changeCompoundModeScene.enter( enterScene );
// Handle the password input
changeCompoundModeScene.on('text', textHandler);
// Handle the password prompt
changeCompoundModeScene.on('callback_query', callbackQuery);