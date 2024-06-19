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

export interface IProject {
    start: number,
    image: string,
    name: string,
    ticker: string,
    vesting: string,
    listing: string,
    refund: string,
    round: string,
    roundLabel: string,
    type: {
        icon: string,
        label: string,
    },
    secure: boolean,
    voting: boolean,
    timer: number,
    end: number,
    calculation_time: string,
    preparation_time: string,
    price: string,
    sale_card: string,
    desc: string,
    supply: string,
    distribution: string,
    target: {
        total: number
    },
    social: { icon: string, link: string }[],
    marketcap: string,
    tokenDecimal: number,
    project: string,
    governance: string,
    crosschain: {
        matic: string,
        bsc: string,
        arb: string,
    },
    promo: {
        research: string,
        whitelist: string,
        airdrop: string,
        vsb: string,
        l2e: string,
    }
}