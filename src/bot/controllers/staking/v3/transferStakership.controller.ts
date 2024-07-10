import { menu } from "@/bot/controllers/staking/v3/main.controller";
import { getStakingV3StakedDetails, reduceAmount } from "@/bot/utils";
import { startNoWallet } from "@/bot/controllers/main.controller";
import { Markup } from "telegraf";
const ethers = require("ethers");

// when enter transferStakership scene
export const enterScene = async (ctx: any) => {

    ctx.session.transferStakershipAddress = undefined;
    await ctx.reply('⏰ Loading Your staking details...');
    const chainId = ctx.session.chainId ?? 137;
    if (!ctx.session.account) {
        return startNoWallet(ctx);
    } else if (chainId !== 137 && chainId !== 42161) {
        return ctx.reply("⚠ Please switch to Polygon or Arbitrum network");
    }          
    const address = ctx.session.account.address;
    // const address = '0xabe34cE4f1423CD9025DB7Eb7637a08AF60d4Af3';
    // const address = '0xabe34cE4f1423CD9025DB7Eb7637a08AF60d4Af3';

    const { stakedAmount, stakerPendingReward, userStakedLength, komTokenPrice } = await getStakingV3StakedDetails(chainId, address);
    if (userStakedLength === 0) {
        await ctx.reply(`⚠ You have no ongoing staked tokens`, {
            parse_mode: 'HTML',
        });
        await ctx.scene.leave();
        return;
    }

    const msg =
        `\n⭐ Please enter wallet address you are going to transfer your stakership.` +
        `\n\n- Your staked  tokens:  ${reduceAmount(stakedAmount)} $KOM  <b><i>($${reduceAmount(stakedAmount * komTokenPrice)})</i></b>` +
        `\n- Your pending rewards:  ${reduceAmount(stakerPendingReward)} $KOM  <b><i>($${reduceAmount(stakerPendingReward * komTokenPrice)})</i></b>` +
        `\n- Your staked length:  ${userStakedLength}` +
        `\n\n<i>**ensure that the wallet is new and doesn't have any ongoing stakings**</i>`
    ctx.reply(msg, {
        parse_mode: 'HTML',
        reply_markup: {
            force_reply: true,
            keyboard: [
                [{ text: '👈 BACK' }],
            ],
            one_time_keyboard: true,
            resize_keyboard: true,
        }
    });
}

// input token amount
export const textHandler = async (ctx: any) => {
    const chainId = ctx.session.chainId ?? 137;

    if (ctx.message.text === '👈 BACK') {
        await ctx.scene.leave ();
        return menu (ctx);
    }

    const transferStakershipAddress = ctx.scene.state.transferStakershipAddress;
    if (!transferStakershipAddress) { // enter transferStakershipAddress
        const transferStakershipAddress = ctx.message.text;
        if (!ethers.utils.isAddress(transferStakershipAddress)) {
            await ctx.reply(
                "😔 Invalid wallet address, Please re-enter valid wallet address.",
                {
                    reply_markup: {
                        force_reply: true,
                        keyboard: [
                            [{ text: '👈 BACK' }],
                        ],
                        one_time_keyboard: true,
                        resize_keyboard: true,
                    }
                }
            );
            return;
        }

        const loading = await ctx.reply(`⏰ Loading receiver's staking details...`);
        const { stakedAmount, stakerPendingReward, userStakedLength, komTokenPrice } = await getStakingV3StakedDetails(ctx.session.chainId ?? 137, transferStakershipAddress);
        if (userStakedLength > 0) {
            await ctx.reply(
                `😔 This wallet has already on-going staked tokens. Retry with another address.` +
                `\n\n- Staked  tokens:  ${stakedAmount} $KOM  <b><i>(${reduceAmount(komTokenPrice*stakedAmount)})</i></b>` +
                `\n- Pending rewards:  ${stakerPendingReward} $KOM  <b><i>(${reduceAmount(komTokenPrice*stakerPendingReward)})</i></b>` +
                `\n- Staked length:  ${userStakedLength}` +
                `\n\n<i>**ensure that the wallet is new and doesn't have any ongoing stakings**</i>`,
                {
                    parse_mode: "HTML",
                    reply_markup: {
                        force_reply: true,
                        keyboard: [
                            [{ text: '👈 BACK' }],
                        ],
                        one_time_keyboard: true,
                        resize_keyboard: true,
                    }
                }
            );
            return;
        }

        await ctx.reply(
            `🗨 You are going to transfer your stakership to <code><i><b>${transferStakershipAddress}</b></i></code>\n\n✔ Do you want to execute this transaction ...👇.`,
            {
                parse_mode: "HTML",
                reply_markup: {
                    force_reply: true,
                    keyboard: [
                        [Markup.button.webApp("✔ O K", `${process.env.MINIAPP_URL}/transactions/staking/v3/stakership/transfer?chainId=${chainId}&receiver=${transferStakershipAddress}`)],
                        [{ text: '👈 BACK' }],
                    ],
                    one_time_keyboard: true,
                    resize_keyboard: true,
                }
            }
        );
    } 
}

// enter transferStakership scene
export const transferStakershipScene = async (ctx: any) => {
    const chainId = ctx.session.chainId ?? 137;
    if (chainId === 137) {
        await ctx.scene.enter("transferStakershipScene");
    } else {
        ctx.reply(`\n⚠  TransferStakership function is only available in Polygon network.`, {
            parse_mode: 'HTML',
        });
    }
}
