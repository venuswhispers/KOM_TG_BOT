import { Scenes, Context } from 'telegraf';
import { callbackQuery, enterScene, textHandler } from '../../../controllers/staking/v2/staking.controller';

// Create a new scene
export const stakingV2Scene = new Scenes.BaseScene<Context>('stakingV2Scene');

// enter staing scene
stakingV2Scene.enter( enterScene );
// Handle the password input
stakingV2Scene.on('text', textHandler);
// Handle the password prompt
stakingV2Scene.on('callback_query', callbackQuery);