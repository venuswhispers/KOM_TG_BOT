import { CHAIN, CONTRACT } from "@/types";
import KOM_ABI from './abis/tokens/KOM.json';
import KOMV_ABI from './abis/tokens/KOMV.json';
import LP_ABI from './abis/tokens/LP.json';
import STAKING_V1_ABI from './abis/staking/STAKING_V1.json';
import STAKING_V2_ABI from './abis/staking/STAKING_V2.json';
import STAKING_V3_ABI from './abis/staking/STAKING_V3.json';
import STAKING_LP_ABI from './abis/staking/STAKING_LP.json';
import USDT_ABI from './abis/tokens/USDT.json';
// claims
import CLAIM_V1_D0_ABI from '@/constants/abis/vesting/v1_d0.json';
import CLAIM_V1_D2_ABI from '@/constants/abis/vesting/v1_d2.json';
import CLAIM_FIXED_ABI from '@/constants/abis/vesting/fixed.json';
import CLAIM_TGE_LINEAR_ABI from '@/constants/abis/vesting/linear.json';
import CLAIM_V2_FIXED_ABI from '@/constants/abis/vesting/fixed_v2.json';
import CLAIM_V2_LINEAR_ABI from '@/constants/abis/vesting/linear_v2.json';
import CLAIM_V3_FIXED_ABI from '@/constants/abis/vesting/fixed_exclusive.json';
import CLAIM_V3_LINEAR_ABI from '@/constants/abis/vesting/linear_exclusive.json';



export const otherChains: Record<number, string> = {
    137: 'Arbitrum or BSC',
    42161: 'Polygon or BSC',
    56: 'Polygon or Arbitrum'
}

export const chains: Record<number, CHAIN> = {
    137: {
        name: "POLYGON",
        symbol: "MATIC",
        ticker: "MATIC",
        rpc: "https://polygon-rpc.com",
        chainId: 137,
        explorer: 'https://polygonscan.com/',
        logo: "/chains/matic.svg"
    },
    42161: {
        name: "ARBITRUM",
        symbol: "ETH",
        ticker: "ETH",
        rpc: 'https://arb1.arbitrum.io/rpc',
        chainId: 42161,
        explorer: 'https://arbiscan.io/',
        logo: "/chains/arb.svg"
    },
    56: {
        name: "BSC",
        symbol: "BNB",
        ticker: "BNB",
        rpc: "https://bsc-dataseed1.ninicoin.io/",
        chainId: 56,
        explorer: 'https://bscscan.com/',
        logo: "/chains/bsc.svg"
    },
    651940: {
        name: "ALL",
        symbol: "ALL",
        ticker: "ALL",
        rpc: "https://mainnet-rpc.alltra.global",
        chainId: 651940,
        explorer: 'https://alltra.global',
        logo: "/chains/all.svg"
    },
    43114: {
        name: "Avalanche",
        symbol: "AVAX",
        ticker: "AVAX",
        rpc: "https://api.avax.network/ext/bc/C/rpc",
        chainId: 43114 ,
        explorer: 'https://snowtrace.io',
        logo: "/chains/avax.svg"
    },
    8453: {
        name: "BASE",
        symbol: "ETH",
        ticker: "ETH",
        rpc: "https://mainnet.base.org",
        chainId: 8453 ,
        explorer: 'https://snowtrace.io',
        logo: "/chains/base.svg"
    },
    5439: {
        name: "Egochain",
        symbol: "EGAX",
        ticker: "EGAX",
        rpc: "https://mainnet.egochain.org",
        chainId: 5439 ,
        explorer: 'https://egoscan.io',
        logo: "/chains/egax.svg"
    },
    1: {
        name: "Ethereum",
        symbol: "ETH",
        ticker: "ETH",
        rpc: "https://rpc.flashbots.net",
        chainId: 1,
        explorer: 'https://etherscan.io',
        logo: "/chains/eth.svg"
    },
    13371: {
        name: "Immutable zkEVM",
        symbol: "IMX",
        ticker: "IMX",
        rpc: "https://rpc.immutable.com",
        chainId: 13371,
        explorer: 'https://explorer.immutable.com',
        logo: "/chains/imx.svg"
    },
    10: {
        name: "Optimism",
        symbol: "ETH",
        ticker: "ETH",
        rpc: "https://optimism.llamarpc.com",
        chainId: 10,
        explorer: 'https://optimistic.etherscan.io',
        logo: "/chains/op.svg"
    },
    324: {
        name: "zkSync",
        symbol: "ETH",
        ticker: "ETH",
        rpc: "https://zksync-era.blockpi.network/v1/rpc/public",
        chainId: 324,
        explorer: 'https://explorer.zksync.io',
        logo: "/chains/zks.svg"
    },
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
        STAKING_V1: {
            address: '0x453D0a593D0af91e77e590a7935894f7AB1b87ec',
            abi: STAKING_V1_ABI
        },
        STAKING_V2: {
            address: '0x8d37b12DB32E07d6ddF10979c7e3cDECCac3dC13',
            abi: STAKING_V2_ABI
        },
        STAKING_V3: {
            address: '0x8d34Bb43429c124E55ef52b5B1539bfd121B0C8D',
            abi: STAKING_V3_ABI
        },
        STAKING_LP: {
            address: '0xdf81D4ddAF2a728226f6f5e39a61BFc5236203C0',
            abi: STAKING_LP_ABI
        }
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
        STAKING_V1: {
            address: '',
            abi: STAKING_V3_ABI
        },
        STAKING_V2: {
            address: '',
            abi: STAKING_V2_ABI
        },
        STAKING_V3: {
            address: '0x5b63bdb6051CcB9c387252D8bd2364D7A86eFC70',
            abi: STAKING_V3_ABI
        },
        STAKING_LP: {
            address: '',
            abi: STAKING_LP_ABI
        },
    },
}

export const USDTS: Record<number, any> = {
    137: {
        address: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F',
        abi: USDT_ABI,
        decimal: 6
    },
    42161: {
        address: '0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9',
        abi: USDT_ABI,
        decimal: 6
    },
    56: {
        address: '0x55d398326f99059fF775485246999027B3197955',
        abi: USDT_ABI,
        decimal: 18
    },

}

export const CLAIM_ABIs = {
    "v0_d0": CLAIM_V1_D0_ABI,
    "v0_d2": CLAIM_V1_D2_ABI,
    "v1_fixed": CLAIM_FIXED_ABI,
    "v1_tge_linear": CLAIM_TGE_LINEAR_ABI,
    "v2_fixed": CLAIM_V2_FIXED_ABI,
    "v2_linear": CLAIM_V2_LINEAR_ABI,
    "v3_fixed": CLAIM_V3_FIXED_ABI,
    "v3_linear": CLAIM_V3_LINEAR_ABI,
}




