import { 
    getPastStakingDetails,
    getStakershipDetails,
    getStakingV3StakedDetails,
    reduceAmount,
    formatNumber
} from "../../../utils";
import { chains } from "../../../../constants/config";
import { getNativeTokenPrice } from "../../../utils";
import { getTokenBalances } from "../../../utils";
import { CONTRACTS } from "../../../../constants/config";
import { getStakingV3Details } from "../../../utils";
import { start } from "../../main.controller";
import { STAKEV3_PAST_DETAIL_ITEM } from "../../../../types";
import { getStatistics, getChartData, getLeaderBoard } from "../../../utils";
import { CHART_DATA_ITEM } from "../../../../types";
import { getChartURL } from "../../../utils";
import { STAKING_V3_BANNER_IMAGE } from "../../../../constants/pictures";

const { ethers } = require('ethers');

const modes: Record<string, number> = { 'No Compound': 0, 'Compound My Staked $KOM only': 1, 'Compound The Amount + Reward': 2 };

// show staking menus
export const menu = async (ctx: any) => {
    const chainId = ctx.session.chainId ?? 137;
    if (!ctx.session.wallet || !Array.isArray(ctx.session.wallet)) {
        return start(ctx, true);
    }

    const _walletIndex = ctx.session.walletIndex ?? 0;
    const _wallet = ctx.session.wallet[_walletIndex];

    const address = _wallet.address;
    // const address = '0xeB5768D449a24d0cEb71A8149910C1E02F12e320';

    const _chain = chains[chainId];
    // get token balances
    await ctx.reply('⏰ Loading staking v3 details from networks ...');
    const [
        {
            nativeBalance,
            komBalance,
            komvBalance,
            komTokenPrice
        },
        { stakedAmount, stakerPendingReward },
        { originStakership, pendingStakership },
        nativeTokenPrice,
        {
            nativeBalance: nativeBalance_Pol,
            komBalance: komBalance_Pol,
            komvBalance: komvBalance_Pol,
            komTokenPrice: komTokenPrice_Pol
        },
        { stakedAmount: stakedAmount_Pol, stakerPendingReward: stakerPendingReward_Pol },
        { originStakership: originStakership_Pol, pendingStakership: pendingStakership_Pol },
        nativeTokenPrice_Pol
    ] = await Promise.all([
        getTokenBalances(42161, address),
        getStakingV3StakedDetails(42161, address),
        getStakershipDetails(42161, address),
        getNativeTokenPrice(42161),
        getTokenBalances(137, address),
        getStakingV3StakedDetails(137, address),
        getStakershipDetails(137, address),
        getNativeTokenPrice(137)
    ]);

    const zeroAddress = '0x0000000000000000000000000000000000000000';
    // await ctx.deleteMessage(loading.message_id).catch((err: any) => { });

    let msg =
        `💦 KomBot | <a href="https://staking.kommunitas.net/"><u>Website</u></a> | <a href='https://youtu.be/CkdGN54ThQI?si=1RZ0T531IeMGfgaQ'><u>Tutorials</u></a> 💦\n\n` +
        `🏆 Stake <a href='${_chain.explorer}/address/${CONTRACTS[chainId].KOM.address}'>$KOM</a> to earn rewards and get guaranteed allocation for the Launchpad. If you encounter any difficulties, please visit this <a href='https://youtu.be/CkdGN54ThQI?si=1RZ0T531IeMGfgaQ'>YouTube tutorial</a> for step-by-step guidance.\n` +
        (address ? `\n<code>${address}</code><i> (Tap to copy)</i>` : '');
    const _arbitrum = 
        `\n\n======== ARBITRUM ========\n` +
        `- Balance: <b>${reduceAmount(nativeBalance)}</b> <i>$ETH</i>   ($${reduceAmount(nativeTokenPrice * Number(nativeBalance))})` +
        `\n- $KOM: <b>${komBalance}</b>   <i>($${komBalance * komTokenPrice})</i>` +
        `\n- $KOMV: <b>${komvBalance}</b>` +
        `\n- Staked: <b>${stakedAmount} $KOM</b>   <i>($${reduceAmount(stakedAmount * komTokenPrice)})</i>` +
        `\n- PendingReward: <b>${reduceAmount(stakerPendingReward)} $KOM</b>   <i>($${reduceAmount(stakerPendingReward * komTokenPrice)})</i>`;
    const _polygon = 
        `\n\n======== POLYGON ========\n` +
        `- Balance: <b>${reduceAmount(nativeBalance_Pol)}</b> <i>$MATIC</i>   ($${reduceAmount(nativeTokenPrice_Pol * Number(nativeBalance_Pol))})` +
        `\n- $KOM: <b>${komBalance_Pol}</b>   <i>($${komBalance_Pol * komTokenPrice_Pol})</i>` +
        `\n- $KOMV: <b>${komvBalance_Pol}</b>` +
        `\n- Staked: <b>${stakedAmount_Pol} $KOM</b>   <i>($${reduceAmount(stakedAmount_Pol * komTokenPrice_Pol)})</i>` +
        `\n- PendingReward: <b>${reduceAmount(stakerPendingReward_Pol)} $KOM</b>   <i>($${reduceAmount(stakerPendingReward_Pol * komTokenPrice_Pol)})</i>` +
        ( pendingStakership_Pol !== zeroAddress ? `\n⚠  Your stakership is pending to <i><b><code>${pendingStakership_Pol}</code></b></i>` : '') +
        ( originStakership_Pol !== zeroAddress ? `\n⚠  You have been requested to transfer the $KOM staked from <i><b><code>${originStakership_Pol}</code></b></i>\nPlease click "<b><i>Accept Stakership</i></b>" button to accept it.`: '' );
    const _footer = `\n\n🗨 Click on the Refresh button to update your current staking details. <b><i>(current chain: ${_chain.name})</i></b>`;

    if (chainId === 137) {
        msg += _polygon + _arbitrum;
    } else {
        msg += _arbitrum + _polygon;
    }
    msg += _footer;

    // Send message with the import wallet button
    await ctx.replyWithPhoto(
        STAKING_V3_BANNER_IMAGE,
        {
            caption: msg,
            parse_mode: "HTML",
            reply_markup: {
                keyboard: [
                    originStakership_Pol === zeroAddress ?
                    [
                        { text: 'Stake ⏱' }, 
                        { text: 'Transfer Stakership 🚀' }
                    ] :
                    [
                        { text: 'Stake ⏱' }, 
                        { text: 'Transfer Stakership 🚀' },
                        { text: `Accept Stakership from "${originStakership_Pol.substring(0, 10)}..."` }
                    ],
                    [
                        { text: 'My Ongoing Staking Details 🏅' }, 
                        { text: 'My Past Staking Details 🥇' }
                    ],
                    [
                        { text: 'Staking Chart / Percentage 📈' }, 
                        { text: 'Staking V3 Leaderboard 🏆' }
                    ],
                    [
                        { text: 'Refresh 🎲' }, 
                        { text: chainId === 137 ? 'Switch to Arbitrum 🎨' : 'Switch to Polygon 🎨' },
                        { text: '👈 Back To Staking Menu' },
                    ]
                ],
                resize_keyboard: true,
            },
            link_preview_options: {
                is_disabled: true
            }
        }
    );
}

// show stakingV3 ongoing details
export const stakingV3_ongoing_staking_details = async (ctx: any) => {
    const chainId = ctx.session.chainId ?? 137;
    if (!ctx.session.wallet || !Array.isArray(ctx.session.wallet)) {
        return start(ctx, true);
    }
    const _walletIndex = ctx.session.walletIndex ?? 0;
    const _wallet = ctx.session.wallet[_walletIndex];
    const address = _wallet.address;
    // const address = '0xabe34cE4f1423CD9025DB7Eb7637a08AF60d4Af3';

    const _chain = chains[chainId];
    // get token balances
    await ctx.reply('⏰ Loading token balances...');
    const {
        nativeBalance,
        komBalance,
        komvBalance,
        komTokenPrice
    } = await getTokenBalances(chainId, address);
    // get native token price
    const nativeTokenPrice: number = await getNativeTokenPrice(chainId);
    // get staking details
    ctx.reply('⏰ Loading StakingV3 Details...');
    const { stakedAmount, stakerPendingReward, stakedDetails } = await getStakingV3Details(chainId, address);

    const message =
        `🏆 You can check your stakingV3 details.\n` +
        `<code>${address}</code><i> (${_wallet.name})</i>` +
        `\nBalance: <b>${reduceAmount(nativeBalance)}</b> <i>${_chain.symbol}</i>   ($${nativeTokenPrice * Number(nativeBalance)})` +
        `\n$KOM: <b>${komBalance}</b>  <b><i>($${reduceAmount(komBalance*komTokenPrice)})</i></B>` +
        `\n$KOMV: <b>${komvBalance}</b>` +
        `\nStaked: <b>${stakedAmount} $KOM</b>  <b><i>($${reduceAmount(stakedAmount*komTokenPrice)})</i></B>` +
        `\nPendingReward: <b>${stakerPendingReward} $KOM</b>  <b><i>($${reduceAmount(stakerPendingReward*komTokenPrice)})</i></B>` +
        (stakedDetails.length === 0 ? ` <i>(You have no ongoing staking details )</i>` : '');

    await ctx.reply(message,
        {
            parse_mode: "HTML",
            link_preview_options: {
                is_disabled: true
            }
        }
    );

    for (let idx = 0; idx < stakedDetails.length; idx++) {
        const _stakedDetail = stakedDetails[idx];
        const text =
            `👁‍🗨 ${idx + 1}.\n` +
            `<b>- Staked Amount: ${_stakedDetail.amount}</b> <i>$KOM</i>  (<i>rewards</i>: <b>${_stakedDetail.reward}</b> <i>$KOM</i>, <i>Lock Days:</i> <b>${_stakedDetail.lockPeriodInDays}</b> days)\n` +
            `<i>- Staking Time:</i> <b>${new Date(_stakedDetail.stakedAt * 1000).toUTCString()}</b>\n` +
            `<i>- Maturity Time:</i> <b>${new Date(_stakedDetail.endedAt * 1000).toUTCString()}</b>\n` +
            `<i>- Current Compound Mode:</i> *<b>${Object.keys(modes)[_stakedDetail.compoundType]}</b>*\n` +
            `⚠ You can premature withdraw or change compound mode of your staked tokens.`;
        await ctx.reply(text,
            {
                parse_mode: "HTML",
                reply_markup: {
                    inline_keyboard: [
                        [
                            { text: `Premature Withdraw (${idx + 1})`, callback_data: `v3_withdraw_${idx}` },
                            { text: `Change Compound Mode (${idx + 1})`, callback_data: `v3_changeCompoundMode_${idx}` },
                        ]
                    ],
                },
                link_preview_options: {
                    is_disabled: true
                }
            }
        );
    }
}
// show past staking details
export const staingV3_past_staking_details = async (ctx: any) => {
    const chainId = ctx.session.chainId ?? 137;
    if (!ctx.session.wallet || !Array.isArray(ctx.session.wallet)) {
        return start(ctx, true);
    }
    const _walletIndex = ctx.session.walletIndex ?? 0;
    const _wallet = ctx.session.wallet[_walletIndex];
    const address = _wallet.address;
    // const address = '0xabe34cE4f1423CD9025DB7Eb7637a08AF60d4Af3';
    const _chain = chains[chainId];

    await ctx.reply('⏰ Loading Past Staking Details ...');
    const stakedDetails: STAKEV3_PAST_DETAIL_ITEM[] = await getPastStakingDetails (chainId, address);
    
    if (stakedDetails.length === 0) {
        return await ctx.reply(
            '😶 You have no past staking details',
            {
                parse_mode: "HTML",
                link_preview_options: {
                    is_disabled: true
                }
            }
        );
    }

    let text = '';
    stakedDetails.forEach(({ ev_data, tx_hash }: STAKEV3_PAST_DETAIL_ITEM, idx: number) => {
        text +=
        `🎨 <b>${ethers.utils.formatUnits(ev_data.amount, 8)} <i>$KOM</i></b>    ( 👁‍🗨 <a href='${_chain.explorer}tx/${tx_hash}'>${tx_hash.substring(0, 15)}...</a> )\n` +
        `<i>- Rewards</i>: <b>${ethers.utils.formatUnits(ev_data.reward, 8)}</b><i>$KOM</i>\n` +
        `<i>- Lock Days:</i> <b>${ev_data.lockPeriodInDays}</b> days\n` +
        `<i>- Staking Time:</i> <b>${new Date(ev_data.stakedAt * 1000).toUTCString()}</b>\n` +
        `<i>- Maturity Time:</i> <b>${new Date(ev_data.endedAt * 1000).toUTCString()}</b>\n` +
        `<i>- Compound Mode:</i> *<b>${Object.keys(modes)[ev_data.compoundType]}</b>*\n` +
        ( ev_data.isPremature ? `<i>- Prematurity Penalty:</i> <b>${ethers.utils.formatUnits(ev_data.prematurePenalty, 8)}</b> <i>$KOM</i>\n` : '' ) +
        `<i>- Unstaked Time:</i> <b>${new Date(ev_data.unstakedAt * 1000).toUTCString()}</b>\n`;
    });
    await ctx.reply(text,
        {
            parse_mode: "HTML",
            link_preview_options: {
                is_disabled: true
            }
        }
    );
}

// show chart
export const chart = async (ctx: any) => {

    const loading = await ctx.reply(`⏰ Loading Chart Infomation...`);

    const { result: charArb } = await getChartData(42161);
    const { result: chartPolygon } = await getChartData(137);
    const { result: statistics } = await getStatistics();

    let statisticsMsg = `🎲 <b>Statistic</b>\n\n`;
    let cnt = 0;
    for (const [key, value] of Object.entries(statistics)) {
        statisticsMsg += `- <i>${key}</i>:  <b>${value}</b>\n`
    }

    // draw chart for Polygon
    let chartPolygonMsg = `\n<b>Staking Duration Chart on Polygon</b>\n<i>(Last Updated: ${chartPolygon.epoch})</i>\n\n`;
    chartPolygon.data.map((item: CHART_DATA_ITEM) => {
        chartPolygonMsg += `- <i>${item.period}</i> = ${formatNumber(ethers.utils.formatUnits(BigInt(item.amount), 8))} $KOM\n`
    });
    const chartURLPolygon = await getChartURL (chartPolygon.data);
    chartPolygonMsg += `\n<a href='${chartURLPolygon}'>🔩 chart for Polygon</a>`;

    // draw chart for Arbitrum
    let chartArbMsg = `\n<b>Staking Duration Chart on Arbitrum</b>\n<i>(Last Updated: ${chartPolygon.epoch})</i>\n\n`;
    charArb.data.map((item: CHART_DATA_ITEM) => {
        chartArbMsg += `- <i>${item.period}</i> = ${formatNumber(ethers.utils.formatUnits(BigInt(item.amount), 8))} $KOM\n`
    });
    const chartURLArb = await getChartURL (charArb.data);
    chartArbMsg += `\n<a href='${chartURLArb}'>🔩 chart for Arbitrum</a>`;

    await ctx.deleteMessage(loading.message_id).catch((err: any) => { });
    await ctx.reply(
        statisticsMsg + chartPolygonMsg,
        {
            parse_mode: "HTML"
        }
    )
    await ctx.reply(
        chartArbMsg,
        {
            parse_mode: "HTML"
        }
    )
}

// show leaderboard
export const leaderBoard = async (ctx: any) => {

    const loading = await ctx.reply(`⏰ Loading Leaderboard Infomation...`);
    const chainId = ctx.session.chainId ?? 137;

    const { status, result } = await getLeaderBoard (chainId);

    if (status === 'success') {
        const _list: { address: string, amount: number } [] = result.data.list;

        let leaderboardMsg =
        `🌹 <b>Top 50 KOM Stakers 🌹</b>\n\n`;
        _list.forEach((item: { address: string, amount: number }, idx: number) => {
            leaderboardMsg += `<i>${idx + 1}</i>. <i>${item.address}</i>       <b>(${formatNumber(item.amount)} $KOM)</b>\n`
        });
        
        ctx.telegram.editMessageText(
            ctx.chat.id, loading.message_id, null, 
            leaderboardMsg,
            {
                parse_mode: "HTML"
            }
        )
    } else {
        ctx.telegram.editMessageText(
            ctx.chat.id, loading.message_id, null, 
            `⚠ Can't display leaderboard information, Please retry later.`,
            {
                parse_mode: "HTML"
            }
        )
    }
}


//switch chain
export const switchChain = async (ctx: any) => {
    const chainId = ctx.session.chainId ?? 137;
    if (chainId === 137 || !chainId) {
        ctx.session.chainId = 42161;
    } else {
        ctx.session.chainId = 137;
    }
    menu(ctx);
}

