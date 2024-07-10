export type CHAIN = {
    name: string,
    symbol: string,
    ticker: string,
    rpc: string,
    chainId: number,
    explorer: string,
    logo: string,
}

export type ACCOUNT = {
    address: string,
    name: string
}

export type CONTRACT = {
    KOM: {
        address: string,
        abi: any
    },
    KOMV: {
        address: string,
        abi: any
    },
    LP: {
        address: string,
        abi: any
    },
    STAKING_V1: {
        address: string,
        abi: any
    },
    STAKING_V2: {
        address: string,
        abi: any
    },
    STAKING_V3: {
        address: string,
        abi: any
    },
    STAKING_LP: {
        address: string,
        abi: any
    },
}

export type CHAIN_BALANCE = {
    chain: string,
    ticker: string,
    usdt: number,
    eth: number,
}