import { Scenes, Context } from 'telegraf';
import { 
    // callbackQueryForTransferStakership, 
    enterScene, 
    textHandler 
} from '../../../controllers/staking/v3/transferStakership.controller';

// Create a new scene
export const transferStakershipScene = new Scenes.BaseScene<Context>('transferStakershipScene');

// enter transferstakership scene
transferStakershipScene.enter( enterScene );

// Handle the password input
transferStakershipScene.on('text', textHandler);

// callback query
// transferStakershipScene.on('callback_query', callbackQueryForTransferStakership);