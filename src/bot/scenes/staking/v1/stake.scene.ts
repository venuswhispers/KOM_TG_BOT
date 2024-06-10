import { Scenes, Context } from 'telegraf';
import { callbackQuery, enterScene, textHandler } from '../../../controllers/staking/v1/staking.controller';

// Create a new scene
export const stakingV1Scene = new Scenes.BaseScene<Context>('stakingV1Scene');

// enter staing scene
stakingV1Scene.enter( enterScene );
// Handle the password input
stakingV1Scene.on('text', textHandler);
// Handle the password prompt
stakingV1Scene.on('callback_query', callbackQuery);