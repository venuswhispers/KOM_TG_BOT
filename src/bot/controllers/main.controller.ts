import { Markup } from "telegraf";
//////// staking ////////////////////////////////////////////////
import {
    menu as menu_staking,
} from './staking';
import {
} from './main.controller';
import {
    menu as menu_staking_v3,
    stakingV3_ongoing_staking_details,
    staingV3_past_staking_details
} from "./staking/v3/main.controller";
import {
    menu as menu_staking_lp,
} from "./staking/lp/main.controller";
import {
    menu as menu_staking_v1
} from "./staking/v1/main.controller";
import {
    menu as menu_staking_v2
} from "./staking/v2/main.controller";

///////// launchpad  ////////////////////////////////////////////
import {
    handleBack,
    handleNext,
    handlePagination,
    menu as menu_launchpad
} from './launchpad';
import {
    detail as detail_launchpad_upcoming,
    menu as menu_launchpad_upcoming
} from './launchpad/upcoming.controller';
import {
    menu as menu_launchpad_active,
    detail as detail_launchpad_active
} from './launchpad/active.controller';
import {
    menu as menu_launchpad_ended,
    detail as detail_launchpad_ended
} from './launchpad/ended.controller';
import {
    menu as menu_launchpad_vesting,
    detail as detail_launchpad_vesting
} from './launchpad/vesting.controller';


import { KOM_TOKEN_IMAGE, KOM_WELCOME_IMAGE } from "@/constants/pictures";
import { chart, leaderBoard } from "./staking/v3/main.controller";
import { acceptStakershipScene } from "./staking/v3/acceptStakership.controller";
import { chains } from "@/constants/config";

/**
 * show wallet select option at start
 * @param ctx 
 * @param noWallet 
 */
export const startNoWallet = async (ctx: any) => {
    const chainId = ctx.session.chainId ?? 137;
    const msg = `⚠ No connected wallet!\n\nPlease connect wallet first... 👇`;
    // Create a buttons for creating and exporting wallets
    // Send message with the import wallet button
    await ctx.replyWithVideo(
        KOM_WELCOME_IMAGE,
        {
            caption: msg,
            parse_mode: "HTML",
            reply_markup: {
                keyboard: [
                    [Markup.button.webApp("Connect Wallet 🧰", `${process.env.MINIAPP_URL}?chainId=${chainId}&forWalletConnection=true`)],
                    [{ text: 'Menu 🎨' }],
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
export const welcome = async (ctx: any) => {
    const chainId = ctx.session.chainId ?? 137;
    const account = ctx.session.account;
    const welcome =
        `🎉 Hey There, <b>${ctx.from.username}!</b>\n` +
        `I'm <a><u>@Kommunitas</u></a> TG Bot.\n` +
        `Basically, I will be your bot to access some (hopefully all) features in <a href='https://www.kommunitas.net/'>Kommunitas Website</a>.\n` +
        `🏆 You can create a new wallet OR import your existing wallet if you have interacted with Kommunitas before.\n\n` +
        `<i>Please note that if you delete the chat with me, you will need to connect with mini app for wallet connect.</i>` +
        (!account ? `<i>\n\n⚠ No connected wallet, Please connect wallet... 👇</i>` : '');

    // Send message with the import wallet button
    await ctx.replyWithVideo(
        KOM_WELCOME_IMAGE,
        {
            caption: welcome,
            parse_mode: "HTML",
            reply_markup: {
                keyboard: !account ?
                    [
                        [Markup.button.webApp("Connect Wallet 🧰", `${process.env.MINIAPP_URL}?chainId=${chainId}&forWalletConnection=true`)],
                        [{ text: 'Menu 🎨' }],
                    ] :
                    [
                        [Markup.button.webApp("Add New Account ✨", `${process.env.MINIAPP_URL}/account/add?chainId=${chainId}&forWallet=true`), Markup.button.webApp("Import Existing Account 🎲", `${process.env.MINIAPP_URL}/account/import?chainId=${chainId}&forWallet=true`)],
                        [Markup.button.webApp("Switch Account 🧾", `${process.env.MINIAPP_URL}?chainId=${chainId}&forAccountSelection=true`), Markup.button.webApp('Switch Chain 🔗', `${process.env.MINIAPP_URL}?chainId=${chainId}&forChainSelection=true`)],
                        [],
                        [{ text: 'Menu 🎨' }],
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
                    [Markup.button.webApp("Wallet 🧰", `${process.env.MINIAPP_URL}?chainId=${chainId}&forWallet=true`), { text: 'Staking ⏱' }],
                    [{ text: 'LaunchPad 🚀' }, { text: 'Bridge 🖇' }],
                    [{ text: 'Buy KOM ⭐' }, { text: 'Earn 💎' }],
                ],
                resize_keyboard: true,
            },
        });
}

export const textHandler = async (ctx: any) => {
    const selectedOption = ctx.message.text;

    if (!isNaN(Number(selectedOption))) {
        return handlePagination(ctx, Number(selectedOption));
    }

    switch (selectedOption) {
        case "Staking ⏱":
            return menu_staking(ctx);
        // ---------------------------------------------------------------- staking --------------------------------------------------------------------------------
        case "Menu 🎨":
            return menu(ctx);
        case "Refresh ❄":
            await ctx.scene.leave();
            return menu_staking(ctx);
        case 'Staking LP ⭐':
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
        // -----------------------------------------------------------------  staking v1 and v2 -------------------------------------------------------
        case "Claim 👏":
            return ctx.scene.enter("claimWithV1Scene");
        case "Claim 🎬":
            return ctx.scene.enter("claimWithV2Scene");
        // ----------------------------------------------------------------- launchpad ----------------------------------------------------------------
        case "LaunchPad 🚀":
            return menu_launchpad(ctx);
        case "Upcoming 💤":
            ctx.session.page = 1;
            return menu_launchpad_upcoming(ctx);
        case "Active ⚡":
            ctx.session.page = 1;
            return menu_launchpad_active(ctx);
        case "Ended ⏱":
            ctx.session.page = 1;
            return menu_launchpad_ended(ctx);
        case "Vesting 💎":
            ctx.session.page = 1;
            return menu_launchpad_vesting(ctx);
        case "next 👉":
            return handleNext(ctx);
        case "👈 back":
            return handleBack(ctx);
        case "👈 Back to Upcoming":
            return menu_launchpad_upcoming(ctx);
        case "👈 Back to Active":
            return menu_launchpad_active(ctx);
        case "👈 Back to Ended":
            return menu_launchpad_ended(ctx);
        case "👈 Back to Vesting":
            return menu_launchpad_vesting(ctx);
        case "👈 Back to Launchpad":
            return menu_launchpad(ctx);
        default:
            break;
    }

    if (selectedOption.includes("Accept Stakership from ")) {
        acceptStakershipScene(ctx);
    }
}

// handle message from mini app
export const messageHandler = async (ctx: any) => {
    try {
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
                await ctx.reply(`🎬 Switched to ${chains[ctx.session.chainId].name} chain`);
                if (button_text.includes('🔗')) {
                    const _page = ctx.session.currentPage;
                    if (_page && _page.includes('activeProject')) {
                        const name = _page.split("_")[1];
                        return detail_launchpad_active(ctx, name);
                    } else {
                        return menu_launchpad_active(ctx);
                    }
                } else if (button_text.includes('💫')) {
                    return menu_staking(ctx);
                } else if (button_text.includes('🎨')) {
                    return menu_staking_v3(ctx);
                } else if (button_text.includes('💦')) {
                    return menu_staking_lp(ctx);
                }
                return menu(ctx);
            case "ACCOUNT_CHANGED":
                await ctx.reply(`🎬 Connected to account <b><i><code>${payload.address}</code></i></b> <i>(${payload.name})</i>`, { parse_mode: "HTML" })
                ctx.session.account = payload;
                return menu(ctx);
            case "CANCEL_TRANSACTION":
                await ctx.reply(`🙄 ${payload.message}`, { parse_mode: "HTML" });
                await ctx.scene.leave();
                if (payload.type === 'stakingv1') {
                    return menu_staking_v1(ctx);
                } else if (payload.type === 'stakingv2') {
                    return menu_staking_v2(ctx);
                } else if (payload.type === 'stakingv3') {
                    return menu_staking_v3(ctx);
                } else if (payload.type === 'stakingLP') {
                    return menu_staking_lp(ctx);
                } else if (payload.type === 'launchpad_active_buy') {
                    // return detail_launchpad_active (ctx, payload.id);
                    return;
                } else if (payload.type === 'vesting') {
                    // return detail_launchpad_vesting (ctx, payload.id);
                    return;
                }
            case "SUCCESS_TRANSACTION":
                await ctx.reply(`🎉 ${payload.message}`, { parse_mode: "HTML" });
                await ctx.scene.leave();
                if (payload.type === 'stakingv1') {
                    return menu_staking_v1(ctx);
                } else if (payload.type === 'stakingv2') {
                    return menu_staking_v2(ctx);
                } else if (payload.type === 'stakingv3') {
                    return menu_staking_v3(ctx);
                } else if (payload.type === 'stakingLP') {
                    return menu_staking_lp(ctx);
                } else if (payload.type === 'launchpad_upcoming_vote') {
                    return detail_launchpad_upcoming(ctx, payload.id);
                } else if (payload.type === 'launchpad_active_buy') {
                    return detail_launchpad_active(ctx, payload.id);
                } else if (payload.type === 'vesting') {
                    return detail_launchpad_vesting (ctx, payload.id);
                }
        }
    } catch (err) {
        console.log("err in msg handler --------", err);
    }
}

export const callbackQuery = async (ctx: any) => {
    const selectedOption = ctx.callbackQuery.data;
    console.log({ callbackQuery: selectedOption });
    if (selectedOption === 'next 👉') {
        return handleNext(ctx);
    } else if (selectedOption === 'next 👉') { 
        return handleBack(ctx);
    } else if (selectedOption.includes('v3_withdraw_')) { // click withdraw button
        const [version, name, index] = selectedOption.split("_");
        ctx.answerCbQuery(`You are going to withdraw with version ${version} on index ${index}`);
        ctx.scene.enter("withdrawV3Scene", { withdraw: { version, index } });
    } else if (selectedOption.includes('v3_changeCompoundMode')) { // click withdraw button
        const [version, name, index] = selectedOption.split("_");
        ctx.answerCbQuery(`You are going to change compound mode with version ${version} on index ${index}`);
        ctx.scene.enter("changeCompoundModeScene", { state: { version, index } });
    } else if (selectedOption.includes('voteToParticipate')) {
        const name = selectedOption.split('_')[1];
        return detail_launchpad_upcoming(ctx, name);
    } else if (selectedOption.includes('gotoActiveProject')) {
        const name = selectedOption.split("_")[1];
        return detail_launchpad_active(ctx, name);
    } else if (selectedOption.includes('refreshActive')) {
        const name = selectedOption.split("_")[1];
        return detail_launchpad_active(ctx, name);
    } else if (selectedOption.includes('gotoEndedProject')) {
        const name = selectedOption.split("_")[1];
        return detail_launchpad_ended(ctx, name);
    } else if (selectedOption.includes('refreshEnded')) {
        const name = selectedOption.split("_")[1];
        return detail_launchpad_ended(ctx, name);
    } else if (selectedOption.includes('gotoVestingProject')) {
        const name = selectedOption.split("_")[1];
        return detail_launchpad_vesting(ctx, name);
    } else if (selectedOption.includes('refreshVesting')) {
        const name = selectedOption.split("_")[1];
        return detail_launchpad_vesting(ctx, name);
    } else if (selectedOption.includes('gotoVestingPortal')) {
        const name = selectedOption.split("_")[1];
        return detail_launchpad_vesting(ctx, name);
    }
}