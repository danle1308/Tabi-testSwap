import { useTranslation } from 'contexts/Localization'
import styled from 'styled-components'
import { Text, Flex, LinkExternal, Skeleton } from 'packages/uikit'

export interface ExpandableSectionProps {
  bscScanAddress?: string
  infoAddress?: string
  removed?: boolean
  totalValueFormatted?: string
  lpLabel?: string
  addLiquidityUrl?: string
  isCommunity?: boolean
  auctionHostingEndDate?: string
}

const Wrapper = styled.div`
  margin-top: 24px;
`

const StyledLinkExternal = styled(LinkExternal)`
  font-weight: 400;
  font-size: 12px;
  color: ${({ theme }) => theme.colors.WhiteColor};

  max-width: 146px;
  width: 100%;
  display: flex;
  justify-content: space-between;
`

const DetailsSection: React.FC<ExpandableSectionProps> = ({
  bscScanAddress,
  removed,
  totalValueFormatted,
  lpLabel,
  addLiquidityUrl,
  isCommunity,
  auctionHostingEndDate,
}) => {
  const {
    t,
    currentLanguage: { locale },
  } = useTranslation()

  return (
    <Wrapper>
      {isCommunity && auctionHostingEndDate && (
        <Flex justifyContent="space-between">
          <Text>{t('Auction Hosting Ends')}:</Text>
          <Text>
            {new Date(auctionHostingEndDate).toLocaleString(locale, {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            })}
          </Text>
        </Flex>
      )}
      <Flex justifyContent="space-between" mb="10px">
        <Text fontSize="12px" color="WhiteColor">
          {t('Total Liquidity')}:
        </Text>
        {totalValueFormatted ? (
          <Text fontSize="12px" color="WhiteColor">
            {totalValueFormatted}
          </Text>
        ) : (
          <Skeleton width={75} height={25} />
        )}
      </Flex>
      {!removed && (
        <StyledLinkExternal color="textActive" href={addLiquidityUrl}>
          {t('Get %symbol%', { symbol: lpLabel })}
        </StyledLinkExternal>
      )}
      <StyledLinkExternal color="textActive" href={bscScanAddress}>
        {t('View Contract')}
      </StyledLinkExternal>
      {/* <StyledLinkExternal href={infoAddress}>{t('See Pair Info')}</StyledLinkExternal> */}
    </Wrapper>
  )
}

export default DetailsSection
