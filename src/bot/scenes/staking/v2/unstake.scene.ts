import { Scenes, Context } from 'telegraf';
import { callbackQuery, enterScene, textHandler } from '../../../controllers/staking/v2/claim.controller';

// Create a new scene
export const claimWithV2Scene = new Scenes.BaseScene<Context>('claimWithV2Scene');

// enter staing scene
claimWithV2Scene.enter( enterScene );
// Handle the password input
claimWithV2Scene.on('text', textHandler);
// Handle the password prompt
claimWithV2Scene.on('callback_query', callbackQuery);