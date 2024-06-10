import { Scenes, Context } from 'telegraf';
import { callbackQuery, enterScene, textHandler } from '../../../controllers/staking/lp/staking.controller';

// Create a new scene
export const stakingLPScene = new Scenes.BaseScene<Context>('stakingLPScene');

// enter staing scene
stakingLPScene.enter( enterScene );
// Handle the password input
stakingLPScene.on('text', textHandler);
// Handle the password prompt
stakingLPScene.on('callback_query', callbackQuery);