import { useState } from 'react'
import BigNumber from 'bignumber.js'
import styled from 'styled-components'
import { useTranslation } from 'contexts/Localization'
import { Flex, CardFooter, ExpandableLabel, HelpIcon, useTooltip } from 'packages/uikit'
import { DeserializedPool } from 'state/types'
import { CompoundingPoolTag, ManualPoolTag } from 'components/Tags'
import PoolStatsInfo from '../../PoolStatsInfo'

interface FooterProps {
  pool: DeserializedPool
  account: string
  totalCakeInVault?: BigNumber
  defaultExpanded?: boolean
}

const ExpandableButtonWrapper = styled(Flex)`
  align-items: center;
  justify-content: space-between;
  button {
    padding: 0;
  }
`
const ExpandedWrapper = styled(Flex)`
  svg {
    height: 14px;
    width: 14px;
  }
`

const RoundedBox = styled.div`
  border-radius: 25px;
  overflow: hidden;
  width: fit-content;
  color: #000;
`

const Footer: React.FC<FooterProps> = ({ pool, account, defaultExpanded, children }) => {
  const { vaultKey } = pool
  const { t } = useTranslation()
  const [isExpanded, setIsExpanded] = useState(defaultExpanded || false)

  const manualTooltipText = t('You must harvest and compound your earnings from this pool manually.')
  const autoTooltipText = t(
    'Rewards are distributed and included into your staking balance automatically. There’s no need to manually compound your rewards.',
  )

  const { targetRef, tooltip, tooltipVisible } = useTooltip(vaultKey ? autoTooltipText : manualTooltipText, {
    placement: 'bottom',
  })

  return (
    <CardFooter mt="auto">
      <ExpandableButtonWrapper>
        <Flex alignItems="center">
          {vaultKey ? (
            <RoundedBox>
              <CompoundingPoolTag />
            </RoundedBox>
          ) : (
            <RoundedBox>
              <ManualPoolTag />
            </RoundedBox>
          )}
          {tooltipVisible && tooltip}
          <Flex ref={targetRef}>
            <HelpIcon ml="4px" width="20px" height="20px" color="textSubtle" />
          </Flex>
        </Flex>
        <ExpandableLabel expanded={isExpanded} onClick={() => setIsExpanded(!isExpanded)}>
          {isExpanded ? t('Hide') : t('Details')}
        </ExpandableLabel>
      </ExpandableButtonWrapper>
      {isExpanded && (
        <ExpandedWrapper flexDirection="column">
          {children || <PoolStatsInfo pool={pool} account={account} />}
        </ExpandedWrapper>
      )}
    </CardFooter>
  )
}

export default Footer
