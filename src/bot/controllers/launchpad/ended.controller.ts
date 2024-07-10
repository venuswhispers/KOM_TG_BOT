import { drawLogoWithBanner, formatNumber, getPaginationButtons, getProjectProgress, getRoundDetails, getTotalKOMStaked, getUserTotalPurchase, komAPI, reduceAmount } from "@/bot/utils";
import { getProjects } from "@/bot/utils/launchpad";
import { IProject, ROUND_DETAIL } from "@/types";
import { startNoWallet } from "../main.controller";
import { CAMPAIGN_SOCIAL_NAMES } from "@/constants/utils";
import { PLACE_HOLDER } from "@/constants/pictures";
import { utils } from "ethers";

export const menu = async (ctx: any) => {
    try {
        ctx.session.currentLaunchpadType = 'ended';
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
        await ctx.reply("⏱ Loading Ended Projects...");
        // page settings
        const projects = await getProjects('ended', address);
        const page = ctx.session.page ?? 1;
        const total = projects.length;
        const PAGE_LEN = 10;
        const { count, buttons } = getPaginationButtons(total, PAGE_LEN, page);

        await ctx.reply(
            '⏰ Loading Projects Details...',
            {
                reply_markup: {
                    keyboard: [buttons, [{ text: '👈 Back to Launchpad' }]], resize_keyboard: true
                },
            }
        );
        // slice for page and get progress details
        const _projects: IProject[] = await Promise.all(projects.slice((page - 1) * PAGE_LEN, page * PAGE_LEN).map(async (_item: IProject) => ({
            ..._item,
            progress: _item.project ? await getProjectProgress(_item.project, _item.tokenDecimal) : {
                price: 1,
                sale: Number(utils.formatUnits(_item.sale, _item.tokenDecimal)),
                sold: Number(utils.formatUnits(_item.sold, _item.tokenDecimal)),
            }
        })));
        // show list of active projects
        for (let i = 0; i < _projects.length; i++) {
            const _project: IProject = _projects[i];
            // project types
            let _type = '';
            if (_project.secure) {
                _type = ' 🔐Secure';
            } else if (_project.priority) {
                _type = '⭐Priority';
            } else if (_project.exclusive) {
                _type = ' 💎Exclusive'
            } else if (_project.nonRefundable) {
                _type = ' 💤Non refundable';
            }
            // social links
            const socials = _project.social ? _project.social.map((item: { icon: string, link: string }) => ` <a href='${item.link}'>${CAMPAIGN_SOCIAL_NAMES[item.icon] ?? item.icon}</a>`).join(' | ') : '';
            // campain links
            const promos = _project.promo ? Object.entries(_project.promo).filter(([key, value]) => key !== 'research' && key !== 'banner').map(([key, value]) => ` <a href='${value}'>${CAMPAIGN_SOCIAL_NAMES[key] ?? key}</a>`).join(' | '): '';
            // message
            let msg =
                `${(page - 1) * PAGE_LEN + i + 1}. 💎 ${_project.name} <b><i> ($${_project.ticker})</i></b>    <b><i><u>${_project.type.label}</u></i></b>\n\n` +
                `- Round: <b><i>${_project.roundLabel}</i></b>\n` +
                (_type ? `- Rules: <b><i>${_type}</i></b>\n\n`: '\n') +
                promos + (promos.length > 0 ? '\n\n' : '') +
                `<i>${_project.desc.substring(0, 200)} ...</i>\n\n` +
                socials +
                (_project.promo ? `\n\n🎓 <b><a href='${_project?.promo?.research}'>Research</a></b>\n\n` : '\n\n') +
                `- <i>Total Supply</i>: <b>${_project.supply}</b>\n` +
                `- <i>Initial Marketcap</i>: <b>${_project.marketcap}</b>\n` +
                `- <i>Swap Rate</i>: <b>${_project.price}</b>\n\n` +
                `💰 <i><u>Total Raised</u></i>:   <b>${formatNumber(_project.progress.sold * 100 / _project.progress.sale, 3)}%  [$${formatNumber(_project.progress.sold * _project.progress.price, 3)}]</b>\n` +
                `⚡ <b>${formatNumber(_project.progress.sold, 3)} ${_project.ticker}  /  ${formatNumber(_project.progress.sale, 3)} ${_project.ticker}</b>\n\n` +
                `- <i>Starts</i>: <b>${_project.calculation_time}</b>\n` +
                `- <i>Target Raised</i>: <b>$${formatNumber(_project.target.total)}</b>\n\n` +
                `<i>${_project.distribution}</i>` +
                ``;
            await ctx.replyWithPhoto(
                _project.sale_card ? _project.sale_card : PLACE_HOLDER,
                // { source: _project.buffer },
                {
                    caption: msg,
                    parse_mode: "HTML",
                    reply_markup: {
                        inline_keyboard: [
                            [
                                { text: `Go to Project Details 👉`, callback_data: `gotoEndedProject_project=IKO-${_project.ticker}-${_project.round}` },
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
        // id = 'project=IKO-BPAY-PublicCross';
        ctx.session.currentPage = `endedProject_${id}`;
        const chainId = ctx.session.chainId ?? 137;
        if (!ctx.session.account) {
            return startNoWallet(ctx);
        } else if (chainId !== 137 && chainId !== 42161) {
            return ctx.reply("⚠ Please switch to Polygon or Arbitrum network");
        }
        const { address, name } = ctx.session.account;
        // const { address, name } = {
        //     // address: '0xeB5768D449a24d0cEb71A8149910C1E02F12e320',
        //     address: '0xabe34cE4f1423CD9025DB7Eb7637a08AF60d4Af3',
        //     name: 'test'
        // };
        await ctx.reply(
            `⏱ Loading ${id}'s details ...`,
            {
                reply_markup: {
                    keyboard: [[]],
                    resize_keyboard: true,
                }
            }
        );
        let { result: project }: { result: IProject } = await komAPI(`https://api.kommunitas.net/v1/launchpad/project/?${id}&invested=false`);
        // get round details
        await ctx.reply("⏱ Loading Rounds' Details ...");
        const {
            price,
            roundsDetails,
        } = await getRoundDetails(project.project, project.tokenDecimal, address, project.crosschain ? true : false)
        // progress
        await ctx.reply("⏱ Loading Project Progress Details ...");
        project.progress = project.project ? await getProjectProgress(project.project, project.tokenDecimal) : {
            price: 1,
            sale: Number(utils.formatUnits(project.sale, project.tokenDecimal)),
            sold: Number(utils.formatUnits(project.sold, project.tokenDecimal)),
        }
        // social links
        const socials = project.social ? project.social.map((item: { icon: string, link: string }) => ` <a href='${item.link}'>${CAMPAIGN_SOCIAL_NAMES[item.icon] ?? item.icon}</a>`).join(' | ') : '';
        // campain links
        const promos = project.promo ? Object.entries(project.promo).filter(([key, value]) => key !== 'research' && key !== 'banner').map(([key, value]) => ` <a href='${value}'>${CAMPAIGN_SOCIAL_NAMES[key] ?? key}</a>`).join(' | '): '';
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
        // header messsage
        let _introduction =
            `💎 ${project.name} <b><i> ($${project.ticker})</i></b>    <b><i><u>${project.type.label}</u></i></b>\n\n` +
            promos +
            (promos.length > 0 ? '\n\n' : '') +
            `- Round: <b><i>${project.roundLabel}</i></b>\n` +
            (_type ? `- Rules: <b><i>${_type}</i></b>\n\n`: '\n') +
            `<i>${project.desc}</i>\n\n`;
        // detail message
        const _details =
            socials +
            `\n\n🎓 <b><a href='${project?.promo?.research}'>Research</a></b>${new Array(50).fill(" ").join(" ")}\n\n` +
            `- Token Type: <b><i>${project.type.label}</i></b>\n` +
            `- Token Address: <b><i>${project.listing}</i></b>\n` +
            `- Total Supply: <b><i>${project.supply}</i></b>\n` +
            `- Initial Marketcap: <b><i>${project.marketcap}</i></b>\n` +
            `- Swap Rate: <b><i>${project.price}</i></b>\n\n` +
            `💰 <i><u>Total Raised</u></i>:   <b>${formatNumber(project.progress.sold * 100 / project.progress.sale, 3)}%  [$${formatNumber(project.progress.sold * project.progress.price, 3)}]</b>\n` +
            `⚡ <b>${formatNumber(project.progress.sold, 3)} ${project.ticker}  /  ${formatNumber(project.progress.sale, 3)} ${project.ticker}</b>\n\n` +
            `- Last Staking & Voting Period: <b><i>${project.calculation_time}</i></b>\n` +
            `- Preparation Period: <b><i>${project.preparation_time}</i></b>\n\n` +
            `- Target Raised: <b><i>$${project.target.total}</i></b>\n` +
            `- Vesting: <b><i>${project.vesting}</i></b>\n` +
            `- Refund Period: <b><i>${project.refund}</i></b>\n` +
            `- Listing: <b><i>${project.listing}</i></b>\n\n` +
            `<i>${project.distribution}</i>\n\n`;

        const _footer =
            `⭐⭐⭐⭐⭐   My Purchase   ⭐⭐⭐⭐⭐\n\n` +
            `💼 My Account: <b><i><code>${address}</code></i></b> <i>(${name})</i>\n\n` +
            (project.project && project.crosschain ? roundsDetails.map((_detail: ROUND_DETAIL) =>
                `<b><i>${_detail.name}</i></b>\n` +
                `- Start: <b><i>${new Date(_detail.start * 1000).toUTCString()}</i></b>\n` +
                `- End: <b><i>${new Date(_detail.end * 1000).toUTCString()}</i></b>\n` +
                `- Price: <b><i>${price / 1e6}</i></b>\n` +
                `- Fee: <b><i>${_detail.fee_d2 ? _detail.fee_d2 / 1e2 + '% (Non-Refundable)' : '-'}</i></b>\n` +
                // (_detail.min > 0 ? `- Min Buy: <b><i>${formatNumber(_detail.min)} ${project.ticker}</i></b>\n` : '') +
                // `- Max Buy: <b><i>${formatNumber(_detail.max)} ${project.ticker}</i></b>\n` +
                `- Total Sold: <b><i>${formatNumber(_detail.tokenAchieved)} ${project.ticker}</i></b>\n` +
                `- My Purchase: <b><i>${formatNumber(_detail.purchasedPerRound)} ${project.ticker}  = $${formatNumber(_detail.purchasedPerRound * price / 1e6)}</i></b>\n`
            ).join('\n') : '') +
            `\n\n`;

        await ctx.reply("⏱ Making banner ...");
        project.buffer = await drawLogoWithBanner(project.sale_card ? project.sale_card : PLACE_HOLDER, project.image);
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
                        [{ text: '👈 Back to Ended' }, { text: '👈 Back to Launchpad' }]
                    ],
                    resize_keyboard: true,
                },
                link_preview_options: {
                    is_disabled: true
                }
            }
        );
        await ctx.reply(
            _footer,
            {
                parse_mode: "HTML",
                reply_markup: {
                    inline_keyboard: [
                        [{ text: `Refresh ❄`, callback_data: `refreshActive_project=IKO-${project.ticker}-${project.round}` }],
                        [{ text: `Go to vesting portal 👁‍🗨`, callback_data: `gotoVestingPortal_project=IKO-${project.ticker}-${project.round}` }],
                    ],
                },
                link_preview_options: {
                    is_disabled: true
                }
            }
        );
    } catch (err) {
        console.log(err)
        await ctx.reply('⚠ Failed to load this project.');
    }
}