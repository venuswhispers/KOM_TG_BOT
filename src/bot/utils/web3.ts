import { utils } from "ethers";
import { chains, CONTRACTS } from "../../constants/config";
import { STAKEV3_DETAIL_ITEM } from "../../types";
import { getKOMTokenPrice } from "./utils";
const { ethers } = require('ethers');

/**
 * get native token balance
 * @param address 
 * @param provider 
 */
export const getETHBalance = async (address: string, provider: any) => {
    try {
        const _balance: BigInt = await provider.getBalance(address);
        return ethers.utils.formatEther(_balance);
    } catch (err) {
        return "0";
    }
}
/**
 * get KOM token balance
 * @param chainId 
 * @param address 
 * @param provider 
 */
export const getKOMBalance = async (chainId: number, address: string, provider: any) => {
    try {
        const { address: CONTRACT_ADDRESS, abi } = CONTRACTS[chainId].KOM;
        const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, provider);
        const _balance = await contract.balanceOf(address);
        return ethers.utils.formatUnits (_balance, 8);
    } catch (err) {
        return "0.0";
    }
}
/**
 * get KOMV token balance
 * @param chainId 
 * @param address 
 * @param provider 
 */
export const getKOMVBalance = async (chainId: number, address: string, provider: any) => {
    try {
        const { address: CONTRACT_ADDRESS, abi } = CONTRACTS[chainId].KOMV;
        const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, provider);
        const _balance = await contract.balanceOf(address);
        return ethers.utils.formatUnits (_balance, 0);
    } catch (err) {
        return 0.0;
    }
}
/**
 * get ETH, KOM, KMOV balance
 * @param chainId 
 * @param address 
 * @returns 
 */
export const getTokenBalances = async (chainId: number, address: string) => {
    try {
        const _chain = chains[chainId];
        // web3 provider
        const provider = new ethers.providers.JsonRpcProvider(_chain.rpc);
        // get balances
        const [nativeBalance, komBalance, komvBalance, komTokenPrice] = await Promise.all([
            getETHBalance(address, provider), 
            getKOMBalance(chainId, address, provider),
            getKOMVBalance(chainId, address, provider),
            getKOMTokenPrice()
        ]);
        return {
            nativeBalance,
            komBalance, 
            komvBalance,
            komTokenPrice
        }
    } catch (err) {
        return {
            nativeBalance: 0.0,
            komBalance: 0.0,
            komvBalance: 0.0,
            komTokenPrice: 0.0
        }
    }
}
/**
 * get stakingV3 details
 * @param chainId 
 * @param address 
 * @returns 
 */
export const getStakingV2Details = async (chainId: number, address: string) => {
    try {
        const _chain = chains[chainId];
        // web3 provider
        const provider = new ethers.providers.JsonRpcProvider(_chain.rpc);
        // contracts
        const { address: STAKING_CONTRACT_ADDRESS, abi: STAKING_ABI } = CONTRACTS[chainId].STAKING_V2;
        const _contractStaking = new ethers.Contract(STAKING_CONTRACT_ADDRESS, STAKING_ABI, provider);

        const _amount = await _contractStaking.getUserStakedTokens (address);
        return ethers.utils.formatUnits(_amount, 8);
    } catch (err) {
        return '0.0';
    }
}
/**
 * get stakingV3 details
 * @param chainId 
 * @param address 
 * @returns 
 */
export const getStakingV1Details = async (chainId: number, address: string) => {
    try {
        const _chain = chains[chainId];
        // web3 provider
        const provider = new ethers.providers.JsonRpcProvider(_chain.rpc);
        // contracts
        const { address: STAKING_CONTRACT_ADDRESS, abi: STAKING_ABI } = CONTRACTS[chainId].STAKING_V1;
        const _contractStaking = new ethers.Contract(STAKING_CONTRACT_ADDRESS, STAKING_ABI, provider);

        const _amount = await _contractStaking.getUserStakedTokens (address);
        return ethers.utils.formatUnits(_amount, 8);
    } catch (err) {
        return '0';
    }
}
/**
 * 
 * @param chainId 
 * @param address 
 * @param index 
 * @param provider 
 * @returns 
 */
export const getStakingV3Detail = async (chainId: number, address: string, index: number, provider?: any) => {
    // web3 provider
    if (!provider) {
        const _chain = chains[chainId];
        provider = new ethers.providers.JsonRpcProvider(_chain.rpc);
    } 
    // contracts
    const { address: STAKING_CONTRACT_ADDRESS, abi: STAKING_ABI } = CONTRACTS[chainId].STAKING_V3;
    const _contractStaking = new ethers.Contract(STAKING_CONTRACT_ADDRESS, STAKING_ABI, provider);
    const [
        lockPeriodInDays,
        compoundType,
        amount,
        reward,
        prematurePenalty,
        stakedAt,
        endedAt
    ] = await _contractStaking.getStakedDetail (address, index);
    return {
        lockPeriodInDays: Number(lockPeriodInDays),
        compoundType: Number(compoundType),
        amount: ethers.utils.formatUnits(amount, 8),
        reward: ethers.utils.formatUnits(reward, 8),
        prematurePenalty: ethers.utils.formatUnits(prematurePenalty, 8),
        stakedAt: Number(stakedAt),
        endedAt: Number(endedAt),
    };
}
/**
 * get stakingV3 details
 * @param chainId 
 * @param address 
 * @returns 
 */
export const getStakingV3Details = async (chainId: number, address: string) => {
    try {
        const _chain = chains[chainId];
        // web3 provider
        const provider = new ethers.providers.JsonRpcProvider(_chain.rpc);
        // contracts
        const { address: STAKING_CONTRACT_ADDRESS, abi: STAKING_ABI } = CONTRACTS[chainId].STAKING_V3;
        const _contractStaking = new ethers.Contract(STAKING_CONTRACT_ADDRESS, STAKING_ABI, provider);

        const [_userStakedLength, { stakedAmount, stakerPendingReward }] = await Promise.all([
            _contractStaking.userStakedLength (address),
            _contractStaking.stakerDetail(address)
        ]);
        const _stakedDetails: STAKEV3_DETAIL_ITEM[] = await Promise.all(Array.from({ length: _userStakedLength }, (_, index) => index).map((idx: number) => getStakingV3Detail (chainId, address, idx, provider)));
    
        return {
            stakedAmount: ethers.utils.formatUnits(stakedAmount, 8),
            stakerPendingReward: ethers.utils.formatUnits(stakerPendingReward, 8),
            stakedDetails: _stakedDetails
        }
    } catch (err) {
        return {
            stakedAmount: '0.0',
            stakerPendingReward: '0.0',
            stakedDetails: []
        }
    }
}
/**
 * get getStakership Details
 * @param chainId 
 * @param address 
 * @returns 
 */
export const getStakershipDetails = async (chainId: number, address: string) => {
    try {
        const _chain = chains[chainId];
        // web3 provider
        const provider = new ethers.providers.JsonRpcProvider(_chain.rpc);
        // contracts
        const { address: STAKING_CONTRACT_ADDRESS, abi: STAKING_ABI } = CONTRACTS[chainId].STAKING_V3;
        const _contractStaking = new ethers.Contract(STAKING_CONTRACT_ADDRESS, STAKING_ABI, provider);

        const originStakership = await _contractStaking.originStakership(address);
        const pendingStakership = await _contractStaking.pendingStakership(address);

        return {
            originStakership,
            pendingStakership
        }
    } catch (err) {
        return {
            originStakership: '0x0000000000000000000000000000000000000000',
            pendingStakership: '0x0000000000000000000000000000000000000000',
        }
    }
}
/**
 * get stakingV3 details
 * @param chainId 
 * @param address 
 * @returns 
 */
export const getStakingV3StakedDetails = async (chainId: number, address: string) => {
    try {
        const _chain = chains[chainId];
        // web3 provider
        const provider = new ethers.providers.JsonRpcProvider(_chain.rpc);
        // contracts
        const { address: STAKING_CONTRACT_ADDRESS, abi: STAKING_ABI } = CONTRACTS[chainId].STAKING_V3;
        const _contractStaking = new ethers.Contract(STAKING_CONTRACT_ADDRESS, STAKING_ABI, provider);
        const [
            { stakedAmount, stakerPendingReward },
            _userStakedLength,
            komTokenPrice
        ] = await Promise.all([
            _contractStaking.stakerDetail(address),
            _contractStaking.userStakedLength (address),
            getKOMTokenPrice ()
        ]);
        
        return {
            stakedAmount: ethers.utils.formatUnits(stakedAmount, 8),
            stakerPendingReward: ethers.utils.formatUnits(stakerPendingReward, 8),
            userStakedLength: Number(_userStakedLength),
            komTokenPrice
        }
    } catch (err) {
        return {
            stakedAmount: 0.0,
            stakerPendingReward: 0.0,
            userStakedLength: 0,
            komTokenPrice: 0
        }
    }
}
/**
 * get LP token balance
 * @param address 
 * @param chainId 
 * @returns 
 */
export const getLPBalance = async (address: string, chainId: number = 137) => {
    try {
        const _chain = chains[chainId];
        // web3 provider
        const provider = new ethers.providers.JsonRpcProvider(_chain.rpc);
        // contracts
        const { address, abi } = CONTRACTS[chainId].LP;
        const _contract = new ethers.Contract(address, abi, provider);
        const _balance = await _contract.balanceOf (address);
        return ethers.utils.formatEther (_balance);
    } catch (err) {
        return 0;
    }
}
/**
 * get LP token balance
 * @param address 
 * @param chainId 
 * @returns 
 */
export const getLPStakingDetails = async (address: string, chainId: number = 137) => {
    try {
        const _chain = chains[chainId];
        // web3 provider
        const provider = new ethers.providers.JsonRpcProvider(_chain.rpc);
        // contracts
        const { address, abi } = CONTRACTS[chainId].STAKING_LP;
        const _contract = new ethers.Contract(address, abi, provider);
        const { amount, claimableEpoch, index } = await _contract.stakes (address);
        return {
            amount: ethers.utils.formatEther(amount),
            claimableEpoch: Number(claimableEpoch),
            index: Number(index)
        }
    } catch (err) {
        return {
            amount: 0,
            claimableEpoch: 0,
            index: 0
        }
    }
}


