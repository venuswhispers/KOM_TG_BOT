import { Scenes, Context } from 'telegraf';
import { callbackQuery, enterScene, textHandler } from '../../../controllers/staking/v1/claim.controller';

// Create a new scene
export const claimWithV1Scene = new Scenes.BaseScene<Context>('claimWithV1Scene');

// enter staing scene
claimWithV1Scene.enter( enterScene );
// Handle the password input
claimWithV1Scene.on('text', textHandler);
// Handle the password prompt
claimWithV1Scene.on('callback_query', callbackQuery);