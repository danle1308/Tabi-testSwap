import { useRef } from 'react'
import styled from 'styled-components'
import { Button, ArrowDropUpIcon } from 'packages/uikit'
import { useTranslation } from 'contexts/Localization'
import { DeserializedPool } from 'state/types'
import PoolRow, { MobileExpandedButton } from './PoolRow'

interface PoolsTableProps {
  pools: DeserializedPool[]
  account: string
}

const StyledTable = styled.div`
  scroll-margin-top: 64px;
  /* padding: 24px 24px 0 24px; */

  // get a selector prior to a last child
  & > div:nth-last-child(2) {
    & > ${MobileExpandedButton} {
      border-bottom: none;
    }
  }
`

const StyledTableBorder = styled.div`
  border: 1px solid rgba(250, 250, 250, 0.5);
  /* padding: 1px 1px 3px 1px; */
  background: ${({ theme }) => theme.colors.ModalBg};
  border-radius: 16px;
  max-width: 709px;
`

const ScrollButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  padding-top: 10px;
  padding-bottom: 10px;
  margin-top: 32px;

  border-top: 2px solid ${({ theme }) => theme.colors.WhiteColor};
`

const StyledButtonScroll = styled(Button)`
  color: ${({ theme }) => theme.colors.WhiteColor};
  font-weight: 400;
`

const PoolsTable: React.FC<PoolsTableProps> = ({ pools, account }) => {
  const { t } = useTranslation()
  const tableWrapperEl = useRef<HTMLDivElement>(null)
  const scrollToTop = (): void => {
    tableWrapperEl.current.scrollIntoView({
      behavior: 'smooth',
    })
  }
  console.log('pools', pools)
  return (
    <StyledTableBorder>
      <StyledTable id="pools-table" role="table" ref={tableWrapperEl}>
        {pools.slice(0, 1).map((pool) => (
          <PoolRow key={pool.vaultKey ?? pool.sousId} pool={pool} account={account} />
        ))}
        {/* <ScrollButtonContainer>
          <StyledButtonScroll variant="text" onClick={scrollToTop}>
            {t('To Top')}
            <ArrowDropUpIcon color="WhiteColor" />
          </StyledButtonScroll>
        </ScrollButtonContainer> */}
      </StyledTable>
    </StyledTableBorder>
  )
}

export default PoolsTable
