import { createCallBackBtn } from "../utils";
import { Context } from "telegraf";
import { 
    menu as menu_staking,
} from './staking';
import { 
    switchChain as swithChain_staking,
} from './main.controller';
import { 
    menu as menu_staking_v3,
    stakingV3_ongoing_staking_details,
    switchChain as switchChain_staking_v3,
    staingV3_past_staking_details
} from "./staking/v3/main.controller";
import { 
    menu as menu_staking_lp,
    switchChain as switchChain_staking_lp
} from "./staking/lp/main.controller";
import { menu as menu_staking_v1 } from "./staking/v1/main.controller";
import { menu as menu_staking_v2 } from "./staking/v2/main.controller";

import { KOM_TOKEN_IMAGE, KOM_WELCOME_IMAGE } from "../../constants/pictures";
import { chart, leaderBoard } from "./staking/v3/main.controller";
import { acceptStakershipScene } from "./staking/v3/acceptStakership.controller";
import { connectWallet, deleteWallet, showWallets } from "./wallet/wallet.controller";

/**
 * show wallet select option at start
 * @param ctx 
 * @param noWallet 
 */
export const start = async (ctx: Context, noWallet: boolean = false) => {
    const message = 
        !noWallet ? `🎉 Welcome to the KOM trading Bot!\n\nDo you have an existing wallet or create new one?`
        : `⚠ You have no wallet!\n\nDo you have an existing wallet or create new one?`;

    // Create a buttons for creating and exporting wallets
    const createWalletButton = createCallBackBtn("Create New Wallet", "create_wallet");
    const importWalletButton = createCallBackBtn("Import Existing Wallet", "import_wallet");
    // Send message with the import wallet button
    await ctx.replyWithVideo(
        KOM_WELCOME_IMAGE,
        {
            height: 720,
            width: 1280,
            caption: message,
            parse_mode: "HTML",
            reply_markup: {
                inline_keyboard: [[createWalletButton, importWalletButton]],
            },
        }
    );
}

/**
 * show main menu after selecting wallet option
 * @param ctx 
 */
export const menu = async (ctx: any) => {
    const chainId = ctx.session.chainId ?? 137;

    // Send message with the import wallet button
    const message = 
        `<b>⚡ Welcome to Ronaldo Kommunitas</b>\n\n` +
        `⚠️ We strongly advise that you use any of the following bots to trade with. You will have the same wallets and settings across all bots, but any of the below will be significantly faster due to lighter user load.` +
        `\n\n<i>Choose an option below...</i>  👇🏻`;
    ctx.replyWithPhoto(
        KOM_TOKEN_IMAGE, 
        {
            caption: message,
            parse_mode: "HTML",
            reply_markup: {
                keyboard: [
                    [{ text: 'Wallet 🛒' }],
                    [{ text: 'Staking ⏱' }, { text: 'LaunchPad ⚙' }],
                    [{ text: 'Bridge ' }, { text: 'Buy KOM ⭐' }],
                    // [{ text: chainId === 137 ? 'Switch to Arbitrum' : 'Switch to Polygon' }],
                ],
                resize_keyboard: true,
                // one_time_keyboard: true,
        },
    });
}

/**
 * switch chain in main menu
 * @param ctx 
 */
export const switchChain = async (ctx: any) => {
    const chainId = ctx.session.chainId ?? 137;
    if (chainId === 137 || !chainId) {
        ctx.session.chainId = 42161;
    } else {
        ctx.session.chainId = 137;
    }
    menu_staking (ctx);
}

export const textHandler = async (ctx: any) => {
    const selectedOption = ctx.message.text;
    console.log({
        selectedOption
    })

    switch (selectedOption) {
        case "Staking ⏱":
            return menu_staking (ctx);
        // ---------------------------------------------------------------- staking --------------------------------------------------------------------------------
        case "Wallet 🛒":
            return showWallets (ctx);
        case "Refresh ❄":
            await ctx.scene.leave ();
            return menu_staking (ctx);
        case 'Switch to Arbitrum 💫':
            return swithChain_staking (ctx);
        case 'Switch to Polygon 💫':
            return swithChain_staking (ctx);
        case 'Staking LP 💦' :
            return menu_staking_lp (ctx);
        case "Staking V1":
            return menu_staking_v1 (ctx);
        case "Staking V2": 
            return menu_staking_v2 (ctx);
        case 'Staking V3 ⏰':
            return menu_staking_v3 (ctx);
        case '👈 Back To Main Menu' :
            return menu (ctx);
        // --------------------------------------------------------------- staking v3 --------------------------------------------------------------------------------
        case "Refresh 🎲":
            return menu_staking_v3 (ctx);
        case "Switch to Arbitrum 🎨":
            return switchChain_staking_v3 (ctx);
        case "Switch to Polygon 🎨":
            return switchChain_staking_v3 (ctx);
        case "Staking Chart / Percentage 📈":
            return chart (ctx);
        case "Staking V3 Leaderboard 🏆":
            return leaderBoard (ctx);
        case "Stake ⏱":
            return ctx.scene.enter("stakingV3Scene");
        case "👈 BACK":
            return menu (ctx);
        case "Transfer Stakership 🚀":
            return ctx.scene.enter("transferStakershipScene");
        case "My Ongoing Staking Details 🏅":
            return stakingV3_ongoing_staking_details (ctx);
        case "My Past Staking Details 🥇":
            return staingV3_past_staking_details (ctx);
        case "👈 Back To Staking Menu":
            return menu_staking(ctx);
        // ---------------------------------------------------------------- staking lp -----------------------------------------------------------------
        case "Refresh 💫": 
            return menu_staking_lp (ctx);
        case "Stake 🎨":
            return ctx.scene.enter("stakingLPScene");
        case "Switch to Arbitrum 💦":
            return switchChain_staking_lp (ctx);
        case "Switch to Polygon 💦":
            return switchChain_staking_lp (ctx);
        // ----------------------------------------------------------------- staking v1 ----------------------------------------------------------------
        default:
            break;
    }

    if (selectedOption.includes("Accept Stakership from ")) {
        acceptStakershipScene (ctx);
    }
}

export const callbackQuery = async (ctx: any) => {
    const selectedOption = ctx.callbackQuery.data;

    if (selectedOption.includes('v3_withdraw_')) { // click withdraw button
        const [version, name, index] = selectedOption.split("_");
        ctx.answerCbQuery(`You are going to withdraw with version ${version} on index ${index}`);
        ctx.scene.enter("withdrawV3Scene", { withdraw: { version, index } });
    } else if (selectedOption.includes('v3_changeCompoundMode')) { // click withdraw button
        const [version, name, index] = selectedOption.split("_");
        ctx.answerCbQuery(`You are going to change compound mode with version ${version} on index ${index}`);
        ctx.scene.enter("changeCompoundModeScene", { state: { version, index } });
    } else if (selectedOption.includes('connect_wallet_')) {
        const [,,index] = selectedOption.split("_");
        connectWallet (ctx, index);
    } else if (selectedOption.includes('delete_wallet_')) {
        const [,,index] = selectedOption.split("_");
        return ctx.scene.enter("deleteWalletScene", { index });
    }
}