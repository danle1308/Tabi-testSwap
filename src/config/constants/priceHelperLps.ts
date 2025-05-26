// import tokens from './tokens'
import { SerializedFarmConfig } from './types'

const priceHelperLps: SerializedFarmConfig[] = [
  /**
   * These LPs are just used to help with price calculation for MasterChef LPs (farms.ts).
   * This list is added to the MasterChefLps and passed to fetchFarm. The calls to get contract information about the token/quoteToken in the LP are still made.
   * The absence of a PID means the masterchef contract calls are skipped for this farm.
   * Prices are then fetched for all farms (masterchef + priceHelperLps).
   * Before storing to redux, farms without a PID are filtered out.
   */
  // {
  //   pid: null,
  //   lpSymbol: 'VEN-USDC LP',
  //   lpAddresses: {
  //     534352: '',
  //     7001: '0xDcF2445F553290c3A1836711b556Be14a1C4AEf2',
  //   },
  //   token: tokens.usdc,
  //   quoteToken: tokens.cake,
  // },
]

export default priceHelperLps
