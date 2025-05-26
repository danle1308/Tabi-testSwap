import { ChainId, Token } from '@tabi-dex/sdk'
import { serializeToken } from 'state/user/hooks/helpers'
import { CHAIN_ID } from './networks'
import { SerializedToken } from './types'
import addresses from './addresses.json'

const { MAINNET, TESTNET } = ChainId

interface TokenList {
  [symbol: string]: Token
}

const defineTokens = <T extends TokenList>(t: T) => t

export const mainnetTokens = {
  cake: new Token(MAINNET, addresses[MAINNET].PlatformToken, 18, 'TABI', 'TabiSwap', 'https://'),
  weth: new Token(MAINNET, addresses[MAINNET].WETH, 18, 'WETH', 'Wrapper ETH', 'https://'),
  busd: new Token(MAINNET, '0x95512957E31cCE312ac2e6407e562228d3BC331b', 18, 'BUSD', 'BUSD', 'https://'),
  usdc: new Token(MAINNET, '0x174c4c03dfea09682728a5959a253bf1f7c7766f', 18, 'USDC', 'USD coin', 'https://'),
}

export const testnetTokens = {
  eth: new Token(TESTNET, addresses[TESTNET].WETH, 18, 'MON', 'MON', ''),
  cake: new Token(TESTNET, addresses[TESTNET].PlatformToken, 18, 'TBS', 'TabiSwap', 'https://testnetv2.tabiscan.com'),
  weth: new Token(TESTNET, addresses[TESTNET].WETH, 18, 'WTABI', 'Wrapped Tabi', 'https://testnetv2.tabiscan.com'),
  // cake: new Token(
  //   MAINNET,
  //   '0x010b39387fBd4C11bEE21AB6ca220F15f955E620',
  //   18,
  //   'TBS',
  //   'TabiSwap',
  //   'https://testnetv2.tabiscan.com',
  // ),
  // weth: new Token(
  //   MAINNET,
  //   '0xCde9c6ad3f82f322AC86DC63eFF63bC405072F95',
  //   18,
  //   'WTABI',
  //   'Wrapped Tabi',
  //   'https://testnetv2.tabiscan.com',
  // ),
  busd: new Token(TESTNET, '0x95512957E31cCE312ac2e6407e562228d3BC331b', 18, 'BUSD', 'BUSD', ''),
  usdc: new Token(TESTNET, '0xcDc10593a66185AAa206665C5083ac51Ad935F91', 18, 'USDC', 'USD coin', ''),
  usdt: new Token(TESTNET, '0x2CcaD515c13Df2178f6960304aE0Dbe0428E8d28', 18, 'USDT', 'Tether USD', ''),
  weth1: new Token(TESTNET, '0xB5a30b0FDc5EA94A52fDc42e3E9760Cb8449Fb37', 18, 'WETH', 'Wrapped ETH', ''),
  wbtc: new Token(TESTNET, '0xcf5a6076cfa32686c0Df13aBaDa2b40dec133F1d', 8, 'WBTC', 'Wrapped BTC', ''),
  wsol: new Token(TESTNET, '0x5387C85A4965769f6B0Df430638a1388493486F1', 9, 'WSOL', 'Wrapped SOL', ''),
  shmon: new Token(TESTNET, '0x3a98250F98Dd388C211206983453837C8365BDc1', 18, 'shMON', 'ShMonad', ''),
}

const tokens = () => {
  const chainId = CHAIN_ID

  // If testnet - return list comprised of testnetTokens wherever they exist, and mainnetTokens where they don't
  if (parseInt(chainId, 10) === ChainId.TESTNET) {
    return Object.keys(testnetTokens).reduce((accum, key) => {
      return { ...accum, [key]: testnetTokens[key] }
    }, {} as typeof testnetTokens)
    // return Object.keys(mainnetTokens).reduce((accum, key) => {
    //   return { ...accum, [key]: testnetTokens[key] || mainnetTokens[key] }
    // }, {} as typeof testnetTokens & typeof mainnetTokens)
  }

  return mainnetTokens
}

const unserializedTokens = tokens()

type SerializedTokenList = Record<keyof typeof unserializedTokens, SerializedToken>

export const serializeTokens = () => {
  const serializedTokens = Object.keys(unserializedTokens).reduce((accum, key) => {
    return { ...accum, [key]: serializeToken(unserializedTokens[key]) }
  }, {} as SerializedTokenList)

  return serializedTokens as any
}

export default unserializedTokens
