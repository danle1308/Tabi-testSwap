import { gql } from 'graphql-request'
import { mapBurns, mapMints, mapSwaps } from 'state/info/queries/helpers'
import { BurnResponse, MintResponse, SwapResponse } from 'state/info/queries/types'
import { Transaction } from 'state/info/types'
import { infoClient } from 'utils/graphql'

/**
 * Data to display transaction table on Token page
 */
const TOKEN_TRANSACTIONS = gql`
  query tokenTransactions($address: Bytes!) {
    mintsAs0: pairs(first: 1, where: { token0: $address }) {
      mints(first: 10, orderBy: timestamp, orderDirection: desc) {
        id
        timestamp
        pair {
          token0 {
            id
            symbol
          }
          token1 {
            id
            symbol
          }
        }
        to
        amount0
        amount1
        amountUSD
      }
    }
    mintsAs1: pairs(first: 1, where: { token1: $address }) {
      mints(first: 10, orderBy: timestamp, orderDirection: desc) {
        id
        timestamp
        pair {
          token0 {
            id
            symbol
          }
          token1 {
            id
            symbol
          }
        }
        to
        amount0
        amount1
        amountUSD
      }
    }
    swapsAs0: pairs(first: 1, where: { token0: $address }) {
      swaps(first: 10, orderBy: timestamp, orderDirection: desc) {
        id
        timestamp
        pair {
          token0 {
            id
            symbol
          }
          token1 {
            id
            symbol
          }
        }
        from
        amount0In
        amount1In
        amount0Out
        amount1Out
        amountUSD
      }
    }
    swapsAs1: pairs(first: 1, where: { token1: $address }) {
      swaps(first: 10, orderBy: timestamp, orderDirection: desc) {
        id
        timestamp
        pair {
          token0 {
            id
            symbol
          }
          token1 {
            id
            symbol
          }
        }
        from
        amount0In
        amount1In
        amount0Out
        amount1Out
        amountUSD
      }
    }
    burnsAs0: pairs(first: 1, where: { token0: $address }) {
      burns(first: 10, orderBy: timestamp, orderDirection: desc) {
        id
        timestamp
        pair {
          token0 {
            id
            symbol
          }
          token1 {
            id
            symbol
          }
        }
        sender
        amount0
        amount1
        amountUSD
      }
    }
    burnsAs1: pairs(first: 1, where: { token1: $address }) {
      burns(first: 10, orderBy: timestamp, orderDirection: desc) {
        id
        timestamp
        pair {
          token0 {
            id
            symbol
          }
          token1 {
            id
            symbol
          }
        }
        sender
        amount0
        amount1
        amountUSD
      }
    }
  }
`

interface TransactionResults {
  mintsAs0: {
    mints: MintResponse[]
  }[]
  mintsAs1: {
    mints: MintResponse[]
  }[]
  swapsAs0: {
    swaps: SwapResponse[]
  }[]
  swapsAs1: {
    swaps: SwapResponse[]
  }[]
  burnsAs0: {
    burns: BurnResponse[]
  }[]
  burnsAs1: {
    burns: BurnResponse[]
  }[]
}
const fetchTokenTransactions = async (address: string): Promise<{ data?: Transaction[]; error: boolean }> => {
  try {
    const data = await infoClient.request<TransactionResults>(TOKEN_TRANSACTIONS, {
      address,
    })
    const mints0 = data.mintsAs0.length > 0 ? data.mintsAs0[0].mints.map(mapMints) : []
    const mints1 = data.mintsAs1.length > 0 ? data.mintsAs1[0].mints.map(mapMints) : []

    const burns0 = data.burnsAs0.length > 0 ? data.burnsAs0[0].burns.map(mapBurns) : []
    const burns1 = data.burnsAs1.length > 0 ? data.burnsAs1[0].burns.map(mapBurns) : []

    const swaps0 = data.swapsAs0.length > 0 ? data.swapsAs0[0].swaps.map(mapSwaps) : []
    const swaps1 = data.swapsAs1.length > 0 ? data.swapsAs1[0].swaps.map(mapSwaps) : []

    return { data: [...mints0, ...mints1, ...burns0, ...burns1, ...swaps0, ...swaps1], error: false }
  } catch (error) {
    console.error(`Failed to fetch transactions for token ${address}`, error)
    return {
      error: true,
    }
  }
}

export default fetchTokenTransactions
