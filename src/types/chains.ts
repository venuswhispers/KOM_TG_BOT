export type CHAIN = {
    name: string,
    symbol: string,
    rpc: string,
    chainId: number,
    explorer: string
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
    STAKING_V3: {
        address: string,
        abi: any
    },
    STAKING_LP: {
        address: string,
        abi: any
    },
}