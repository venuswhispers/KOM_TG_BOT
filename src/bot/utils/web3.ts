import { chains, CONTRACTS, USDTS } from "../../constants/config";
import { CHAIN_BALANCE, CROSS_CHAIN, ROUND_DETAIL, STAKEV3_DETAIL_ITEM } from "@/types";
import { getKOMTokenPrice } from "./utils";
import { _TypedDataEncoder } from "ethers/lib/utils";
import PublicGovSaleABI from '@/constants/abis/launchpad/publicGovSale.json';
import { ethers, utils } from "ethers";

/**
 * get native token balance
 * @param address 
 * @param provider 
 */
export const getETHBalance = async (address: string, chainId: number, provider?: any) => {
    try {
        if (!provider) {
            const _chain = chains[chainId];
            // web3 provider
            provider = new ethers.providers.JsonRpcProvider(_chain.rpc);
        }
        const _balance = await provider.getBalance(address);
        return Number(ethers.utils.formatEther(_balance));
    } catch (err) {
        return 0;
    }
}
/**
 * get KOM token balance
 * @param chainId 
 * @param address 
 * @param provider 
 */
export const getKOMBalance = async (chainId: number, address: string, provider?: any) => {
    try {
        if (!provider) {
            const _chain = chains[chainId];
            // web3 provider
            provider = new ethers.providers.JsonRpcProvider(_chain.rpc);
        }
        const { address: CONTRACT_ADDRESS, abi } = CONTRACTS[chainId].KOM;
        const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, provider);
        const _balance = await contract.balanceOf(address);
        return Number(ethers.utils.formatUnits(_balance, 8));
    } catch (err) {
        return 0.0;
    }
}
/**
 * get KOMV token balance
 * @param chainId 
 * @param address 
 * @param provider 
 */
export const getKOMVBalance = async (chainId: number, address: string, provider?: any) => {
    try {
        if (!provider) {
            const _chain = chains[chainId];
            // web3 provider
            provider = new ethers.providers.JsonRpcProvider(_chain.rpc);
        }
        const { address: CONTRACT_ADDRESS, abi } = CONTRACTS[chainId].KOMV;
        const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, provider);
        const _balance = await contract.balanceOf(address);
        return Number(ethers.utils.formatUnits(_balance, 0));
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
            getETHBalance(address, chainId, provider),
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

        const _amount = await _contractStaking.getUserStakedTokens(address);
        return Number(ethers.utils.formatUnits(_amount, 8));
    } catch (err) {
        return 0.0;
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

        const _amount = await _contractStaking.getUserStakedTokens(address);
        return Number(ethers.utils.formatUnits(_amount, 8));
    } catch (err) {
        return 0;
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
    ] = await _contractStaking.getStakedDetail(address, index);
    return {
        lockPeriodInDays: Number(lockPeriodInDays),
        compoundType: Number(compoundType),
        amount: Number(ethers.utils.formatUnits(amount, 8)),
        reward: Number(ethers.utils.formatUnits(reward, 8)),
        prematurePenalty: Number(ethers.utils.formatUnits(prematurePenalty, 8)),
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
            _contractStaking.userStakedLength(address),
            _contractStaking.stakerDetail(address)
        ]);
        const _stakedDetails: STAKEV3_DETAIL_ITEM[] = await Promise.all(Array.from({ length: _userStakedLength }, (_, index) => index).map((idx: number) => getStakingV3Detail(chainId, address, idx, provider)));

        return {
            stakedAmount: Number(ethers.utils.formatUnits(stakedAmount, 8)),
            stakerPendingReward: Number(ethers.utils.formatUnits(stakerPendingReward, 8)),
            stakedDetails: _stakedDetails
        }
    } catch (err) {
        return {
            stakedAmount: 0.0,
            stakerPendingReward: 0.0,
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
            _contractStaking.userStakedLength(address),
            getKOMTokenPrice()
        ]);

        return {
            stakedAmount: Number(ethers.utils.formatUnits(stakedAmount, 8)),
            stakerPendingReward: Number(ethers.utils.formatUnits(stakerPendingReward, 8)),
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
        const _balance = await _contract.balanceOf(address);
        return Number(ethers.utils.formatEther(_balance));
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
        const { amount, claimableEpoch, index } = await _contract.stakes(address);
        return {
            amount: Number(ethers.utils.formatEther(amount)),
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
/**
 * 
 * @param _project 
 */
export const getProjectProgress = async (_project: string, _decimal: number) => {
    const _chain = chains[137];
    // web3 provider
    const provider = new ethers.providers.JsonRpcProvider(_chain.rpc);
    // contract
    const _contract = new ethers.Contract(_project, PublicGovSaleABI, provider);
    let price = 1;
    try {
        const _price = await _contract.price();
        price = Number(ethers.utils.formatUnits(_price, 6));
    } catch (err) {}
    try {
        const [
            sale, sold
        ] = await Promise.all([
            await _contract.sale(),
            await _contract.sold()
        ]);
        return {
            price: price,
            sale: Number(ethers.utils.formatUnits(sale, _decimal)),
            sold: Number(ethers.utils.formatUnits(sold, _decimal)),
        }
    } catch {
        return {
            price: price,
            sale: 0,
            sold: 0,
        }
    }
}
/**
 * 
 * @param _index 
 * @param _decimal 
 * @param address 
 * @param _contract 
 * @param _name 
 * @returns 
 */
export const getRoundDetail = async (_index: number, _decimal: number, address: string, _contract: ethers.Contract, _name: string): Promise<ROUND_DETAIL> => {
    try {
        const [
            { start, end, fee_d2, tokenAchieved },
            userAllocation,
            purchasedPerRound
        ] = await Promise.all([
            _contract.booster(_index),
            _contract.calcUserAllocation(address, _index),
            _contract.purchasedPerRound(address, _index)
        ]);
        let min = 0;
        let max = userAllocation;
        if (_index === 3) {
            const [_min, _max] = await Promise.all([_contract.minFCFSBuy(), _contract.maxFCFSBuy()]);
            min = _min;
            max = _max;
        } else if (_index === 4) {
            const [_min, _max] = await Promise.all([_contract.minComBuy(), _contract.maxComBuy()]);
            min = _min;
            max = _max;
        }
        return {
            name: _name,
            start: Number(start),
            end: Number(end),
            fee_d2: Number(fee_d2),
            tokenAchieved: Number(ethers.utils.formatUnits(tokenAchieved, _decimal)),
            userAllocation: Number(ethers.utils.formatUnits(userAllocation, _decimal)),
            purchasedPerRound: Number(ethers.utils.formatUnits(purchasedPerRound, _decimal)),
            min: Number(ethers.utils.formatUnits(min, _decimal)),
            max: Number(ethers.utils.formatUnits(max, _decimal))
        }
    } catch (err) {
        return {
            name: _name,
            start: 0,
            end: 0,
            fee_d2: 0,
            tokenAchieved: 0,
            userAllocation: 0,
            purchasedPerRound: 0,
            min: 0,
            max: 0
        }
    }
}

/**
 * calculate users total purchased amount
 * @param _project 
 * @param _user 
 * @param _deciaml 
 * @returns 
 */
export const getUserTotalPurchase = async (_project: string, _user: string, _deciaml: number) => {
    try {
        const _chain = chains[137];
        const provider = new ethers.providers.JsonRpcProvider(_chain.rpc);
        const _contract = new ethers.Contract(_project, PublicGovSaleABI, provider);
        const _amount = await _contract.totalChainUserPurchased(_user);
        return Number(ethers.utils.formatUnits(_amount, _deciaml));
    } catch (err) {
        console.log(err)
        return 0;
    }
}
/**
 * get project's round details
 * @param project 
 * @param decimal 
 * @param address 
 * @returns 
 */
export const getRoundDetails = async (project: string, decimal: number, address: string, cross: boolean = true) => {
    try {
        if (!project) throw '';
        if (!cross) throw '';
        
        const _chain = chains['matic'];
        const _rounds = ['🚀 Booster 1', '🚀🚀 Booster 2', '🚀🚀🚀 FCFS Round', '🚀🚀🚀🚀 Community Round'];
        // web3 provider
        const provider = new ethers.providers.JsonRpcProvider(_chain.rpc);
        // contract
        const _contract = new ethers.Contract(project, PublicGovSaleABI, provider);
        // fetch info
        const [
            _price,
            _boosterProgress,
            _roundsDetails,
            _whitelist,
            _userPurchased
        ] = await Promise.all([
            _contract.price(),
            _contract.boosterProgress(),
            Promise.all(_rounds.map((_name: string, _index: number) => getRoundDetail(_index + 1, decimal, address, _contract, _name))),
            _contract.whitelist(address),
            _contract.totalChainUserPurchased(address)
        ]);
        return {
            price: _price,
            boosterProgress: Number(_boosterProgress),
            roundsDetails: _roundsDetails,
            whitelist: Number(ethers.utils.formatUnits(_whitelist, decimal)),
            userPurchased: Number(ethers.utils.formatUnits(_userPurchased, decimal)),
        }
    } catch (err) {
        return {
            price: 0,
            boosterProgress: 0,
            roundsDetails: [],
            whitelist: 0,
            userPurchased: 0
        }
    }
}
/**
 * get USDT balance using chain and user
 * @param address 
 * @param chainId 
 * @param provider 
 * @returns 
 */
export const getUSDTBalance = async (address: string, chainId: number) => {
    try {
        const _chain = chains[chainId];
        // web3 provider
        const provider = new ethers.providers.JsonRpcProvider(_chain.rpc);
        const { address: CONTRACT_ADDRESS, abi, decimal } = USDTS[chainId];
        const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, provider);
        const _balance = await contract.balanceOf(address);
        return Number(ethers.utils.formatUnits(_balance, decimal));
    } catch (err) {
        console.log(err)
        return 0.0;
    }
}
/**
 * get ETH and USDT balances
 * @param address 
 * @returns 
 */
export const getEthAndUsdtBalances = async (address: string): Promise<CHAIN_BALANCE[]> => {
    try {
        const _data = await Promise.all([137, 42161, 56].map(async (_chainId: number) => ({
            chain: chains[_chainId].name,
            ticker: chains[_chainId].symbol,
            usdt: await getUSDTBalance(address, _chainId),
            eth: await getETHBalance(address, _chainId)
        })));
        return _data;
    } catch (err) {
        return [137, 42161, 56].map((_chainId: number) => ({
            chain: chains[_chainId].name,
            ticker: chains[_chainId].symbol,
            usdt: 0,
            eth: 0
        }))
    }
}
/**
 * get ETH and USDT balances
 * @param address 
 * @returns 
 */
export const getTotalKOMStaked = async (_project: string, _address: string): Promise<number> => {
    try {
        const _chain = chains[137];
        const provider = new ethers.providers.JsonRpcProvider(_chain.rpc);
        const _contract = new ethers.Contract(_project, PublicGovSaleABI, provider);
        const _amount = await _contract.candidateTotalStaked(_address);
        return Number(ethers.utils.formatUnits(_amount, 8));
    } catch (err) {
        return 0;
    }
}