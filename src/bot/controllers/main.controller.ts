import { createCallBackBtn } from "../utils";
import { Context } from "telegraf";
import { Markup } from "telegraf";
//////// staking ////////////////////////////////////////////////
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
import {
    menu as menu_staking_v1
} from "./staking/v1/main.controller";
import {
    menu as menu_staking_v2
} from "./staking/v2/main.controller";

///////// launchpad  ////////////////////////////////////////////
import {
    menu as menu_launchpad
} from './launchpad';
import {
    menu as menu_launchpad_upcoming
} from './launchpad/upcoming.controller';
import {
    menu as menu_launchpad_ended
} from './launchpad/ended.controller';
import {
    menu as menu_launchpad_active
} from './launchpad/active.controller';
import {
    menu as menu_launchpad_vesting
} from './launchpad/vesting.controller';


import { KOM_TOKEN_IMAGE, KOM_WELCOME_IMAGE } from "../../constants/pictures";
import { chart, leaderBoard } from "./staking/v3/main.controller";
import { acceptStakershipScene } from "./staking/v3/acceptStakership.controller";
import { connectWallet, showWallets } from "./wallet/wallet.controller";
import { pay } from "telegraf/typings/button";


/**
 * show wallet select option at start
 * @param ctx 
 * @param noWallet 
 */
export const startNoWallet = async (ctx: Context) => {
    const msg = `⚠ You have no wallet!\n\nDo you have an existing wallet or create new one?`;
    // Create a buttons for creating and exporting wallets
    // Send message with the import wallet button
    await ctx.replyWithVideo(
        KOM_WELCOME_IMAGE,
        {
            caption: msg,
            parse_mode: "HTML",
            reply_markup: {
                keyboard: [
                    [Markup.button.webApp("Create New Wallet", `${process.env.MINIAPP_URL}/wallet/create`)],
                    [Markup.button.webApp("Import Existing Wallet", `${process.env.MINIAPP_URL}/wallet/import`)],
                ],
                resize_keyboard: true,
            }
        }
    );
}
/**
 * show wallet select option at start
 * @param ctx 
 * @param noWallet 
 */
export const welcome = async (ctx: Context) => {
    const welcome =
        `🎉 Hey There, <b>${ctx.from.username}!</b>\n` +
        `I'm <a><u>@Kommunitas</u></a> TG Bot.\n` +
        `Basically, I will be your bot to access some (hopefully all) features in <a href='https://www.kommunitas.net/'>Kommunitas Website</a>.\n` +
        `🏆 You can create a new wallet OR import your existing wallet if you have interacted with Kommunitas before.\n\n` +
        `<i>Please note that if you delete the chat with me, you will need to start all over again with the wallet connection or creation.</i>`;

    // Send message with the import wallet button
    await ctx.replyWithVideo(
        KOM_WELCOME_IMAGE,
        {
            caption: welcome,
            parse_mode: "HTML",
            reply_markup: {
                keyboard: [
                    [Markup.button.webApp("Create New Wallet", `${process.env.MINIAPP_URL}/wallet/create`)],
                    [Markup.button.webApp("Import Existing Wallet", `${process.env.MINIAPP_URL}/wallet/import`)],
                    // [{ text: '👈 Back To Main Menu' }],
                ],
                resize_keyboard: true,
            }
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
        `<b>⚡ Welcome to Kommunitas!</b>\n\n` +
        `To understand our complete ecosystem, please visit our <a href='https://www.kommunitas.net/'>Website</a>, All <a href='https://linktr.ee/kommunitas'>Social Media</a>, and <a href='https://docs.kommunitas.net'>Docs</a>` +
        `\n\n<i>💬 Now you can stake, vote, and participate in Kommunitas Ecosystem by only using your telegram.</i>\n` +
        `\n<i>Choose an option below...</i>  👇🏻`;
    ctx.replyWithVideo(
        KOM_TOKEN_IMAGE,
        {
            caption: message,
            parse_mode: "HTML",
            reply_markup: {
                keyboard: [
                    [Markup.button.webApp("Wallet 🧰", `${process.env.MINIAPP_URL}?chainId=${chainId}`), { text: 'Staking ⏱' }],
                    [{ text: 'LaunchPad 🚀' }, { text: 'Bridge 🖇' }],
                    [{ text: 'Buy KOM ⭐' }, { text: 'Earn 💎' }],
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
    menu_staking(ctx);
}

export const textHandler = async (ctx: any) => {
    const selectedOption = ctx.message.text;
    console.log({
        selectedOption
    })

    switch (selectedOption) {
        case "Staking ⏱":
            return menu_staking(ctx);
        // ---------------------------------------------------------------- staking --------------------------------------------------------------------------------
        case "Wallet 🧰":
            return showWallets (ctx);
        // return console.log(ctx)
        case "Refresh ❄":
            await ctx.scene.leave();
            return menu_staking(ctx);
        case 'Switch to Arbitrum 💫':
            return swithChain_staking(ctx);
        case 'Switch to Polygon 💫':
            return swithChain_staking(ctx);
        case 'Staking LP 💦':
            return menu_staking_lp(ctx);
        case "Staking V1":
            return menu_staking_v1(ctx);
        case "Staking V2":
            return menu_staking_v2(ctx);
        case 'Staking V3 ⏰':
            return menu_staking_v3(ctx);
        case '👈 Back To Main Menu':
            return menu(ctx);
        // --------------------------------------------------------------- staking v3 --------------------------------------------------------------------------------
        case "Refresh 🎲":
            return menu_staking_v3(ctx);
        case "Switch to Arbitrum 🎨":
            return switchChain_staking_v3(ctx);
        case "Switch to Polygon 🎨":
            return switchChain_staking_v3(ctx);
        case "Staking Chart / Percentage 📈":
            return chart(ctx);
        case "Staking V3 Leaderboard 🏆":
            return leaderBoard(ctx);
        case "Stake ⏱":
            return ctx.scene.enter("stakingV3Scene");
        case "👈 BACK":
            return menu(ctx);
        case "Transfer Stakership 🚀":
            return ctx.scene.enter("transferStakershipScene");
        case "My Ongoing Staking Details 🏅":
            return stakingV3_ongoing_staking_details(ctx);
        case "My Past Staking Details 🥇":
            return staingV3_past_staking_details(ctx);
        case "👈 Back To Staking Menu":
            return menu_staking(ctx);
        // ---------------------------------------------------------------- staking lp -----------------------------------------------------------------
        case "Refresh 💫":
            return menu_staking_lp(ctx);
        case "Stake 🎨":
            return ctx.scene.enter("stakingLPScene");
        case "Switch to Arbitrum 💦":
            return switchChain_staking_lp(ctx);
        case "Switch to Polygon 💦":
            return switchChain_staking_lp(ctx);
        // -----------------------------------------------------------------  staking v1 and v2 -------------------------------------------------------
        case "Claim 👏":
            return ctx.scene.enter("claimWithV1Scene");
        case "Claim 🎬":
            return ctx.scene.enter("claimWithV2Scene");

        // ----------------------------------------------------------------- launchpad ----------------------------------------------------------------
        case "LaunchPad ⚙":
            return menu_launchpad(ctx);
        case "Upcoming 💤":
            return menu_launchpad_upcoming(ctx);
        case "Active 🟢":
            return menu_launchpad_active(ctx);
        case "Ended ⏱'":
            return menu_launchpad_ended(ctx);
        case "Vesting 💎":
            return menu_launchpad_vesting(ctx);

        default:
            break;
    }

    if (selectedOption.includes("Accept Stakership from ")) {
        acceptStakershipScene(ctx);
    }
}

export const messageHandler = async (ctx: any) => {
    const webAppData = ctx.message.web_app_data;
    if (!webAppData) return;
    
    const { button_text } = webAppData;
    const { type, payload } = JSON.parse(webAppData.data);


   console.log("from web app-----------", type, payload);

    switch (type) {
        case "NEW_ACCOUNT_ADDED":
            ctx.session.account = payload.account;
            ctx.reply(`😁 New Account <b><i><code>${payload.address.address}</code></i></b> <i>(${payload.address.name})</i> has been added.`, { parse_mode: "HTML" });
            return menu(ctx);
        case "NEW_ACCOUNT_IMPORTED":
            ctx.session.account = payload.account;
            ctx.reply(`😁 New Account <b><i><code>${payload.address.address}</code></i></b> <i>(${payload.address.name})</i> has been imported.`, { parse_mode: "HTML" });
            return menu(ctx);
        case "NEW_WALLET_CREATED":
            ctx.session.account = payload;
            ctx.reply(`😁 New Wallet <b><i><code>${payload.address}</code></i></b> <i>(${payload.name})</i> has been created.`, { parse_mode: "HTML" });
            return menu(ctx);
        case "NEW_WALLET_IMPORTED":
            ctx.session.account = payload;
            ctx.reply(`😁 New Wallet <b><i><code>${payload.address}</code></i></b> <i>(${payload.name})</i> has been imported.`, { parse_mode: "HTML" });
            return menu(ctx);
        case "CHAIN_SWITCHED":
            ctx.session.chainId = payload.chainId;

            if (button_text.includes('💫')) {
                return menu_staking (ctx);
            }




            return menu(ctx);
        case 'Switch to Arbitrum 💫':
            return swithChain_staking(ctx);
        case 'Switch to Polygon 💫':
            return swithChain_staking(ctx);
        case 'Staking LP 💦':
            return menu_staking_lp(ctx);
        case "Staking V1":
            return menu_staking_v1(ctx);
        case "Staking V2":
            return menu_staking_v2(ctx);
        case 'Staking V3 ⏰':
            return menu_staking_v3(ctx);
        case '👈 Back To Main Menu':
            return menu(ctx);
        // --------------------------------------------------------------- staking v3 --------------------------------------------------------------------------------
        case "Refresh 🎲":
            return menu_staking_v3(ctx);
        case "Switch to Arbitrum 🎨":
            return switchChain_staking_v3(ctx);
        case "Switch to Polygon 🎨":
            return switchChain_staking_v3(ctx);
        case "Staking Chart / Percentage 📈":
            return chart(ctx);
        case "Staking V3 Leaderboard 🏆":
            return leaderBoard(ctx);
        case "Stake ⏱":
            return ctx.scene.enter("stakingV3Scene");
        case "👈 BACK":
            return menu(ctx);
        case "Transfer Stakership 🚀":
            return ctx.scene.enter("transferStakershipScene");
        case "My Ongoing Staking Details 🏅":
            return stakingV3_ongoing_staking_details(ctx);
        case "My Past Staking Details 🥇":
            return staingV3_past_staking_details(ctx);
        case "👈 Back To Staking Menu":
            return menu_staking(ctx);
        // ---------------------------------------------------------------- staking lp -----------------------------------------------------------------
        case "Refresh 💫":
            return menu_staking_lp(ctx);
        case "Stake 🎨":
            return ctx.scene.enter("stakingLPScene");
        case "Switch to Arbitrum 💦":
            return switchChain_staking_lp(ctx);
        case "Switch to Polygon 💦":
            return switchChain_staking_lp(ctx);
        // -----------------------------------------------------------------  staking v1 and v2 -------------------------------------------------------
        case "Claim 👏":
            return ctx.scene.enter("claimWithV1Scene");
        case "Claim 🎬":
            return ctx.scene.enter("claimWithV2Scene");

        // ----------------------------------------------------------------- launchpad ----------------------------------------------------------------
        case "LaunchPad ⚙":
            return menu_launchpad(ctx);
        case "Upcoming 💤":
            return menu_launchpad_upcoming(ctx);
        case "Active 🟢":
            return menu_launchpad_active(ctx);
        case "Ended ⏱'":
            return menu_launchpad_ended(ctx);
        case "Vesting 💎":
            return menu_launchpad_vesting(ctx);

        default:
            break;
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
        const [, , index] = selectedOption.split("_");
        connectWallet(ctx, index);
    } else if (selectedOption.includes('delete_wallet_')) {
        const [, , index] = selectedOption.split("_");
        return ctx.scene.enter("deleteWalletScene", { index });
    }
}