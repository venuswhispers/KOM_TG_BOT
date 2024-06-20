import { createCallBackBtn, getKOMTokenPrice, komAPI, reduceAmount } from "../../utils";
import { chains } from "../../../constants/config";
import { getNativeTokenPrice } from "../../utils";
import { getTokenBalances } from "../../utils";
import { CONTRACTS } from "../../../constants/config";
import { startNoWallet } from "../main.controller";
import { LAUNCHPAD_MAIN_LOGO } from "../../../constants/pictures";
import { getProjects } from "../../utils/launchpad";
import { IProject } from "@/types";


// show staking menus
export const menu = async (ctx: any) => {
    await ctx.reply('⏰ Loading Upcoming Projects...');
    
    const chainId = ctx.session.chainId ?? 137;
    // if (!ctx.session.wallet || !Array.isArray(ctx.session.wallet)) {
    //     return startNoWallet(ctx);
    // }
    // wallet
    // const _walletIndex = ctx.session.walletIndex ?? 0;
    // const _wallet = ctx.session.wallet[_walletIndex];
    // const address = _wallet.address;
    const address = '0xabe34cE4f1423CD9025DB7Eb7637a08AF60d4Af3';
    // const _chain = chains[chainId];
    // const [
        //     {
            //         nativeBalance: nativeBalance_pol,
            //         komBalance: komBalance_pol,
            //         komvBalance: komvBalance_pol,
            //         komTokenPrice: komTokenPrice_pol
            //     },
            //     maticPrice,
            //     {
                //         nativeBalance,
                //         komBalance,
                //         komvBalance,
                //         komTokenPrice
                //     },
                //     ethPrice
                // ] = await Promise.all([
    //     getTokenBalances(137, address),
    //     getNativeTokenPrice(137),
    //     getTokenBalances(42161, address),
    //     getNativeTokenPrice(42161),
    // ]);

    // get native token balance
    // await ctx.deleteMessage(loading.message_id).catch((err: any) => { });
    const { result: { project, raise, unique } } = await komAPI ('https://api.kommunitas.net/v1/launchpad/statistic/');
    const projects = await getProjects (address, 'upcoming');
    console.log(projects.length)

    let msg =
        `💦 KomBot | <a href="https://staking.kommunitas.net/">Website</a> | <a href='https://youtu.be/CkdGN54ThQI?si=1RZ0T531IeMGfgaQ'>Tutorials</a> 💦\n\n` +
        `Kommunitas is a decentralized crowdfunding ecosystem specifically designed for Web 3.0 projects. \nWhile some might refer it as a "launchpad" or "IDO platform", Kommunitas strives to build something far greater—an expansive ecosystem that fosters innovation and collaboration. \nJoin us on this transformative journey as we redefine the possibilities of Polygon crypto launchpad. \nIf you encounter any difficulties, please visit this <b><i><u><a href='https://www.youtube.com/watch?v=iPE_J--gOdY'>YouTube tutorial</a></u></i></b> for step-by-step guidance.` +
        `\n\n🏆 <b>$KOMmunitas Polygon Launchpad in Numbers</b>` +
        `\n- Projects Launched  <b><i>${project}</i></b>` +
        `\n- Total Funds Raised  <b><i>${raise}</i></b>` +
        `\n- All-time Unique Participants  <b><i>${unique}</i></b>`;
    
    // Send message with the import wallet button
    const _project: IProject = projects[0];
    ctx.replyWithPhoto(
        _project.sale_card,
        {
            caption: msg,
            parse_mode: "HTML",
            reply_markup: {
                // inline_keyboard: address ? [[stakingV3Button, stakingLPButton], [stakingV1Button, stakingV2Button], [refreshButton], [switchChainButton]] : [],
            },
            link_preview_options: {
                is_disabled: true
            }
        }
    );
}