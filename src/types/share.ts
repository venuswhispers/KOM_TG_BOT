export type CHART_DATA_ITEM = {
    period: string,
    amount: string
}

export type STAKEV3_DETAIL_ITEM = {
    lockPeriodInDays: number,
    compoundType: number,
    amount: number,
    reward: number,
    prematurePenalty: number,
    stakedAt: number,
    endedAt: number
}

export type STAKEV3_PAST_DETAIL_ITEM = {
    tx_hash: string,
    ev_data: {
        stakerAddress: string,
        lockPeriodInDays: number,
        compoundType: number,
        amount: number,
        reward: number,
        prematurePenalty: number,
        stakedAt: number,
        endedAt: number,
        unstakedAt: number,
        isPremature: boolean
    }
}

export type WALLET = {
    name: string,
    address: string,
    privateKey: string,
    mnemonic: string
}