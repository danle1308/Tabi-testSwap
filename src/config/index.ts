import { ChainId } from '@tabi-dex/sdk'
import BigNumber from 'bignumber.js/bignumber'
import { BIG_TEN } from 'utils/bigNumber'

BigNumber.config({
  EXPONENTIAL_AT: 1000,
  DECIMAL_PLACES: 80,
})

export const VELAS_BLOCK_TIME = 0.4

export const BASE_VELAS_SCAN_URLS = {
  [ChainId.MAINNET]: '',
  [ChainId.TESTNET]: 'https://testnetv2.tabiscan.com',
}

// VEN_PER_SECOND details
// 40 VEN is minted per block
// 20 VEN per block is sent to Burn pool (A farm just for burning cake)
// 10 VEN per block goes to VEN syrup pool
// 9 VEN per block goes to Yield farms and lottery
// VEN_PER_SECOND in config/index.ts = 40 as we only change the amount sent to the burn pool which is effectively a farm.
// VEN/Block in src/views/Home/components/CakeDataRow.tsx = 15 (40 - Amount sent to burn pool)
export const VEN_PER_SECOND = 0.01157407407
// export const VEN_PER_BLOCK = VEN_PER_SECOND * VELAS_BLOCK_TIME
export const BLOCKS_PER_YEAR = 60 * 60 * 24 * 365
// export const BLOCKS_PER_YEAR = (60 / VELAS_BLOCK_TIME) * 60 * 24 * 365 // 10512000
export const VEN_PER_YEAR = VEN_PER_SECOND * BLOCKS_PER_YEAR
export const BASE_URL = `https://TabiSwap.org`
export const BASE_ADD_LIQUIDITY_URL = `${BASE_URL}/add`
export const BASE_VELAS_SCAN_URL = BASE_VELAS_SCAN_URLS[ChainId.TESTNET]
export const DEFAULT_TOKEN_DECIMAL = BIG_TEN.pow(18)
export const DEFAULT_GAS_LIMIT = 60000
export const AUCTION_BIDDERS_TO_FETCH = 500
export const RECLAIM_AUCTIONS_TO_FETCH = 500
export const AUCTION_WHITELISTED_BIDDERS_TO_FETCH = 500
export const IPFS_GATEWAY = 'https://ipfs.io/ipfs'
