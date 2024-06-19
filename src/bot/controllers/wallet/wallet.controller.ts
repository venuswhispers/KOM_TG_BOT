import { KOM_TOKEN_IMAGE } from "../../../constants/pictures";
import { WALLET } from "../../../types";
import { startNoWallet } from "../main.controller";

// Handle create wallet button click
export const createWallet = async (ctx: any) => {
    await ctx.scene.enter("walletScene", { next: "createWalletScene" });
}

// Handle import wallet button click
export const importWallet = async (ctx: any) => {
    ctx.scene.enter("walletScene", { next: "importWalletScene" });
}

// export wallet private key
export const exportWallet = async (ctx: any) => {
    if (ctx.session.wallet && Array.isArray(ctx.session.wallet)) {
        await ctx.scene.enter("passwordScene", { next: "exportWalletScene" });
    } else {
        startNoWallet(ctx);
    }
}

export const showWallets = async (ctx: any) => {
    if (!ctx.session.wallet || !Array.isArray(ctx.session.wallet) || ctx.session.wallet.length === 0) {
        await startNoWallet(ctx);
        return;
    }
    const _walletIndex = ctx.session.walletIndex ?? 0;
    const wallets = ctx.session.wallet;
    const _wallet = wallets[_walletIndex];

    const msg =
        `<b>🏆 Current Connected Wallet:</b>  <i><a href='https://polygonscan.com/address/${_wallet.address}'>${_wallet.address}</a></i> <i>(${_wallet.name})</i>` +
        `\n\n💬 <i>Please Select Wallet To Connect.</i>`;

    ctx.replyWithVideo(
        KOM_TOKEN_IMAGE,
        {
            caption: msg,
            parse_mode: "HTML",
            link_preview_options: {
                is_disabled: true
            }
        }
    );

    for (let index = 0; index < wallets.length; index++) {
        const _wallet: WALLET = wallets[index];

        await ctx.reply(
            `⚡ <i>${index + 1}.</i>  ${_wallet.name}  ${_walletIndex === index ? '<b><i>(connected)</i></b>' : ''}\n` +
            `💎 <i><b><code>${_wallet.address}</code></b></i> <i>(tap to copy)</i>`,
            {
                parse_mode: "HTML",
                reply_markup: {
                    inline_keyboard: [
                        index === _walletIndex ?
                            [
                                { text: `DELETE`, callback_data: `delete_wallet_${index}` },
                            ] :
                            [
                                { text: `CONNECT`, callback_data: `connect_wallet_${index}` },
                                { text: `DELETE`, callback_data: `delete_wallet_${index}` },
                            ]
                    ],
                }
            }
        );
    }
}
/**
 * connect wallet
 * @param ctx 
 * @param index 
 */
export const connectWallet = async (ctx: any, index: number) => {
    if (!ctx.session.wallet || !Array.isArray(ctx.session.wallet) || ctx.session.wallet.length === 0) {
        return startNoWallet(ctx);
    }
    const _wallet = ctx.session.wallet[index];

    const msg =
        `💦 You have connected (${_wallet.name}) wallet with address of <b><code>${_wallet.address}</code></b><i>(tap to copy)</i>`;

    ctx.replyWithVideo(
        KOM_TOKEN_IMAGE,
        {
            caption: msg,
            parse_mode: "HTML",
            link_preview_options: {
                is_disabled: true
            }
        }
    );
}
/**
 * delete wallet
 * @param ctx 
 * @param index 
 */
export const deleteWallet = async (ctx: any, index: number) => {
    await ctx.reply("⏰ Deleting account ...");
    if (!ctx.session.wallet || !Array.isArray(ctx.session.wallet) || ctx.session.wallet.length === 0) {
        return startNoWallet(ctx);
    } else if (ctx.session.wallet.length < index) {
        return ctx.reply("⚠ No wallet for selected index");
    }
    ctx.session.wallet.splice(index, 1); // delete selected wallet

    if (ctx.session.wallet.length === 0) {
        return startNoWallet(ctx);
    } else {
        ctx.session.walletIndex = 0;
        await ctx.reply("✔ Selected wallet has been deleted.");
        showWallets(ctx);
    }
}