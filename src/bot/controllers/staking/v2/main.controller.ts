import { STAKING_V2_BANNER_IMAGE } from "@/constants/pictures";
import { getStakingV2Details } from "@/bot/utils";
import { startNoWallet } from "@/bot/controllers/main.controller";

// show staking LP menus
export const menu = async (ctx: any) => {
    const chainId = ctx.session.chainId ?? 137;
    if (chainId !== 137) {
        await ctx.scene.leave();
        return ctx.reply(`⚠ Please Switch To POLYGON Network`);
    }

    await ctx.reply("⏰ Loading your staking V2 details ...");

    if (!ctx.session.account) {
        return startNoWallet(ctx);
    } else if (chainId !== 137 && chainId !== 42161) {
        return ctx.reply("⚠ Please switch to Polygon or Arbitrum network");
    }
    const address = ctx.session.account.address;
    // const address = '0xeB5768D449a24d0cEb71A8149910C1E02F12e320';

    const _balance = await getStakingV2Details(137, address);

    const msg =
        `KomBot | <a href="https://staking.kommunitas.net/">Staking</a> | <a href='https://youtu.be/CkdGN54ThQI?si=1RZ0T531IeMGfgaQ'>Tutorials</a>\n\n` +
        `<b>💎 Staked :</b>  <b>${_balance}</b> <i><a href='https://polygonscan.com/address/0xC004e2318722EA2b15499D6375905d75Ee5390B8'>$KOM</a></i>` +
        `\n\n⚠ <i>StakingV2 Pool has been closed.</i>`;

    ctx.replyWithPhoto(
        STAKING_V2_BANNER_IMAGE,
        {
            caption: msg,
            parse_mode: "HTML",
            reply_markup: {
                // force_reply: true,
                keyboard: [
                    Number(_balance) >= 0 ?
                        [{ text: 'Claim 🎬' }] : [],
                    [{ text: '👈 Back To Staking Menu' }],
                ],
                one_time_keyboard: true,
                resize_keyboard: true,
            },
            link_preview_options: {
                is_disabled: true
            }
        }
    );
    await ctx.scene.leave();
}

