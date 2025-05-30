import { ChainId, JSBI, Percent, Token } from '@tabi-dex/sdk'
import { BigNumber } from '@ethersproject/bignumber'
import { mainnetTokens, testnetTokens } from './tokens'
import addresses from './addresses.json'
import { CHAIN_ID } from './networks'

export const ROUTER_ADDRESS = {
  [ChainId.MAINNET]: addresses[ChainId.MAINNET].SwapRouter,
  [ChainId.TESTNET]: addresses[ChainId.TESTNET].SwapRouter,
}

export const PRESALE_ADDRESS = {
  [ChainId.MAINNET]: addresses[ChainId.MAINNET].Presale,
  [ChainId.TESTNET]: addresses[ChainId.TESTNET].Presale,
}

// a list of tokens by chain
type ChainTokenList = {
  readonly [chainId in ChainId]: Token[]
}

// used to construct intermediary pairs for trading
export const BASES_TO_CHECK_TRADES_AGAINST: ChainTokenList = {
  [ChainId.MAINNET]: [
    // mainnetTokens.wvlx,
    mainnetTokens.cake,
    // mainnetTokens.busd,
    // mainnetTokens.usdt,
    // mainnetTokens.wbtc,
    mainnetTokens.weth,
    mainnetTokens.usdc,
    // mainnetTokens.zkfair,
    // mainnetTokens.usdv,
    // mainnetTokens.dai,
  ],
  [ChainId.TESTNET]: [testnetTokens.weth, testnetTokens.cake, testnetTokens.usdc],
}

/**
 * Addittional bases for specific tokens
 * @example { [WBTC.address]: [renBTC], [renBTC.address]: [WBTC] }
 */
export const ADDITIONAL_BASES: { [chainId in ChainId]?: { [tokenAddress: string]: Token[] } } = {
  [ChainId.MAINNET]: {},
}

/**
 * Some tokens can only be swapped via certain pairs, so we override the list of bases that are considered for these
 * tokens.
 * @example [AMPL.address]: [DAI, WETH[ChainId.MAINNET]]
 */
export const CUSTOM_BASES: { [chainId in ChainId]?: { [tokenAddress: string]: Token[] } } = {
  [ChainId.MAINNET]: {},
}

// used for display in the default list when adding liquidity
export const SUGGESTED_BASES: ChainTokenList = {
  [ChainId.MAINNET]: [
    // mainnetTokens.weth, mainnetTokens.cake,
  ],
  [ChainId.TESTNET]: [
    // testnetTokens.weth, testnetTokens.cake
  ],
}

// used to construct the list of all pairs we consider by default in the frontend
export const BASES_TO_TRACK_LIQUIDITY_FOR: ChainTokenList = {
  [ChainId.MAINNET]: [mainnetTokens.weth, mainnetTokens.cake, mainnetTokens.usdc],
  [ChainId.TESTNET]: [testnetTokens.weth, testnetTokens.cake, testnetTokens.usdc],
}

export const PINNED_PAIRS: { readonly [chainId in ChainId]?: [Token, Token][] } = {
  [ChainId.MAINNET]: [
    [mainnetTokens.cake, mainnetTokens.weth],
    // [mainnetTokens.busd, mainnetTokens.usdt],
    // [mainnetTokens.dai, mainnetTokens.usdt],
  ],
  [ChainId.TESTNET]: [
    [testnetTokens.cake, testnetTokens.weth],
    // [mainnetTokens.busd, mainnetTokens.usdt],
    // [mainnetTokens.dai, mainnetTokens.usdt],
  ],
}

export const NetworkContextName = 'NETWORK'

// default allowed slippage, in bips
export const INITIAL_ALLOWED_SLIPPAGE = 50
// 20 minutes, denominated in seconds
export const DEFAULT_DEADLINE_FROM_NOW = 60 * 20

export const BIG_INT_ZERO = JSBI.BigInt(0)

// one basis point
export const ONE_BIPS = new Percent(JSBI.BigInt(1), JSBI.BigInt(10000))
export const BIPS_BASE = JSBI.BigInt(10000)
// used for warning states
export const ALLOWED_PRICE_IMPACT_LOW: Percent = new Percent(JSBI.BigInt(100), BIPS_BASE) // 1%
export const ALLOWED_PRICE_IMPACT_MEDIUM: Percent = new Percent(JSBI.BigInt(300), BIPS_BASE) // 3%
export const ALLOWED_PRICE_IMPACT_HIGH: Percent = new Percent(JSBI.BigInt(500), BIPS_BASE) // 5%
// if the price slippage exceeds this number, force the user to type 'confirm' to execute
export const PRICE_IMPACT_WITHOUT_FEE_CONFIRM_MIN: Percent = new Percent(JSBI.BigInt(1000), BIPS_BASE) // 10%
// for non expert mode disable swaps above this
export const BLOCKED_PRICE_IMPACT_NON_EXPERT: Percent = new Percent(JSBI.BigInt(1500), BIPS_BASE) // 15%

// used to ensure the user doesn't send so much VLX so they end up with <.000001
export const MIN_BNB: JSBI = JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(12)) // .000001
export const BETTER_TRADE_LESS_HOPS_THRESHOLD = new Percent(JSBI.BigInt(50), JSBI.BigInt(10000))

export const ZERO_PERCENT = new Percent('0')
export const ONE_HUNDRED_PERCENT = new Percent('1')

// SDN OFAC addresses
export const BLOCKED_ADDRESSES: string[] = [
  '0x7F367cC41522cE07553e823bf3be79A889DEbe1B',
  '0xd882cFc20F52f2599D84b8e8D58C7FB62cfE344b',
  '0x901bb9583b24D97e995513C6778dc6888AB6870e',
  '0xA7e5d5A720f06526557c513402f2e6B5fA20b008',
  '0x8576aCC5C05D6Ce88f4e49bf65BdF0C62F91353C',
]

export { default as farmsConfig } from './farms'
export { default as poolsConfig } from './pools'
export { default as ifosConfig } from './ifo'

export const FAST_INTERVAL = 10000
export const SLOW_INTERVAL = 60000

export const NOT_ON_SALE_SELLER = '0x0000000000000000000000000000000000000000'

// ETH
export const DEFAULT_INPUT_CURRENCY = 'ETH'
//
export const DEFAULT_OUTPUT_CURRENCY = addresses[parseInt(CHAIN_ID, 10) as ChainId].PlatformToken

export const FARM_AUCTION_HOSTING_IN_SECONDS = 604800

// Gelato uses this address to define a native currency in all chains
export const GELATO_NATIVE = '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'
// Handler string is passed to Gelato to use PCS router
export const GELATO_HANDLER = 'pancakeswap'
export const GENERIC_GAS_LIMIT_ORDER_EXECUTION = BigNumber.from(500000)

export const EXCHANGE_DOCS_URLS = ''
export const LIMIT_ORDERS_DOCS_URL = ''

export const GALAXY_NFT_CAMPAIGN_ID = 'GCpp2UUxqQ'
