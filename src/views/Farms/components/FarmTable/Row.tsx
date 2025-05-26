/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/jsx-no-comment-textnodes */
import { useEffect, useState, createElement, useContext } from 'react'
import styled from 'styled-components'
import { useMatchBreakpoints, Flex, Box, LinkExternal, Button, useModal } from 'packages/uikit'
import { useTranslation } from 'contexts/Localization'
import useDelayedUnmount from 'hooks/useDelayedUnmount'
import { useFarmUser } from 'state/farms/hooks'

import { FarmAuctionTag, CoreTag } from 'components/Tags'
import Icon from 'components/Svg/RefreshIcon'
import List from 'packages/uikit/src/components/Svg/Icons/List'
import { DeserializedFarm } from 'state/types'
import farms from 'config/constants/farms'
import { FarmsContext } from 'views/Farms/Farms'
import ListPoolModal from './ListPoolModal'
import { DesktopColumnSchema, MobileColumnSchema, FarmWithStakedValue } from '../types'
import Apr, { AprProps } from './Apr'
import Farm, { FarmProps } from './Farm'
import Earned, { EarnedProps } from './Earned'
import Details from './Details'
import Multiplier, { MultiplierProps } from './Multiplier'
import Liquidity, { LiquidityProps } from './Liquidity'
import ActionPanel from './Actions/ActionPanel'
import CellLayout from './CellLayout'
// import getLiquidityUrlPathParts from 'utils/getLiquidityUrlPathParts'

export interface RowProps {
  apr: AprProps
  farm: FarmProps
  account: string
  earned: EarnedProps
  multiplier: MultiplierProps
  liquidity: LiquidityProps
  details: FarmWithStakedValue
  type: 'core' | 'community'
  // farm: DeserializedFarm
}

interface RowPropsWithLoading extends RowProps {
  userDataReady: boolean
}

const cells = {
  apr: Apr,
  farm: Farm,
  earned: Earned,
  details: Details,
  multiplier: Multiplier,
  liquidity: Liquidity,
}

const CellInner = styled.div`
  padding: 24px 0px;
  display: flex;
  /* width: 100%; */
  align-items: center;
  padding-right: 8px;

  ${({ theme }) => theme.mediaQueries.xl} {
    /* padding-right: 32px; */
  }
`

const StyledTr = styled.tr`
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 0 10px 0;
  /* border-bottom: 2px solid ${({ theme }) => theme.colors.textScroll}; */
`

// const MobileTr = styled(StyledTr)`
//   padding-left: 16px;
// `

const EarnedMobileCell = styled.div`
  padding: 16px 0 24px 16px;
  width: calc(50% - 8px);
`

const AprMobileCell = styled.div`
  /* padding-top: 16px;
  padding-bottom: 24px; */
  padding: 16px 0 24px 16px;
  width: calc(50% - 8px);
`

const FarmMobileCell = styled.td`
  padding-top: 24px;
`
const StyledLinkExternal = styled(LinkExternal)`
  font-weight: 700;
  color: #fe0034;
  display: flex;
  font-size: 14px;
  justify-content: space-between;
  gap: 10px;
`
const Row: React.FunctionComponent<RowPropsWithLoading> = (props, quoteToken, token) => {
  const { details, userDataReady, farm } = props
  const hasStakedAmount = !!useFarmUser(details.pid).stakedBalance.toNumber()
  const [actionPanelExpanded, setActionPanelExpanded] = useState(hasStakedAmount)
  const shouldRenderChild = useDelayedUnmount(actionPanelExpanded, 300)
  const { t } = useTranslation()

  const toggleActionPanel = () => {
    setActionPanelExpanded(!actionPanelExpanded)
  }

  const chosenFarmsMemoized = useContext(FarmsContext)

  useEffect(() => {
    setActionPanelExpanded(hasStakedAmount)
  }, [hasStakedAmount])

  const { isDesktop, isMobile } = useMatchBreakpoints()

  const isSmallerScreen = !isDesktop
  const tableSchema = isSmallerScreen ? MobileColumnSchema : DesktopColumnSchema
  const columnNames = tableSchema.map((column) => column.name)
  const [onPresentExpertModal] = useModal(<ListPoolModal farms={chosenFarmsMemoized.chosenFarmsMemoized} />)
  const handleRenderRow = () => {
    if (!isMobile) {
      return (
        <StyledTr onClick={toggleActionPanel}>
          <Box>
            <Farm {...props.farm} />
          </Box>
          <Box style={{ display: 'flex', gap: '20px', width: '40%' }}>
            <StyledLinkExternal href="/liquidity">Add Liquidity</StyledLinkExternal>
            <Button
              onClick={onPresentExpertModal}
              style={{
                gap: '8px',
                alignItems: 'center',
                fontSize: '14px',
                fontWeight: '500',
                borderRadius: '5px',
                boxShadow: 'none',
                border: '1px solid var(--color-white-50)',
                height: '29px',
                maxWidth: '128px',
                width: '100%',
                lineHeight: '24px',
                padding: '0',
              }}
            >
              <List width={17} />
              <div>List All Pool</div>
            </Button>
          </Box>
        </StyledTr>
      )
    }

    return (
      <>
        <tr style={{ cursor: 'pointer' }} onClick={toggleActionPanel}>
          <FarmMobileCell colSpan={3}>
            <Flex style={{ justifyContent: 'space-between', alignItems: 'center' }}>
              <Farm {...props.farm} />
              {props.type === 'community' ? (
                <FarmAuctionTag marginRight="16px" scale="sm" />
              ) : (
                <CoreTag marginRight="16px" scale="sm" />
              )}
            </Flex>
          </FarmMobileCell>
        </tr>
        <StyledTr onClick={toggleActionPanel}>
          <td colSpan={3}>
            <Flex width="100%" flexWrap="wrap">
              <EarnedMobileCell>
                <CellLayout label={t('Earned')}>
                  <Earned {...props.earned} userDataReady={userDataReady} />
                </CellLayout>
              </EarnedMobileCell>

              <AprMobileCell>
                <CellLayout label={t('APR')}>
                  <Apr {...props.apr} hideButton />
                </CellLayout>
              </AprMobileCell>

              <CellInner>
                <Details actionPanelToggled={actionPanelExpanded} style={{ justifyContent: 'center' }} />
              </CellInner>
            </Flex>
          </td>

          {/* <td colSpan={3}>
            <Flex justifyContent="center" alignItems="center" width="100%"></Flex>
          </td> */}
          {/* <td width="100%">
            <AprMobileCell>
              <CellLayout label={t('APR')}>
                <Apr {...props.apr} hideButton />
              </CellLayout>
            </AprMobileCell>
          </td>
          <td width="100%">
            <CellInner style={{ justifyContent: 'flex-end' }}>
              <Details actionPanelToggled={actionPanelExpanded} />
            </CellInner>
          </td> */}
        </StyledTr>
      </>
    )
  }

  return (
    <>
      {handleRenderRow()}
      {(true || shouldRenderChild) && (
        <tr>
          <td colSpan={7}>
            <ActionPanel {...props} expanded />
          </td>
        </tr>
      )}
    </>
  )
}

export default Row
