import { useState } from 'react'
import styled from 'styled-components'
import { useMatchBreakpoints, Flex } from 'packages/uikit'
import { DeserializedPool, VaultKey } from 'state/types'
import useDelayedUnmount from 'hooks/useDelayedUnmount'
import NameCell from './Cells/NameCell'
import EarningsCell from './Cells/EarningsCell'
import AprCell from './Cells/AprCell'
import TotalStakedCell from './Cells/TotalStakedCell'
import EndsInCell from './Cells/EndsInCell'
import ExpandActionCell from './Cells/ExpandActionCell'
import ActionPanel from './ActionPanel/ActionPanel'
import AutoEarningsCell from './Cells/AutoEarningsCell'
import AutoAprCell from './Cells/AutoAprCell'
import StakedCell from './Cells/StakedCell'

interface PoolRowProps {
  pool: DeserializedPool
  account: string
}

const StyledRow = styled.div`
  background-color: transparent;
  display: flex;
  cursor: pointer;
`

const MobileList = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
`

export const MobileExpandedButton = styled.div`
  border-bottom: 1px solid #9b9c9f;

  ${({ theme }) => theme.mediaQueries.md} {
    border-bottom: none;
  }
`

export const MobileListWrapper = styled(Flex)`
  &:last-child {
    ${MobileExpandedButton} {
      border: none;
    }
  }
`

const PoolRow: React.FC<PoolRowProps> = ({ pool, account }) => {
  const { isXs, isSm, isMd, isLg, isXl, isXxl, isTablet, isDesktop, isMobile } = useMatchBreakpoints()
  const isLargerScreen = isLg || isXl || isXxl
  const isXLargerScreen = isXl || isXxl

  // set true for open expanded, if you wanna close expanded, you just set false for nuder state
  const [expanded, setExpanded] = useState(true)
  const shouldRenderActionPanel = useDelayedUnmount(expanded, 300)

  const toggleExpanded = () => {
    setExpanded((prev) => !prev)
  }

  const isCakePool = pool.sousId === 0

  return (
    <>
      {/* <StyledRow role="row" onClick={toggleExpanded}> */}
      <StyledRow role="row">
        <NameCell pool={pool} />

        {!isMobile ? (
          <>
            {pool.vaultKey ? (
              isXLargerScreen &&
              pool.vaultKey === VaultKey.CakeVault && <AutoEarningsCell pool={pool} account={account} />
            ) : (
              <EarningsCell pool={pool} account={account} />
            )}
            {isXLargerScreen && pool.vaultKey === VaultKey.CakeVault && isCakePool ? (
              <StakedCell pool={pool} account={account} />
            ) : null}
            {isLargerScreen && !isCakePool && <TotalStakedCell pool={pool} />}
            {pool.vaultKey ? <AutoAprCell pool={pool} /> : <AprCell pool={pool} />}
            {isLargerScreen && isCakePool && <TotalStakedCell pool={pool} />}
            {isDesktop && !isCakePool && <EndsInCell pool={pool} />}
          </>
        ) : null}
        {/* {!isMobile ? <ExpandActionCell expanded={expanded} isFullLayout={isTablet || isDesktop} /> : null} */}
      </StyledRow>

      <MobileListWrapper flexDirection="column">
        <MobileList>
          {isMobile ? (
            <>
              {pool.vaultKey ? (
                pool.vaultKey === VaultKey.CakeVault && <AutoEarningsCell pool={pool} account={account} />
              ) : (
                <EarningsCell pool={pool} account={account} />
              )}
              {pool.vaultKey === VaultKey.CakeVault && isCakePool ? <StakedCell pool={pool} account={account} /> : null}
              {isCakePool ? <TotalStakedCell pool={pool} /> : <TotalStakedCell pool={pool} />}
              {pool.vaultKey ? <AutoAprCell pool={pool} /> : <AprCell pool={pool} />}
            </>
          ) : null}
        </MobileList>
        {isMobile ? (
          <>
            <MobileExpandedButton onClick={toggleExpanded}>
              <ExpandActionCell
                expanded={expanded}
                isFullLayout
                style={{ justifyContent: 'center', cursor: 'pointer' }}
              />
            </MobileExpandedButton>
          </>
        ) : null}
      </MobileListWrapper>

      {shouldRenderActionPanel && (
        <ActionPanel
          account={account}
          pool={pool}
          expanded={expanded}
          breakpoints={{ isXs, isSm, isMd, isLg, isXl, isXxl }}
        />
      )}
    </>
  )
}

export default PoolRow
