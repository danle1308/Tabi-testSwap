import { useState } from 'react'
import styled from 'styled-components'
import { Flex, Box, Text, ExpandableLabel, LinkExternal, Grid, HelpIcon, useTooltip } from 'packages/uikit'
import { useTranslation } from 'contexts/Localization'
import { getApy } from 'utils/compoundApyHelpers'

const Footer = styled(Flex)`
  width: 100%;
  padding: 24px 0 24px 0;
`

const BulletList = styled.ul`
  list-style-type: none;
  margin-top: 16px;
  padding: 0;

  li {
    margin: 0;
    padding: 0;
    position: relative;
    padding-left: 12px;
    margin-bottom: 5px;

    font-size: 10px;
  }
  li::before {
    content: '•';
    color: ${({ theme }) => theme.colors.WhiteColor};

    position: absolute;
    top: 2px;
    left: 0;
  }
  li::marker {
    font-size: inherit;
  }
`

const ExpandedWrapper = styled(Box)`
  background: ${({ theme }) => theme.colors.dropdownDeep};
  padding: 24px;
`

const ExpandedLabel = styled(Text)`
  white-space: nowrap;
`

interface RoiCalculatorFooterProps {
  isFarm: boolean
  apr?: number
  apy?: number
  displayApr: string
  autoCompoundFrequency: number
  multiplier: string
  linkLabel: string
  linkHref: string
  performanceFee: number
}

const RoiCalculatorFooter: React.FC<RoiCalculatorFooterProps> = ({
  isFarm,
  apr,
  apy,
  displayApr,
  autoCompoundFrequency,
  multiplier,
  linkLabel,
  linkHref,
  performanceFee,
}) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const { t } = useTranslation()
  const {
    targetRef: multiplierRef,
    tooltip: multiplierTooltip,
    tooltipVisible: multiplierTooltipVisible,
  } = useTooltip(
    <>
      <Text>
        {t(
          'The Multiplier represents the proportion of TABI rewards each farm receives, as a proportion of the TABI produced each block.',
        )}
      </Text>
      <Text my="24px">
        {t('For example, if a 1x farm received 1 TABI per block, a 40x farm would receive 40 TABI per block.')}
      </Text>
      <Text>{t('This amount is already included in all APR calculations for the farm.')}</Text>
    </>,
    { placement: 'top-end', tooltipOffset: [20, 10] },
  )

  const gridRowCount = isFarm ? 4 : 2
  const APY = (getApy(apr, autoCompoundFrequency > 0 ? autoCompoundFrequency : 1, 365, performanceFee) * 100)
    .toString()
    .slice(0, 4)

  return (
    <Footer p="16px" flexDirection="column">
      <ExpandableLabel expanded={isExpanded} onClick={() => setIsExpanded((prev) => !prev)}>
        {isExpanded ? t('Hide') : t('Details')}
      </ExpandableLabel>
      {isExpanded && (
        <ExpandedWrapper px="8px">
          <Grid gridTemplateColumns="1fr 1fr" gridRowGap="8px" gridTemplateRows={`repeat(${gridRowCount}, auto)`}>
            {isFarm && (
              <>
                <ExpandedLabel color="WhiteColor" small>
                  {t('APR (incl. LP rewards)')}
                </ExpandedLabel>
                <ExpandedLabel small textAlign="right">
                  {displayApr}%
                </ExpandedLabel>
              </>
            )}
            {!Number.isFinite(apy) ? (
              <ExpandedLabel color="WhiteColor" small>
                {isFarm ? t('Base APR (ETH yield only)') : t('APR')}
              </ExpandedLabel>
            ) : (
              <ExpandedLabel color="WhiteColor" small>
                {t('APY')}
              </ExpandedLabel>
            )}
            <ExpandedLabel small textAlign="right">
              {(apy ?? apr).toFixed(2)}%
            </ExpandedLabel>
            {!Number.isFinite(apy) && (
              <ExpandedLabel color="WhiteColor" small>
                {t('APY (%compoundTimes%x daily compound)', {
                  compoundTimes: autoCompoundFrequency > 0 ? autoCompoundFrequency : 1,
                })}
              </ExpandedLabel>
            )}
            {!Number.isFinite(apy) && (
              <ExpandedLabel small textAlign="right">
                {APY}%
              </ExpandedLabel>
            )}
            {isFarm && (
              <>
                <ExpandedLabel color="WhiteColor" small>
                  {t('Farm Multiplier')}
                </ExpandedLabel>
                <Flex justifyContent="flex-end" alignItems="flex-end">
                  <ExpandedLabel small textAlign="right" mr="4px">
                    {multiplier}
                  </ExpandedLabel>
                  <span ref={multiplierRef}>
                    <HelpIcon color="WhiteColor" width="16px" height="16px" />
                  </span>
                  {multiplierTooltipVisible && multiplierTooltip}
                </Flex>
              </>
            )}
          </Grid>
          <BulletList>
            <li>
              <Text fontSize="12px" textAlign="center" color="WhiteColor" display="inline" lineHeight={1.1}>
                {t('Calculated based on current rates.')}
              </Text>
            </li>
            {isFarm && (
              <li>
                <Text fontSize="12px" textAlign="center" color="WhiteColor" display="inline">
                  {t('LP rewards: 0.17% trading fees, distributed proportionally among LP token holders.')}
                </Text>
              </li>
            )}
            <li>
              <Text fontSize="12px" textAlign="center" color="WhiteColor" display="inline" lineHeight={1.1}>
                {t(
                  'All figures are estimates provided for your convenience only, and by no means represent guaranteed returns.',
                )}
              </Text>
            </li>
            {performanceFee > 0 && (
              <li>
                <Text mt="14px" fontSize="12px" textAlign="center" color="WhiteColor" display="inline">
                  {t('All estimated rates take into account this pool’s %fee%% performance fee', {
                    fee: performanceFee,
                  })}
                </Text>
              </li>
            )}
          </BulletList>
          <Flex justifyContent="center" mt="24px">
            <LinkExternal color="WhiteColor" href={linkHref}>
              {linkLabel}
            </LinkExternal>
          </Flex>
        </ExpandedWrapper>
      )}
    </Footer>
  )
}

export default RoiCalculatorFooter
