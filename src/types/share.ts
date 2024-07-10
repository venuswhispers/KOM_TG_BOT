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
    secure?: boolean,
    exclusive?: boolean,
    priority?: boolean,
    nonRefundable?: boolean,
    voting: boolean,
    timer: number,
    end: number,
    calculation_time: string,
    preparation_time: string,
    price: number,
    sale_card: string,
    desc: string,
    supply: string,
    distribution: string,
    target: {
        total: number
    },
    social: { icon: string, link: string }[],
    marketcap: string,
    token?: string,
    tokenDecimal: number,
    project: string,
    governance: string,
    crosschain: CROSS_CHAIN,
    promo: {
        research: string,
        whitelist: string,
        airdrop: string,
        vsb: string,
        l2e: string,
    },
    sale?: number,
    sold?: number,
    buffer?: Buffer,
    progress: {
        sale: number,
        sold: number,
        price: number
    }
}

export type ROUND_DETAIL = {
    name: string,
    start: number,
    end: number,
    fee_d2: number,
    tokenAchieved: number,
    userAllocation: number,
    purchasedPerRound: number,
    min: number,
    max: number
}

export type CROSS_CHAIN = {
    matic: string,
    bsc: string,
    arb: string,
}

export type CLAIM_PROJECT = {
    start: number,
    image: string,
    name: string,
    ticker: string,
    vesting: string,
    listing: string,
    refund: string,
    secure?: boolean,
    priority?: boolean,
    exclusive?: boolean,
    nonRefundable?: boolean,
    token?: string,
    round: string,
    price?: string,
    roundLabel: string,
    type: {
        icon: string,
        label: string,
    },
    vesting_card: string,
    trade?: {
        name: string,
        link: string,
    },
    claim: {
        version: number,
        finished?: boolean,
        refund?: string,
        refunded?: boolean,
        address?: string,
        chain?: number,
        msg?: string
    }
}