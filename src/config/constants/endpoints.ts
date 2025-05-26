import { ChainId } from '@tabi-dex/sdk'
import { CHAIN_ID } from './networks'

const chainId = parseInt(CHAIN_ID, 10)

export const GRAPH_API_PROFILE = process.env.NEXT_PUBLIC_GRAPH_API_PROFILE
export const GRAPH_API_PREDICTION = process.env.NEXT_PUBLIC_GRAPH_API_PREDICTION
export const SNAPSHOT_BASE_URL = process.env.NEXT_PUBLIC_SNAPSHOT_BASE_URL
export const API_PROFILE = process.env.NEXT_PUBLIC_API_PROFILE
export const API_NFT = process.env.NEXT_PUBLIC_API_NFT
export const SNAPSHOT_API = `${SNAPSHOT_BASE_URL}/graphql`
export const SNAPSHOT_HUB_API = `${SNAPSHOT_BASE_URL}/api/message`

/**
 * V1 will be deprecated but is still used to claim old rounds
 */
export const GRAPH_API_PREDICTION_V1 = ''

export const INFO_CLIENT = {
  [ChainId.TESTNET]: '',
  [ChainId.MAINNET]: '',
}[chainId]

export const BLOCKS_CLIENT = {
  [ChainId.TESTNET]: '',
  [ChainId.MAINNET]: '',
}[chainId]

export const GRAPH_API_LOTTERY = {
  [ChainId.TESTNET]: '',
  [ChainId.MAINNET]: '',
}[chainId]

export const GRAPH_API_NFTMARKET = process.env.NEXT_PUBLIC_GRAPH_API_NFT_MARKET
export const GRAPH_HEALTH = ''

export const TC_MOBOX_SUBGRAPH = ''
export const TC_MOD_SUBGRAPH = ''

export const GALAXY_NFT_CLAIMING_API = ''
