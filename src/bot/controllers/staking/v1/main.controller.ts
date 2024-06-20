import { STAKING_LP_BANNER_IMAGE, STAKING_V1_BANNER_IMAGE } from "../../../../constants/pictures";
import { getLPBalance, getLPStakingDetails, getStakingV1Details } from "../../../utils";
import { startNoWallet } from "../../main.controller";

// show staking LP menus
export const menu = async (ctx: any) => {
    const chainId = ctx.session.chainId ?? 137;
    await ctx.reply("⏰ Loading your staking V1 details ...");
    if (chainId !== 137) {
        await ctx.scene.leave ();
        return ctx.reply(`⚠ Please Switch To POLYGON Network`);
    }

    if (!ctx.session.account) {
        return startNoWallet(ctx);
    }
    const address = ctx.session.address;
    // const address = '0xeB5768D449a24d0cEb71A8149910C1E02F12e320';

    const _balance = await getStakingV1Details (137, address);

    const msg = 
        `💦 KomBot | <a href="https://staking.kommunitas.net/"><u>Website</u></a> | <a href='https://youtu.be/CkdGN54ThQI?si=1RZ0T531IeMGfgaQ'><u>Tutorials</u></a> 💦\n\n` +
        `<b>💎 Staked :</b>  <b>${_balance}</b> <i><a href='https://polygonscan.com/address/0xC004e2318722EA2b15499D6375905d75Ee5390B8'>$KOM</a></i>` +
        `\n\n⚠ <i>StakingV1 Pool has been closed.</i>`;

    ctx.replyWithPhoto(
        STAKING_V1_BANNER_IMAGE,
        {
            caption: msg,
            parse_mode: "HTML",
            reply_markup: {
                // force_reply: true,
                keyboard: [
                    Number(_balance) > 0 ?
                    [{ text: 'Claim 👏' }] : [],
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
    await ctx.scene.leave ();
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

