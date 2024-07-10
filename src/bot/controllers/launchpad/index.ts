import { getKOMTokenPrice, komAPI, reduceAmount } from "@/bot/utils";
import { chains } from "@/constants/config";
import { getNativeTokenPrice } from "@/bot/utils";
import { getTokenBalances } from "@/bot/utils";
import { CONTRACTS } from "@/constants/config";
import { startNoWallet } from "@/bot/controllers/main.controller";
import { LAUNCHPAD_MAIN_LOGO } from "@/constants/pictures";
import { ACCOUNT } from "@/types";
import { menu as menuUpcoming } from "./upcoming.controller";
import { menu as menuActive } from "./active.controller";
import { menu as menuEnded } from "./ended.controller";
import { menu as menuVesting } from "./vesting.controller";

// show staking menus
export const menu = async (ctx: any) => {
    await ctx.reply('⏰ Loading ...');

    const chainId = ctx.session.chainId ?? 137;
    // if (!ctx.session.account) {
    //     return startNoWallet(ctx);
    // }
    // const _account: ACCOUNT = ctx.session.account;
    const _account: ACCOUNT = {
        address: '0xabe34cE4f1423CD9025DB7Eb7637a08AF60d4Af3',
        name: "test"
    };
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
    const { result: { project, raise, unique } } = await komAPI('https://api.kommunitas.net/v1/launchpad/statistic/');

    let msg =
        `KomBot | <a href="https://launchpad.kommunitas.net/">Launchpad</a>\n\n` +
        `Kommunitas is a decentralized crowdfunding ecosystem specifically designed for Web 3.0 projects. \nWhile some might refer it as a "launchpad" or "IDO platform", Kommunitas strives to build something far greater—an expansive ecosystem that fosters innovation and collaboration. \nJoin us on this transformative journey as we redefine the possibilities of Polygon crypto launchpad. \nIf you encounter any difficulties, please visit this <b><i><u><a href='https://www.youtube.com/watch?v=iPE_J--gOdY'>YouTube tutorial</a></u></i></b> for step-by-step guidance.` +
        `\n\n🏆 <b>$KOMmunitas Polygon Launchpad in Numbers</b>` +
        `\n- Projects Launched  <b><i>${project}</i></b>` +
        `\n- Total Funds Raised  <b><i>${raise}</i></b>` +
        `\n- All-time Unique Participants  <b><i>${unique}</i></b>`;

    // Send message with the import wallet button
    ctx.replyWithPhoto(
        LAUNCHPAD_MAIN_LOGO,
        {
            caption: msg,
            parse_mode: "HTML",
            reply_markup: {
                keyboard: [
                    [{ text: 'Upcoming 💤' }, { text: 'Active ⚡' }],
                    [{ text: 'Ended ⏱' }, { text: 'Vesting 💎' }],
                    [{ text: '👈 Back To Main Menu' }],
                ],
                resize_keyboard: true,
            },
            link_preview_options: {
                is_disabled: true
            }
        }
    );
}

const gotoPage = (ctx: any, page: number) => {
    ctx.session.page = page;
    switch (ctx.session.currentLaunchpadType) {
        case 'upcoming':
            return menuUpcoming(ctx);
        case 'active':
            return menuActive(ctx);
        case 'ended':
            return menuEnded(ctx);
        case 'vesting':
            return menuVesting(ctx);
    }
    return menu (ctx);
}

export const handleNext = async (ctx: any) => {
    const page = ctx.session.page ?? 1;
    gotoPage(ctx, page + 1);
}

export const handleBack = async (ctx: any) => {
    const page = ctx.session.page ?? 1;
    gotoPage(ctx, page - 1);
}

export const handlePagination = async (ctx: any, page: number) => {
    gotoPage(ctx, page);
}