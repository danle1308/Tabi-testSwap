import styled from 'styled-components'
import { Text, HelpIcon, Skeleton, useTooltip } from 'packages/uikit'
import { useTranslation } from 'contexts/Localization'
import tokens from 'config/constants/tokens'

const ReferenceElement = styled.div`
  display: inline-block;
`

export interface MultiplierProps {
  multiplier: string
}

const MultiplierWrapper = styled.div`
  width: 36px;
  text-align: right;
  margin-right: 14px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text};

  ${({ theme }) => theme.mediaQueries.lg} {
    text-align: left;
    margin-right: 0;
  }
`

const Container = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`

const Multiplier: React.FunctionComponent<MultiplierProps> = ({ multiplier }) => {
  const displayMultiplier = multiplier ? multiplier.toLowerCase() : <Skeleton width={30} />
  const { t } = useTranslation()
  const tooltipContent = (
    <>
      <Text>
        {t(
          'The Multiplier represents the proportion of %symbol% rewards each farm receives, as a proportion of the %symbol% produced each block.',
          {
            symbol: tokens.cake.symbol,
          },
        )}
      </Text>
      <Text my="24px">
        {t('For example, if a 1x farm received 1 %symbol% per block, a 40x farm would receive 40 %symbol% per block.', {
          symbol: tokens.cake.symbol,
        })}
      </Text>
      <Text>{t('This amount is already included in all APR calculations for the farm.')}</Text>
    </>
  )
  const { targetRef, tooltip, tooltipVisible } = useTooltip(tooltipContent, {
    placement: 'bottom-end',
    tooltipOffset: [20, 10],
  })

  return (
    <Container>
      <MultiplierWrapper>{displayMultiplier}</MultiplierWrapper>
      <ReferenceElement ref={targetRef}>
        <HelpIcon color="WhiteColor" />
      </ReferenceElement>
      {tooltipVisible && tooltip}
    </Container>
  )
}

export default Multiplier
