import { calcRemainingTime, drawLogoWithBanner, formatNumber, getKOMTokenPrice, getKOMVBalance, getPaginationButtons, getTotalKOMStaked, komAPI, reduceAmount } from "@/bot/utils";
import { getProjects } from "@/bot/utils/launchpad";
import { chains } from "@/constants/config";
import { IProject } from "@/types";
import { keyboard } from "telegraf/typings/markup";
import { startNoWallet } from "../main.controller";
import { CAMPAIGN_SOCIAL_NAMES } from "@/constants/utils";
import { Markup } from "telegraf";
import { PLACE_HOLDER } from "@/constants/pictures";


// show staking menus
// export const menu = async (ctx: any) => {
//     ctx.session.currentLaunchpadType = 'upcoming';

//     const PAGE_LEN = 10;
//     const total = 145;
//     let page = ctx.session.page ?? 1;
//     const { count, buttons } = getPaginationButtons (total, PAGE_LEN, page);
// }
export const menu = async (ctx: any) => {
    try {

        ctx.session.currentLaunchpadType = 'upcoming';
        const chainId = ctx.session.chainId ?? 137;
        if (!ctx.session.account) {
            return startNoWallet(ctx);
        } else if (chainId !== 137 && chainId !== 42161) {
            return ctx.reply("⚠ Please switch to Polygon or Arbitrum network");
        }
        const { address, name } = ctx.session.account;
        // const { address, name } = {
        //     address: '0xabe34cE4f1423CD9025DB7Eb7637a08AF60d4Af3',
        //     name: 'test'
        // };
        // page settings
        await ctx.reply("⏱ Loading Upcoming Projects...");
        const projects = await getProjects('upcoming', address);
        const page = ctx.session.page ?? 1;
        const total = projects.length;
        const PAGE_LEN = 10;
        const { count, buttons } = getPaginationButtons(total, PAGE_LEN, page);

        await ctx.reply(
            '⏰ Loading Projects Details...',
            {
                reply_markup: { keyboard: [buttons, [{ text: '👈 Back to Launchpad' }]], resize_keyboard: true },
            }
        );

        const _projects = await Promise.all(projects.slice((page - 1) * PAGE_LEN, page * PAGE_LEN));
        for (let i = 0; i < _projects.length; i++) {
            const _project: IProject = _projects[i];
            // project types
            let _type = '';
            if (_project.secure) {
                _type = ' 🔐Secure';
            } else if (_project.priority) {
                _type = ' ⭐Priority';
            } else if (_project.exclusive) {
                _type = ' 💎Exclusive'
            } else if (_project.nonRefundable) {
                _type = ' 💤Non refundable';
            }
            // social links
            const socials = _project.social ? _project.social.map((item: { icon: string, link: string }) => ` <a href='${item.link}'>${CAMPAIGN_SOCIAL_NAMES[item.icon] ?? item.icon}</a>`).join(' | ') : '';
            // compaigns
            const promos = Object.entries(_project.promo).filter(([key, value]) => key !== 'research' && key !== 'banner').map(([key, value]) => ` <a href='${value}'>${CAMPAIGN_SOCIAL_NAMES[key] ?? key}</a>`).join(' | ');
            // message
            let msg =
                `${(page - 1) * PAGE_LEN + i + 1}. 💎 ${_project.name} <b><i> ($${_project.ticker})</i></b>    <b><i><u>${_project.type.label}</u></i></b>\n\n` +
                `- Round: <b><i>${_project.roundLabel}</i></b>\n` +
                (_type ? `- Rules: <b><i>${_type}</i></b>\n\n`: '\n') +
                promos + (promos.length > 0 ? '\n\n' : '') +
                `<i>${_project.desc.substring(0, 200)} ...</i>\n\n` +
                socials +
                `\n\n🎓 <b><a href='${_project?.promo?.research}'>Research</a></b>\n\n` +
                `- <i>Total Supply</i>: <b>${_project.supply}</b>\n` +
                `- <i>Initial Marketcap</i>: <b>${_project.marketcap}</b>\n` +
                `- <i>Swap Rate</i>: <b>${_project.price}</b>\n` +
                `- <i>Starts</i>: <b>${_project.calculation_time}</b>\n` +
                `- <i>Target Raised</i>: <b>$${formatNumber(_project.target.total)}</b>\n\n` +
                `<i>${_project.distribution}</i>` +
                (_project.calculation_time !== "TBA" && !_project.voting ? `\n\nVoting ends in: ${calcRemainingTime(Date.now(), _project.start * 1000)}` : '') +
                (_project.voting ? `\n\n<b>Starting Soon</b> <i>(You have already been voted)</i>` : '') +
                ``;
            await ctx.replyWithPhoto(
                _project.sale_card ? _project.sale_card : PLACE_HOLDER,
                {
                    caption: msg,
                    parse_mode: "HTML",
                    reply_markup: {
                        inline_keyboard: [
                            [
                                { text: _project.voting || _project.round === 'PrivateCross' ? 'Go to Project Details 📄' : `Vote to Participate 👍`, callback_data: `voteToParticipate_project=IKO-${_project.ticker}-${_project.round}` },
                            ]
                        ],
                    },
                    link_preview_options: {
                        is_disabled: true
                    }
                }
            );
        }
    } catch (err) {
        console.log(err);
        ctx.reply("⚠ Failed to load...")
    }
}

export const detail = async (ctx: any, id: string) => {
    try {

        const chainId = ctx.session.chainId ?? 137;
        if (!ctx.session.account) {
            return startNoWallet(ctx);
        } else if (chainId !== 137 && chainId !== 42161) {
            return ctx.reply("⚠ Please switch to Polygon or Arbitrum network");
        }
        const { address, name } = ctx.session.account;
        // const { address, name } = {
        //     address: '0xeB5768D449a24d0cEb71A8149910C1E02F12e320',
        //     name: 'test'
        // };

        await ctx.reply("⏱ Loading project details ...", { reply_markup: { keyboard: [[]] } });
        let { result: project }: { result: IProject } = await komAPI(`https://api.kommunitas.net/v1/launchpad/project/?${id}&invested=false`);
        // voting details...
        let canVote = false, _action = '';
        if (!project.project) {
            _action = '\n\n⚠ Coming Soon...';
        } else {
            const { status } = await komAPI(`https://api.kommunitas.net/v1/launchpad/vote/?address=${address}&project=${project.project}`)
            const voted = (status === 'success');
            if (voted) {
                _action = `\n\n<b>Starting Soon</b> <i>(You have already been voted)</i>`;
            } else {
                const _totalKOMStaked = await getTotalKOMStaked(project.project, address);
                console.log({ _totalKOMStaked, type: project.roundLabel })
                if (project.roundLabel === 'Public' && _totalKOMStaked < 3000) {
                    _action = `\n\n⚠ You're not eligible for voting. Stake more than 3,000 KOM token to get a KOMV and be eligible to vote for Public sale.`;
                } else if (project.roundLabel === 'Private' && _totalKOMStaked < 500000) {
                    _action = `\n\n⚠ You're not eligible for voting. Stake more than 500,000 KOM token to get KOMV and be eligible to vote for Private sale.`;
                } else {
                    canVote = true;
                }
            }
        }
        // social links
        const socials = project.social ? project.social.map((item: { icon: string, link: string }) => ` <a href='${item.link}'>${CAMPAIGN_SOCIAL_NAMES[item.icon] ?? item.icon}</a>`).join(' | ') : '';
        // campain links
        const promos = Object.entries(project.promo).filter(([key, value]) => key !== 'research' && key !== 'banner').map(([key, value]) => ` <a href='${value}'>${CAMPAIGN_SOCIAL_NAMES[key] ?? key}</a>`).join(' | ');
        // project type
        let _type = '';
        if (project.secure) {
            _type = ' 🔐Secure';
        } else if (project.priority) {
            _type = ' ⭐Priority';
        } else if (project.exclusive) {
            _type = ' 💎Exclusive'
        } else if (project.nonRefundable) {
            _type = ' 💤Non refundable';
        }
        // msg
        const _introduction =
            `💎 ${project.name} <b><i> ($${project.ticker})</i></b>    <b><i><u>${project.type.label}</u></i></b>\n\n` +
            promos + (promos.length > 0 ? '\n\n' : '') +
            `- Round: <b><i>${project.roundLabel}</i></b>\n` +
            (_type ? `- Rules: <b><i>${_type}</i></b>\n\n`: '\n') +
            `<i>${project.desc.substring(0, 1000)} ...</i>\n\n`;
        const _details = socials +
            `\n\n🎓 <b><a href='${project?.promo?.research}'>Research</a></b>${new Array(50).fill(" ").join(" ")}\n\n` +
            `- <i>Token Type</i>: <b>${project.type.label}</b>\n` +
            `- <i>Token Address</i>: <b>${project.listing}</b>\n` +
            `- <i>Total Supply</i>: <b>${project.supply}</b>\n` +
            `- <i>Initial Marketcap</i>: <b>${project.marketcap}</b>\n` +
            `- <i>Swap Rate</i>: <b>${project.price}</b>\n` +
            `- <i>Last Staking & Voting Period:</i>: <b>${project.calculation_time}</b>\n` +
            `- <i>Preparation Period:</i>: <b>${project.preparation_time}</b>\n` +
            `- <i>Target Raised</i>: <b>${formatNumber(project.target.total)}</b>\n\n` +
            `- <i>Vesting</i>: <b>${project.vesting}</b>\n` +
            `- <i>Refund Period</i>: <b>${project.refund}</b>\n` +
            `- <i>Listing</i>: <b>${project.listing}</b>\n\n` +
            `<i>${project.distribution}</i>` +
            _action;

        project.buffer = await drawLogoWithBanner(project.sale_card, project.image);

        await ctx.replyWithPhoto(
            // project.sale_card,
            { source: project.buffer },
            {
                caption: _introduction,
                parse_mode: "HTML",
                link_preview_options: {
                    is_disabled: true
                }
            }
        );
        await ctx.reply(
            _details,
            {
                parse_mode: "HTML",
                reply_markup: {
                    keyboard: [
                        canVote ? [Markup.button.webApp("🎬 Participate", `${process.env.MINIAPP_URL}/transactions/launchpad/vote?project=${project.project}&id=${id}`)] : [],
                        [{ text: 'Staking V3 ⏰' }],
                        [{ text: '👈 Back to Upcoming' }, { text: '👈 Back to Launchpad' }],
                    ],
                    resize_keyboard: true,
                },
                link_preview_options: {
                    is_disabled: true
                }
            }
        );
    } catch (err) {
        console.log(err);
        ctx.reply("⚠ Failed to load...")
    }
}