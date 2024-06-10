import { createCallBackBtn, getKOMTokenPrice, reduceAmount } from "../../utils";
import { chains } from "../../../constants/config";
import { getNativeTokenPrice } from "../../utils";
import { getTokenBalances } from "../../utils";
import { CONTRACTS } from "../../../constants/config";
import { start } from "../main.controller";

// show staking menus
export const menu = async (ctx: any) => {
    
    const chainId = ctx.session.chainId ?? 137;
    // const loading = await ctx.reply(`⏰ Loading token balances...`);
    if (!ctx.session.wallet || !Array.isArray(ctx.session.wallet)) {
        return start(ctx, true);
    }
    // wallet
    const _walletIndex = ctx.session.walletIndex ?? 0;
    const _wallet = ctx.session.wallet[_walletIndex];
    const address = _wallet.address;
    // const address = '0xabe34cE4f1423CD9025DB7Eb7637a08AF60d4Af3';
    const _chain = chains[chainId];
    await ctx.reply('⏰ Loading token balances from networks ...');
    const [
        {
            nativeBalance: nativeBalance_pol,
            komBalance: komBalance_pol,
            komvBalance: komvBalance_pol,
            komTokenPrice: komTokenPrice_pol
        },
        maticPrice,
        {
            nativeBalance,
            komBalance,
            komvBalance,
            komTokenPrice
        },
        ethPrice
    ] = await Promise.all([
        getTokenBalances(137, address),
        getNativeTokenPrice(137),
        getTokenBalances(42161, address),
        getNativeTokenPrice(42161),
    ]);

    // get native token balance
    // await ctx.deleteMessage(loading.message_id).catch((err: any) => { });
    let msg =
        `💦 KomBot | <a href="https://staking.kommunitas.net/">Website</a> | <a href='https://youtu.be/CkdGN54ThQI?si=1RZ0T531IeMGfgaQ'>Tutorials</a> 💦\n\n` +
        `🏆 Stake <a href='${_chain.explorer}/address/${CONTRACTS[137].KOM.address}'>$KOM</a> to earn rewards and get guaranteed allocation for the Launchpad. If you encounter any difficulties, please visit this <a href='https://youtu.be/CkdGN54ThQI?si=1RZ0T531IeMGfgaQ'>YouTube tutorial</a> for step-by-step guidance.\n` +
        (address ? `\n<code>${address}</code><i> (${_wallet.name})</i>` : '');
    const _arbitrum = 
        `\n\n======== ARBITRUM ========` +
        `\n- Balance: <b>${reduceAmount(nativeBalance)}</b> <i>$ETH</i>   ($${reduceAmount(ethPrice * nativeBalance)})` +
        `\n- $KOM: <b>${komBalance}</b>   <i>($${reduceAmount(komBalance * komTokenPrice)})</i>` +
        `\n- $KOMV: <b>${komvBalance}</b>`;
    const _polygon =
        `\n\n======== POLYGON ========` +
        `\n- Balance: <b>${reduceAmount(nativeBalance_pol)}</b> <i>$MATIC</i>   ($${reduceAmount(maticPrice * nativeBalance_pol)})` +
        `\n- $KOM: <b>${komBalance_pol}</b>   <i>($${reduceAmount(komBalance_pol * komTokenPrice_pol)})</i>` +
        `\n- $KOMV: <b>${komvBalance_pol}</b>`;
    const _footer =
        `\n\n- Staking V3 ( 🟢 Active )` +
        `\n- Staking LP ( 🟢 Active )` +
        `\n- Staking V1 ( 🔴 View / Claim Only )` +
        `\n- Staking V2 ( 🔴 View / Claim Only )` +
        `\n\n🗨 Click on the Refresh button to update your current balance. <b><i>(current chain: ${_chain.name})</i></b>` +
        `\n\n<i>Choose an option below...</i>  👇🏻`;
    
    if (chainId === 137) {
        msg += _polygon + _arbitrum;
    } else {
        msg += _arbitrum + _polygon;
    }
    msg += _footer;    
    
    // Send message with the import wallet button
    ctx.reply(msg,
        {
            parse_mode: "HTML",
            reply_markup: {
                // inline_keyboard: address ? [[stakingV3Button, stakingLPButton], [stakingV1Button, stakingV2Button], [refreshButton], [switchChainButton]] : [],
                keyboard: [
                    [{ text: 'Refresh ❄' }, { text: chainId === 137 ? 'Switch to Arbitrum 💫' : 'Switch to Polygon 💫' }],
                    [{ text: 'Staking V3 ⏰' }, { text: 'Staking LP 💦' }],
                    [{ text: 'Staking V1' }, { text: 'Staking V2' }],
                    [{ text: '👈 Back To Main Menu' }],
                ]
            },
            link_preview_options: {
                is_disabled: true
            }
        }
    );
}