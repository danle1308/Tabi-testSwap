import { ChainId } from '@tabi-dex/sdk'
import { CHAIN_ID } from 'config/constants/networks'

const chainId = parseInt(CHAIN_ID, 10) as ChainId

const getTokenLogoURL = (address: string) => {
  return `/images/tokens/${address}.png`
}

export default getTokenLogoURL

// `https://github.com/TunaWho/token-asset/blob/master/blockchains/bera/assets/${address.toLowerCase()}/logo.png?raw=true`
