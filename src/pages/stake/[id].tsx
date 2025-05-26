import React, { useContext } from 'react'
import { useRouter } from 'next/router'
import { PoolsContext, PoolsPageLayout } from 'views/Pools'
import PoolCardSecond from 'views/Pools/components/PoolCardSecond/PoolsCardSecond'
import { useWeb3React } from '@web3-react/core'

const PoolDetailPage: React.FC = () => {
  const { query } = useRouter()
  const { id } = query
  const { chosenPoolsMemoized } = useContext(PoolsContext)

  const { account } = useWeb3React()

  const selectedPool = chosenPoolsMemoized.find((pool) => pool.sousId.toString() === id)

  if (!selectedPool) return <div>Loading or Pool not found...</div>

  return <PoolCardSecond pools={chosenPoolsMemoized} account={account} pool={[selectedPool]} />
}

const PageWithLayout: React.FC = () => {
  return (
    <PoolsPageLayout>
      <PoolDetailPage />
    </PoolsPageLayout>
  )
}

export default PageWithLayout
