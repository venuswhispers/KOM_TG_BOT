import { Scenes, Context } from 'telegraf';
import { callbackQuery, enterScene, textHandler } from '../../../controllers/staking/v3/staking.controller';

// Create a new scene
export const stakingV3Scene = new Scenes.BaseScene<Context>('stakingV3Scene');

// enter staing scene
stakingV3Scene.enter( enterScene );
// Handle the password input
stakingV3Scene.on('text', textHandler);
// Handle the password prompt
stakingV3Scene.on('callback_query', callbackQuery);