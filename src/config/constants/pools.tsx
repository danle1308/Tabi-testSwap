import { BigNumber } from '@ethersproject/bignumber'
import Trans from 'components/Trans'
import { VaultKey } from 'state/types'
import { ChainId } from '@tabi-dex/sdk'
import { CHAIN_ID } from './networks'
import { serializeTokens } from './tokens'
import { SerializedPoolConfig, PoolCategory } from './types'

const chainId = parseInt(CHAIN_ID, 10)
const { MAINNET } = ChainId

const serializedTokens = serializeTokens()

export const MAX_LOCK_DURATION = 31536000
export const UNLOCK_FREE_DURATION = 604800
export const ONE_WEEK_DEFAULT = 604800
export const BOOST_WEIGHT = BigNumber.from('10000000000000')
export const DURATION_FACTOR = BigNumber.from('31536000')

export const NATIVE_POOL_ID = chainId === MAINNET ? 3 : 3

export const vaultPoolConfig = {
  [VaultKey.CakeVaultV1]: {
    name: <Trans>Auto ABS</Trans>,
    description: <Trans>Automatic restaking</Trans>,
    autoCompoundFrequency: 5000,
    gasLimit: 1000000,
    tokenImage: {
      primarySrc: `/images/toggle/abswap.png`,
      secondarySrc: '/images/tokens/autorenew.svg',
    },
  },
  [VaultKey.CakeVault]: {
    name: <Trans>Stake BRS</Trans>,
    description: <Trans>Stake,Earn-And more!</Trans>,
    autoCompoundFrequency: 5000,
    gasLimit: 1000000,
    tokenImage: {
      primarySrc: '/images/tokens/platform-logo.png',
      secondarySrc: '/images/tokens/autorenew.svg',
    },
  },
} as const

const pools: SerializedPoolConfig[] =
  chainId === MAINNET
    ? []
    : [
        {
          sousId: 0,
          stakingToken: serializedTokens.cake,
          earningToken: serializedTokens.cake,
          contractAddress: {
            9788: '0x70a9d4D30e770Abc31F8Ffd7b07DaE42f1496D3c',
            9787: '',
          },
          poolCategory: PoolCategory.CORE,
          harvest: true,
          tokenPerBlock: '1',
          sortOrder: 1,
          isFinished: false,
        },
        {
          sousId: 1,
          stakingToken: serializedTokens.usdc,
          earningToken: serializedTokens.cake,
          contractAddress: {
            9788: '0x984A361Bd03544C2aad3F7d032f423d52047fce0',
            9787: '',
          },
          poolCategory: PoolCategory.CORE,
          harvest: true,
          tokenPerBlock: '0.01158',
          sortOrder: 1,
          isFinished: false,
        },
        {
          sousId: 2,
          stakingToken: serializedTokens.eth,
          earningToken: serializedTokens.eth,
          contractAddress: {
            9788: '0xB9f37030c764D708ce65101F21cbadb7290A0064',
            9787: '',
          },
          poolCategory: PoolCategory.BINANCE,
          harvest: true,
          tokenPerBlock: '0.0057',
          sortOrder: 2,
          isFinished: false,
        },
      ]
export default pools
