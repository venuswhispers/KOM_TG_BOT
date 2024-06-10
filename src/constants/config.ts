import { CHAIN, CONTRACT } from "../types";
import KOM_ABI from './abis/KOM.json';
import KOMV_ABI from './abis/KOMV.json';
import LP_ABI from './abis/LP.json';
import STAKING_V3 from './abis/STAKING_V3.json';
import STAKING_LP from './abis/STAKING_LP.json';

export const chains: Record<number, CHAIN> = {
    137: {
        name: "POLYGON",
        symbol: "MATIC",
        // rpc: "https://polygon-mainnet.infura.io/v3/2e58a899d3c64eccb6955c2f33fc8a88",
        rpc: "https://polygon-rpc.com",
        chainId: 137,
        explorer: 'https://polygonscan.com/'
    },
    42161: {
        name: "ARBITRUM",
        symbol: "ETH",
        rpc: 'https://arb1.arbitrum.io/rpc',
        chainId: 42161,
        explorer: 'https://arbiscan.io/'
    }
}

export const CONTRACTS: Record<number, CONTRACT> = {
    137: {
        KOM: {
            address: '0xC004e2318722EA2b15499D6375905d75Ee5390B8',
            abi: KOM_ABI
        },
        KOMV: {
            address: '0xE1bB02b367173ac31077a8c443802f75CC9aCCb6',
            abi: KOMV_ABI
        },
        LP: {
            address: '0xe0a1fD98E9d151BABce27FA169Ae5D0fF180F1a4',
            abi: LP_ABI
        },
        STAKING_V3: {
            address: '0x8d34Bb43429c124E55ef52b5B1539bfd121B0C8D',
            abi: STAKING_V3
        },
        STAKING_LP: {
            address: '0xdf81D4ddAF2a728226f6f5e39a61BFc5236203C0',
            abi: STAKING_LP
        },
    },
    42161: {
        KOM: {
            address: '0xA58663FAEF461761e44066ea26c1FCddF2927B80',
            abi: KOM_ABI
        },
        KOMV: {
            address: '0xd0F7eC675F7D29BCf58FB1ea793CbA42644d05C4',
            abi: KOMV_ABI
        },
        LP: {
            address: '',
            abi: LP_ABI
        },
        STAKING_V3: {
            address: '0x5b63bdb6051CcB9c387252D8bd2364D7A86eFC70',
            abi: STAKING_V3
        },
        STAKING_LP: {
            address: '',
            abi: STAKING_LP
        },
    },
}