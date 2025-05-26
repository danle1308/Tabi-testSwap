import { useRef, useContext } from 'react'
import styled from 'styled-components'
import {
  Button,
  ArrowDropUpIcon,
  useMatchBreakpoints,
  Flex,
  Text,
  ListViewIcon,
  LinkExternal,
  useModal,
} from 'packages/uikit'
import { useTranslation } from 'contexts/Localization'
import { DeserializedPool } from 'state/types'
import { RowBetween } from 'components/Layout/Row'
import { getAddress, getVaultPoolAddress } from 'utils/addressHelpers'
import { PoolsContext } from 'views/Pools'
import PoolRow, { MobileExpandedButton } from './PoolRow'
import ActionPanel from './ActionPanel/ActionPanel'
import NameCell from './Cells/NameCell'
import ListModal from './ListModal'

interface PoolsTableProps {
  pools: DeserializedPool[]
  account: string
  pool: DeserializedPool[]
}

const StyledTable = styled.div`
  scroll-margin-top: 64px;
  padding: 20px 20px 0 20px;

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
  width: 709px;
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

const RestyleButton = styled(Button)`
  width: 129px;
  height: 29px;
  padding: 0;
  box-shadow: none;
  border-radius: 5px;
  border: 1px solid var(--color-border-50);
  font-size: 14px;
  font-weight: 400;
  align-items: center;
`

const PoolsCardSecond: React.FC<PoolsTableProps> = ({ pools, account, pool }) => {
  const { isXs, isSm, isMd, isLg, isXl, isXxl, isTablet, isDesktop, isMobile } = useMatchBreakpoints()
  const { t } = useTranslation()
  const tableWrapperEl = useRef<HTMLDivElement>(null)
  const expanded = true

  const [openListModal] = useModal(<ListModal pool={pools} />)

  return (
    <StyledTableBorder>
      <StyledTable id="pools-table" role="table" ref={tableWrapperEl}>
        {pool.map((poolFilter) => (
          <>
            <RowBetween padding="0 0 1rem 0">
              <NameCell pool={poolFilter} />
              <Flex alignItems="center">
                <LinkExternal
                  // href={`${BASE_VELAS_SCAN_URL}/address/${vaultKey ? cakeVaultContractAddress : poolContractAddress}`}
                  bold
                  small
                  style={{ color: 'var(--color-red)' }}
                >
                  {t('Get MAD')}
                </LinkExternal>
                <RestyleButton onClick={openListModal}>
                  <ListViewIcon width={20} height={15} mr="3px" />
                  {t(`List All Pool`)}
                </RestyleButton>
              </Flex>
            </RowBetween>
            <ActionPanel
              account={account}
              pool={poolFilter}
              expanded={expanded}
              breakpoints={{ isXs, isSm, isMd, isLg, isXl, isXxl }}
            />
          </>
        ))}
      </StyledTable>
    </StyledTableBorder>
  )
}

export default PoolsCardSecond
