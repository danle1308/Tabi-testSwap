import styled, { keyframes, css } from 'styled-components'
import { useTranslation } from 'contexts/Localization'
import { LinkExternal, Text, useMatchBreakpoints } from 'packages/uikit'
import getLiquidityUrlPathParts from 'utils/getLiquidityUrlPathParts'
import { getAddress } from 'utils/addressHelpers'
import { getBscScanLink } from 'utils'
import { FarmWithStakedValue } from '../../types'

import HarvestAction from './HarvestAction'
import StakedAction from './StakedAction'
import Apr, { AprProps } from '../Apr'
import Multiplier, { MultiplierProps } from '../Multiplier'
import Liquidity, { LiquidityProps } from '../Liquidity'
import Earned, { EarnedProps } from '../Earned'

export interface ActionPanelProps {
  apr: AprProps
  multiplier: MultiplierProps
  liquidity: LiquidityProps
  earned: EarnedProps
  details: FarmWithStakedValue
  userDataReady: boolean
  expanded: boolean
}

const expandAnimation = keyframes`
  from {
    max-height: 0px;
  }
  to {
    max-height: 500px;
  }
`

const collapseAnimation = keyframes`
  from {
    max-height: 500px;
  }
  to {
    max-height: 0px;
  }
`

const Container = styled.div<{ expanded }>`
  animation: ${({ expanded }) =>
    expanded
      ? css`
          ${expandAnimation} 300ms linear forwards
        `
      : css`
          ${collapseAnimation} 300ms linear forwards
        `};
  overflow: hidden;
  display: flex;
  width: 100%;
  flex-direction: column-reverse;
  justify-content: space-between;
  padding: 0;
  border-bottom-right-radius: 8px;
  border-bottom-left-radius: 8px;

  ${({ theme }) => theme.mediaQueries.lg} {
    flex-direction: row;
    /* padding: 16px 32px; */
  }
`

const StyledLinkExternal = styled(LinkExternal)`
  font-weight: 400;
  color: ${({ theme }) => theme.colors.WhiteColor};
  display: flex;
  justify-content: space-between;
  width: 100%;
`

const StakeContainer = styled.div`
  color: ${({ theme }) => theme.colors.text};
  align-items: center;
  display: flex;
  justify-content: space-between;

  ${({ theme }) => theme.mediaQueries.sm} {
    justify-content: flex-start;
  }
`

const ActionContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  /* gap: 25px; */
  max-width: 357px;
  width: 100%;
  background-color: #d9d9d9;
  border-radius: 10px;
  padding: 10px 10px;

  ${({ theme }) => theme.mediaQueries.sm} {
    flex-direction: column;
    flex-grow: 1;
    flex-basis: 0;
  }
`

const InfoContainer = styled.div`
  max-width: 282px;
  width: 100%;
  display: flex;
  flex-direction: column;
`

const ValueContainer = styled.div``

const ValueWrapper = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  gap: 5px;
  padding-left: 20px;
  background: #d9d9d9;
  max-width: 282px;
  width: 100%;
  height: 91px;
  border-radius: 10px;
`

const ActionPanel: React.FunctionComponent<ActionPanelProps> = ({
  details,
  apr,
  multiplier,
  liquidity,
  earned,
  userDataReady,
  expanded,
}) => {
  const farm = details

  const { isDesktop } = useMatchBreakpoints()

  const {
    t,
    currentLanguage: { locale },
  } = useTranslation()
  const isActive = farm.multiplier !== '0X'
  const { quoteToken, token } = farm
  const lpLabel = farm.lpSymbol && farm.lpSymbol.toUpperCase().replace('PANCAKE', '')
  const liquidityUrlPathParts = getLiquidityUrlPathParts({
    quoteTokenAddress: quoteToken.address,
    tokenAddress: token.address,
  })
  const lpAddress = getAddress(farm.lpAddresses)
  const bsc = getBscScanLink(lpAddress, 'address')

  return (
    <Container expanded={expanded}>
      <InfoContainer>
        <ValueContainer>
          {farm.isCommunity && farm.auctionHostingEndDate && (
            <ValueWrapper>
              <Text>{t('Auction Hosting Ends')}</Text>
              <Text paddingLeft="4px">
                {new Date(farm.auctionHostingEndDate).toLocaleString(locale, {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </Text>
            </ValueWrapper>
          )}
          {!isDesktop && (
            <>
              <ValueWrapper>
                <Text>{t('APR')}</Text>
                <Apr {...apr} />
              </ValueWrapper>
              <ValueWrapper>
                <Text>{t('Multiplier')}</Text>
                <Multiplier {...multiplier} />
              </ValueWrapper>
              <ValueWrapper>
                <Text>{t('Liquidity')}</Text>
                <Liquidity {...liquidity} />
              </ValueWrapper>
            </>
          )}
        </ValueContainer>
        {/* {isActive && (
          <StakeContainer>
            <StyledLinkExternal href={`/add/${liquidityUrlPathParts}`} color="WhiteColor">
              {t('Get %symbol%', { symbol: lpLabel })}
            </StyledLinkExternal>
            {<StyledLinkExternal href="#">{t('Get %symbol%', { symbol: lpLabel })}</StyledLinkExternal>}
          </StakeContainer>
        )} */}
        <ValueWrapper style={{ marginBottom: '10px' }}>
          <Text style={{ fontSize: '14px', color: 'black', fontWeight: '400' }}>{t('TVL')}</Text>
          <Liquidity {...liquidity} />
        </ValueWrapper>
        <ValueWrapper>
          <Text style={{ fontSize: '14px', color: 'black', fontWeight: '400' }}>{t('APY')}</Text>
          <Apr {...apr} />
        </ValueWrapper>
        <ValueWrapper style={{ marginTop: '10px' }}>
          <Text style={{ fontSize: '14px', color: 'black', fontWeight: '400' }}>{t('Token Reward')}</Text>
          <Earned userDataReady={false} {...earned} />
        </ValueWrapper>
        {/* <StyledLinkExternal href={bsc} color="WhiteColor">
          {t('View Contract')}
        </StyledLinkExternal> */}
        {/* <StyledLinkExternal color="#ffffff" href={info}>
          {t('See Pair Info')}
        </StyledLinkExternal> */}
      </InfoContainer>
      <ActionContainer>
        <StakedAction {...farm} userDataReady={userDataReady} lpLabel={lpLabel} displayApr={apr.value} />
        <HarvestAction {...farm} userDataReady={userDataReady} />
      </ActionContainer>
    </Container>
  )
}

export default ActionPanel
