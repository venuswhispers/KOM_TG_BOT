import { chains } from "../../constants/config";
import { CONTRACTS } from "../../constants/config";
import { 
    COMPOUND_MODE_CHANGED_IMAGED, 
    STAKERSHIP_RECEIVED_IMAGE, 
    STAKERSHIP_TRANSFERRED_IMAGE, 
    STAKING_LP_BANNER_IMAGE, 
    STAKING_LP_SUCCESS_IMAGE, 
    STAKING_V3_SUCCESS_IMAGE, 
    UNSTAKING_V3_SUCCESS_IMAGE 
} from "../../constants/pictures";
import { menu as menuStakingV3, stakingV3_ongoing_staking_details } from "../controllers/staking/v3/main.controller";
import { menu as menuStakingLP } from "../controllers/staking/lp/main.controller";
const { ethers } = require('ethers');

/**
 * staking tokens with version 3
 * @param ctx 
 * @param address 
 * @param privateKey 
 * @param stakingAmount 
 * @param stakingPeriod 
 * @param stakingMode 
 * @returns 
 */
export const stakeKomV3 = async (ctx: any, address: string, privateKey: string, stakingAmount: number, stakingPeriod: number, stakingMode: number) => {
    console.log({
        address,
        stakingPeriod,
        stakingMode,
        stakingAmount,
        privateKey
    });
    
    const loading = await ctx.reply(`⏰  Loading StakingV3 Contract ...`);
    try {
        const chainId = ctx.session.chainId ?? 137;
        const _chain = chains[chainId];
        const { address: STAKING_CONTRACT_ADDRESS, abi: STAKING_ABI } = CONTRACTS[chainId].STAKING_V3;
        const { address: KOM_CONTRACT_ADDRESS, abi: KOM_ABI } = CONTRACTS[chainId].KOM;
        //staking params
        
        // web3 provider
        const provider = new ethers.providers.JsonRpcProvider(_chain.rpc);
        // signer
        const signer = new ethers.Wallet(privateKey, provider);

        // approve
        ctx.telegram.editMessageText(ctx.chat.id, loading.message_id, null, '⏰  Approving KOM tokens ...');
        const _contractKOM = new ethers.Contract(KOM_CONTRACT_ADDRESS, KOM_ABI, signer);
        const _allowance = await _contractKOM.allowance(address, STAKING_CONTRACT_ADDRESS);
        const _balance = await _contractKOM.balanceOf(address);

        const balance = Number(ethers.utils.formatUnits(_balance, 8));
        const allowance = Number(ethers.utils.formatUnits(_allowance, 8));
        
        console.log({allowance, stakingAmount, balance})

        if (balance < stakingAmount) {
            ctx.reply(
                `⚠ Insufficient KOM token balance to stake\nRequired: ${stakingAmount} <i>(balance: ${balance})</i>`,
                {
                    parse_mode: "HTML"
                }
            );
            return;
        }

        const settings = chainId === 137 ? { gasLimit: 3000000, gasPrice: 8e10 } : {};
        
        if (allowance < stakingAmount) {
            const _txApprove = await _contractKOM.approve(STAKING_CONTRACT_ADDRESS, stakingAmount * 1e8, settings);
            await _txApprove.wait();
            console.log({ hash: _txApprove.hash });
        }
        // staking...
        ctx.telegram.editMessageText(ctx.chat.id, loading.message_id, null, '⏰  Sending Staking Transaction...');
        const _contractStaking = new ethers.Contract(STAKING_CONTRACT_ADDRESS, STAKING_ABI, signer);
        const _txStaking = await _contractStaking.stake(stakingAmount * 1e8, stakingPeriod, stakingMode, settings);
        await _txStaking.wait();
        console.log("staked...");
        // await ctx.deleteMessage(loading.message_id).catch((err: any) => { });
        await ctx.replyWithPhoto(
            STAKING_V3_SUCCESS_IMAGE,
            {
                caption: `🌹 Successfully staked ${stakingAmount} $KOM\n\n<a href='${_chain.explorer}tx/${_txStaking.hash}'>👁‍🗨 Click to view transaction</a>`,
                parse_mode: "HTML",
                link_preview_options: {
                    is_disabled: true
                }
            }
        );
        menuStakingV3 (ctx);
    } catch (err) {
        let msg = "An unexpected error occurred while running tx";
        if (String(err).includes("insufficient funds for intrinsic transaction cost")) {
            msg = "Insufficient funds for intrinsic transaction cost";
        } else if (String(err).includes("cannot estimate gas")) {
            msg = "Cannot estimate gas";
        } else if (String(err).includes("intrinsic gas too low")) {
            msg = "Intrinsic gas too low";
        } else {
            console.log(err);
        }
        ctx.telegram.editMessageText(ctx.chat.id, loading.message_id, null, `⚠ ${msg}`);
    }
}
/**
 * staking LP
 * @param ctx 
 * @param address 
 * @param privateKey 
 * @param stakingAmount 
 * @param stakingPeriod 
 * @param stakingMode 
 * @returns 
 */
export const stakeLP = async (ctx: any, address: string, privateKey: string, stakingAmount: number) => {
    
    await ctx.reply(`⏰  Loading StakingLP Contract ...`);
    try {
        const chainId = 137;
        const _chain = chains[chainId];
        const { address: STAKING_CONTRACT_ADDRESS, abi: STAKING_ABI } = CONTRACTS[chainId].STAKING_LP;
        const { address: LP_CONTRACT_ADDRESS, abi: LP_ABI } = CONTRACTS[chainId].LP;
        
        // web3 provider
        const provider = new ethers.providers.JsonRpcProvider(_chain.rpc);
        // signer
        const signer = new ethers.Wallet(privateKey, provider);

        // approve
        ctx.reply('⏰  Approving LP tokens ...');
        const _contractLP = new ethers.Contract(LP_CONTRACT_ADDRESS, LP_ABI, signer);
        const _allowance = await _contractLP.allowance(address, STAKING_CONTRACT_ADDRESS);
        const _balance = await _contractLP.balanceOf(address);

        const balance = Number(ethers.utils.formatUnits(_balance, 18));
        const allowance = Number(ethers.utils.formatUnits(_allowance, 18));
        
        console.log({allowance, stakingAmount, balance})

        if (balance < stakingAmount) {
            ctx.reply(
                `⚠ Insufficient LP token balance to stake\nRequired: ${stakingAmount} <i>(balance: ${balance})</i>`,
                {
                    parse_mode: "HTML"
                }
            );
            return;
        }

        const settings = chainId === 137 ? { gasLimit: 3000000, gasPrice: 8e10 } : {};
        const _amount = ethers.utils.parseEther(String(stakingAmount))
        if (allowance < stakingAmount) {
            const _txApprove = await _contractLP.approve(STAKING_CONTRACT_ADDRESS, _amount, settings);
            await _txApprove.wait();
            console.log({ hash: _txApprove.hash });
        }
        // staking...
        
        ctx.reply('⏰  Sending Staking Transaction...');
        const _contractStaking = new ethers.Contract(STAKING_CONTRACT_ADDRESS, STAKING_ABI, signer);
        const _txStaking = await _contractStaking.stake(_amount, settings);
        await _txStaking.wait();
        console.log("staked...");
        await ctx.replyWithPhoto(
            STAKING_LP_SUCCESS_IMAGE,
            {
                caption: `🌹 Successfully Staked ${stakingAmount} $LP\n\n<a href='${_chain.explorer}tx/${_txStaking.hash}'>👁‍🗨 Click to view transaction</a>`,
                parse_mode: "HTML",
                link_preview_options: {
                    is_disabled: true
                }
            }
        );
        menuStakingLP (ctx);
    } catch (err) {
        let msg = "An unexpected error occurred while running tx";
        if (String(err).includes("insufficient funds for intrinsic transaction cost")) {
            msg = "Insufficient funds for intrinsic transaction cost";
        } else if (String(err).includes("cannot estimate gas")) {
            msg = "Cannot estimate gas";
        } else if (String(err).includes("intrinsic gas too low")) {
            msg = "Intrinsic gas too low";
        } else {
            console.log(err);
        }
        ctx.reply(`⚠ ${msg}`);
    }
}
/**
 * 
 * @param ctx 
 * @param address 
 * @param privateKey 
 * @param index 
 * @param newCompoundType 
 */
export const changeCompoundType = async (ctx: any, address: string, privateKey: string, index: number, newCompoundType: number) => {
    console.log({
        address,
        privateKey,
        index,
        newCompoundType
    });
    
    const loading = await ctx.reply(`⏰  Loading StakingV3 Contract ...`);
    try {
        const chainId = ctx.session.chainId ?? 137;
        const _chain = chains[chainId];
        const { address: STAKING_CONTRACT_ADDRESS, abi: STAKING_ABI } = CONTRACTS[chainId].STAKING_V3;
        //staking params
        
        // web3 provider
        const provider = new ethers.providers.JsonRpcProvider(_chain.rpc);
        // signer
        const signer = new ethers.Wallet(privateKey, provider);
        const settings = chainId === 137 ? { gasLimit: 3000000, gasPrice: 8e10 } : {};
        
        // staking...
        ctx.telegram.editMessageText(ctx.chat.id, loading.message_id, null, '⏰  Sending changeCompoundMode Transaction...');
        const _contractStaking = new ethers.Contract(STAKING_CONTRACT_ADDRESS, STAKING_ABI, signer);
        const _tx = await _contractStaking.changeCompoundType(index, newCompoundType, settings);
        console.log({
            hash: _tx.hash
        })
        await _tx.wait();
        console.log("changed...");
        // await ctx.deleteMessage(loading.message_id).catch((err: any) => { });
        await ctx.replyWithPhoto(
            COMPOUND_MODE_CHANGED_IMAGED,
            {
                caption: `🌹 Successfully changed your compound type.\n\n<a href='${_chain.explorer}tx/${_tx.hash}'>👁‍🗨 Click to view transaction</a>`,
                parse_mode: "HTML",
                link_preview_options: {
                    is_disabled: true
                }
            }
        );
        stakingV3_ongoing_staking_details (ctx);
    } catch (err) {
        let msg = "An unexpected error occurred while running tx";
        if (String(err).includes("insufficient funds for intrinsic transaction cost")) {
            msg = "Insufficient funds for intrinsic transaction cost";
        } else if (String(err).includes("cannot estimate gas")) {
            msg = "Cannot estimate gas";
        } else if (String(err).includes("intrinsic gas too low")) {
            msg = "Intrinsic gas too low";
        } else {
            console.log(err);
        }
        ctx.reply(`⚠ ${msg}`);
    }
}
/**
 * 
 * @param ctx 
 * @param privateKey 
 * @param transferStakershipAddress 
 * @returns 
 */
export const transferStakerShip = async (ctx: any, privateKey: string, transferStakershipAddress: string) => {
    const loading = await ctx.reply(`⏰  Loading StakingV3 Contract ...`);
    try {
        const chainId = 137;
        const _chain = chains[chainId];
        const { address: STAKING_CONTRACT_ADDRESS, abi: STAKING_ABI } = CONTRACTS[chainId].STAKING_V3;
        // web3 provider
        const provider = new ethers.providers.JsonRpcProvider(_chain.rpc);
        // signer
        const signer = new ethers.Wallet(privateKey, provider);

        const settings = chainId === 137 ? { gasLimit: 3000000, gasPrice: 8e10 } : {};
        
        // staking...
        ctx.telegram.editMessageText(ctx.chat.id, loading.message_id, null, '⏰  Sending TransferStakership Transaction...');
        const _contractStaking = new ethers.Contract(STAKING_CONTRACT_ADDRESS, STAKING_ABI, signer);
        const _tx = await _contractStaking.transferStakership(transferStakershipAddress, settings);
        await _tx.wait();
        // console.log({ hash: _tx.hash });
        console.log("transfered...");
        await ctx.replyWithPhoto(
            STAKERSHIP_TRANSFERRED_IMAGE,
            {
                caption: `🌹 Your $KOM token stakership is successfully transfered to <i><b>${transferStakershipAddress}</b></i>\n\n<a href='${_chain.explorer}tx/${_tx.hash}'>👁‍🗨 Click to view transaction</a>`,
                parse_mode: "HTML",
                link_preview_options: {
                    is_disabled: true
                }
            }
        );
        menuStakingV3 (ctx);
    } catch (err) {
        let msg = "An unexpected error occurred while running tx";
        if (String(err).includes("insufficient funds for intrinsic transaction cost")) {
            msg = "Insufficient funds for intrinsic transaction cost";
        } else if (String(err).includes("cannot estimate gas")) {
            msg = "Cannot estimate gas";
        } else if (String(err).includes("intrinsic gas too low")) {
            msg = "Intrinsic gas too low";
        } else {
            console.log(err);
        }
        ctx.telegram.editMessageText(ctx.chat.id, loading.message_id, null, `⚠ ${msg}`);
    }
}
/**
 * 
 * @param ctx 
 * @param privateKey 
 */
export const accpetStakership = async (ctx: any, privateKey: string, originStakership: string) => {
    const loading = await ctx.reply(`⏰  Loading StakingV3 Contract ...`);
    try {
        const chainId = 137;
        const _chain = chains[chainId];
        const { address: STAKING_CONTRACT_ADDRESS, abi: STAKING_ABI } = CONTRACTS[chainId].STAKING_V3;
        // web3 provider
        const provider = new ethers.providers.JsonRpcProvider(_chain.rpc);
        // signer
        const signer = new ethers.Wallet(privateKey, provider);

        const settings = chainId === 137 ? { gasLimit: 3000000, gasPrice: 8e10 } : {};
        
        // staking...
        ctx.telegram.editMessageText(ctx.chat.id, loading.message_id, null, '⏰  Sending AcceptStakership Transaction...');
        const _contractStaking = new ethers.Contract(STAKING_CONTRACT_ADDRESS, STAKING_ABI, signer);
        const _tx = await _contractStaking.acceptStakerShip(settings);
        await _tx.wait();
        // console.log({ hash: _tx.hash });
        console.log("transfered...");
        await ctx.replyWithPhoto(
            STAKERSHIP_RECEIVED_IMAGE,
            {
                caption: `🌹 You accepted stakership from <i><b>${originStakership}</b></i>\n\n<a href='${_chain.explorer}tx/${_tx.hash}'>👁‍🗨 Click to view transaction</a>`,
                parse_mode: "HTML",
                link_preview_options: {
                    is_disabled: true
                }
            }
        );
        menuStakingV3 (ctx);
    } catch (err) {
        let msg = "An unexpected error occurred while running tx";
        if (String(err).includes("insufficient funds for intrinsic transaction cost")) {
            msg = "Insufficient funds for intrinsic transaction cost";
        } else if (String(err).includes("cannot estimate gas")) {
            msg = "Cannot estimate gas";
        } else if (String(err).includes("intrinsic gas too low")) {
            msg = "Intrinsic gas too low";
        } else {
            console.log(err);
        }
        ctx.telegram.editMessageText(ctx.chat.id, loading.message_id, null, `⚠ ${msg}`);
    }
}
/**
 * unstake KOM tokens
 * @param ctx 
 * @param address 
 * @param privateKey 
 * @param withdrawAmount 
 * @param index 
 * @returns 
 */
export const unstakeKomV3 = async (ctx: any, address: string, privateKey: string, withdrawAmount: number, index: number) => {
    console.log({
        address,
        withdrawAmount,
        index
    });
    
    const loading = await ctx.reply(`⏰  Loading StakingV3 Contract ...`);
    
    try {
        const chainId = ctx.session.chainId ?? 137;
        const _chain = chains[chainId];
        const { address: STAKING_CONTRACT_ADDRESS, abi: STAKING_ABI } = CONTRACTS[chainId].STAKING_V3;
        
        // web3 provider
        const provider = new ethers.providers.JsonRpcProvider(_chain.rpc);
        // signer
        const signer = new ethers.Wallet(privateKey, provider);
        const settings = chainId === 137 ? { gasLimit: 6000000, gasPrice: 8e10 } : {};
        
        // unstaking...
        ctx.telegram.editMessageText(ctx.chat.id, loading.message_id, null, '⏰  Sending unstake Transaction...');
        const _contractStaking = new ethers.Contract(STAKING_CONTRACT_ADDRESS, STAKING_ABI, signer);
        const _txUnStaking = await _contractStaking.unstake(index, withdrawAmount * 1e8, address, settings);
        await _txUnStaking.wait();
        console.log("unstaked...");
        await ctx.deleteMessage(loading.message_id).catch((err: any) => { });

        ctx.replyWithPhoto(
            UNSTAKING_V3_SUCCESS_IMAGE,
            {
                caption: `🌹 Successfully unstaked ${withdrawAmount / 2} $KOM\n\n<a href='${_chain.explorer}tx/${_txUnStaking.hash}'>👁‍🗨 Click to view transaction</a>`,
                parse_mode: "HTML",
                link_preview_options: {
                    is_disabled: true
                }
            }
        );
        menuStakingV3 (ctx);
    } catch (err) {
        let msg = "An unexpected error occurred while running tx";
        if (String(err).includes("insufficient funds for intrinsic transaction cost")) {
            msg = "Insufficient funds for intrinsic transaction cost";
        } else if (String(err).includes("cannot estimate gas")) {
            msg = "Cannot estimate gas";
        } else if (String(err).includes("intrinsic gas too low")) {
            msg = "Intrinsic gas too low";
        } else {
            console.log(err);
        }
        ctx.telegram.editMessageText(ctx.chat.id, loading.message_id, null, `⚠ ${msg}`);
    }
}

/**
 * 
 * @param stakingAmount 
 * @param stakingPeriod 
 */
export const calculateReard = async (stakingAmount: number, stakingPeriod: number) => {
    try {
        const _chain = chains[137];
        const { address: STAKING_CONTRACT_ADDRESS, abi: STAKING_ABI } = CONTRACTS[137].STAKING_V3;
        const provider = new ethers.providers.JsonRpcProvider(_chain.rpc);
        const _contractKOM = new ethers.Contract(STAKING_CONTRACT_ADDRESS, STAKING_ABI, provider);
        const _reward = await _contractKOM.calculateReward(stakingAmount * 1e8, stakingPeriod);
        console.log(_reward)
        return ethers.utils.formatUnits(_reward, 8);
    } catch (err) {
        return '0.0';
    }
}