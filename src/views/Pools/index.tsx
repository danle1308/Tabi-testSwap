import { FC } from 'react'
import Pools, { PoolsContext } from './Pools'

export const PoolsPageLayout: FC = ({ children }) => {
  return <Pools>{children}</Pools>
}

export { PoolsContext }
