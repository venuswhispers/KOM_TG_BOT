import { STAKING_LP_BANNER_IMAGE } from "@/constants/pictures";
import { getLPBalance, getLPStakingDetails } from "@/bot/utils";
import { startNoWallet } from "@/bot/controllers/main.controller";
import { Markup } from "telegraf";

// show staking LP menus
export const menu = async (ctx: any) => {
    const chainId = ctx.session.chainId ?? 137;
    if (!ctx.session.account) {
        return startNoWallet(ctx);
    } else if (chainId !== 137 && chainId !== 42161) {
        return ctx.reply("⚠ Please switch to Polygon or Arbitrum network");
    }
    const address = ctx.session.account.address;
    // const address = '0xeB5768D449a24d0cEb71A8149910C1E02F12e320';
    await ctx.reply('⏰ Loading staking LP details from networks ...');
    // get token balances
    const [
        _balance,
        { amount, claimableEpoch, index } 
    ] = await Promise.all([getLPBalance (address), getLPStakingDetails(address)]);

    let msg =
        `KomBot | <a href="https://staking.kommunitas.net/">Staking</a> | <a href='https://www.youtube.com/watch?v=9jP5AxDiEP0'>Tutorials</a>\n\n` +
        `🏆 LP Token Address: <b><i><code>0xe0a1fd98e9d151babce27fa169ae5d0ff180f1a4</code></i></b>  <i>(Tap to Copy)</i>` + 
        `\n\n<b>💎 LP at Wallet :</b>  <b>${_balance}</b> <i><a href='https://polygonscan.com/address/0xe0a1fd98e9d151babce27fa169ae5d0ff180f1a4'>UNI-V2 (WMATIC - KOM)</a></i>` +
        `\n\n<a href='https://quickswap.exchange/#/pools/v2?currency0=ETH&currency1=0xC004e2318722EA2b15499D6375905d75Ee5390B8'><b><u>** Click To get LP Token **</u></b></a>` +
        `\n\n<i>Please note that this program is intended for WMATIC-KOM LP token at QuickSwap V2</i>` +
        `\n\n<b>LP Staking Rewards</b>   <a href='https://medium.com/@kommunitas/introducing-kommunitas-lp-staking-program-5800bc256391'><i><u>read more</u></i></a>` +
        `\n* Additional Allocation in IKOs` +
        `\n* Monthly Revenue Sharing (similar to Millionaire Partners)` +
        `\n* Free Projects Token (similar to 730 days Stakers)` +
        `\n\n<b>💎 Staked LP Amount :</b>  <b>${ amount }</b> <i><a href='https://polygonscan.com/address/0xe0a1fd98e9d151babce27fa169ae5d0ff180f1a4'>UNI-V2 (WMATIC - KOM)</a></i>` +
        `\n\n<i><a href='https://earn.kommunitas.net/'><u>check your rewards here</u></a></i>` +
        ( chainId !== 137 ? '\n\n⚠ Please switch to POLYGON' : '' );
    // Send message with the import wallet button
    await ctx.replyWithPhoto(
        STAKING_LP_BANNER_IMAGE,
        {
            caption: msg,
            parse_mode: "HTML",
            reply_markup: {
                keyboard: [
                    [ { text: 'Refresh 💫' } ], 
                    chainId !== 137 ?
                    [ { text: 'Stake 🎨' }, Markup.button.webApp('Switch to Polygon 💦', `${process.env.MINIAPP_URL}?chainId=${chainId}&forChainSelection=true`) ]: 
                    [ { text: 'Stake 🎨' } ],
                    [ { text: '👈 Back To Staking Menu' } ],
                ],
                resize_keyboard: true,
            },
            link_preview_options: {
                is_disabled: true
            }
        }
    );
}


