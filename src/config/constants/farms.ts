import { ChainId } from '@tabi-dex/sdk'
import { serializeTokens } from './tokens'
import { SerializedFarmConfig } from './types'
import { CHAIN_ID } from './networks'

const serializedTokens = serializeTokens()

const chainId = parseInt(CHAIN_ID, 10)
const { MAINNET } = ChainId

export const VLX_WAG_FARM_PID = chainId === MAINNET ? 1 : 1 // WAG-VLX (2)
export const VLX_USDT_FARM_PID = chainId === MAINNET ? 1 : 1 // BUSD-VLX (3)

const farms: SerializedFarmConfig[] =
  chainId === MAINNET
    ? []
    : [
        /**
         * These 3 farms (PID 0, 251, 252) should always be at the top of the file.
         */
        {
          pid: 0,
          v1pid: 0,
          lpSymbol: 'MAD',
          lpAddresses: {
            9788: '0x00000000000000000000000000000000000',
            9787: '',
          },
          token: serializedTokens.cake,
          quoteToken: serializedTokens.weth,
        },
        {
          pid: 1,
          v1pid: 1,
          lpSymbol: 'TBS-LP',
          lpAddresses: {
            9788: '0x7C0BA717086037735E7bb407C49c2E4b00B9cd00',
            9787: '',
          },
          token: serializedTokens.cake,
          quoteToken: serializedTokens.weth,
        },
        // {
        //   pid: 2,
        //   v1pid: 2,
        //   lpSymbol: 'USDC/WMON LP',
        //   lpAddresses: {
        //     9788: '0x37A619aabDc336Abc57f9012275eD269CB01f1b4',
        //     9787: '',
        //   },
        //   token: serializedTokens.usdc,
        //   quoteToken: serializedTokens.weth,
        // },
        // {
        //   pid: 3,
        //   v1pid: 3,
        //   lpSymbol: 'USDC/MAD LP',
        //   lpAddresses: {
        //     9788: '0xCaBA546FC67e9eEEdD96fD32A3C1A46314F03900',
        //     9787: '',
        //   },
        //   token: serializedTokens.cake,
        //   quoteToken: serializedTokens.usdc,
        // },
      ]

export default farms
