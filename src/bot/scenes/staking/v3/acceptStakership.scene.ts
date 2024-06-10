import { Telegraf, Scenes, session, Context } from 'telegraf';
import { 
    enterScene, 
    textHandler, 
} from '../../../controllers/staking/v3/acceptStakership.controller';

// Create a new scene
export const acceptStakershipScene = new Scenes.BaseScene<Context>('acceptStakershipScene');

acceptStakershipScene.enter( enterScene );
acceptStakershipScene.on('text', textHandler);
