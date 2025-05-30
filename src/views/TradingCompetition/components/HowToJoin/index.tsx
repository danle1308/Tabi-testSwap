import { useWeb3React } from '@web3-react/core'
import { Flex, Text, Heading } from 'packages/uikit'
import styled from 'styled-components'
import { useTranslation } from 'contexts/Localization'
import Link from 'next/link'
import { nftsBaseUrl } from 'views/Nft/market/constants'
import HowToCard from './HowToCard'

const StyledLink = styled(Link)`
  display: inline;
  font-size: 14px;
`

const HowToJoin = () => {
  const { t } = useTranslation()
  const { account } = useWeb3React()

  return (
    <Flex flexDirection="column" maxWidth="736px">
      <Heading color="secondary" scale="lg" mb="32px" textAlign="center">
        {t('How Can I Join?')}
      </Heading>
      <HowToCard number={1} title={t('Get Ready')}>
        <Text fontSize="14px" color="textSubtle">
          {t('Set up your')}{' '}
          {account ? (
            <StyledLink href={`${nftsBaseUrl}/profile/${account.toLowerCase()}`}>{t('TabiSwap Profile')}</StyledLink>
          ) : (
            t('TabiSwap Profile')
          )}
          {', '}
          {t('then register for the competition by clicking “I WANT TO BATTLE” button above.')}
        </Text>
      </HowToCard>
      <HowToCard number={2} title={t('Battle Time')}>
        <Text fontSize="14px" color="textSubtle">
          {t(
            'Trade DAR/ETH, VEN/ETH, and VEN/BUSD during the battle period to raise both your and your team’s score. See the Rules section below for more.',
          )}
        </Text>
      </HowToCard>
      <HowToCard number={3} title={t('Prize Claim')}>
        <Text fontSize="14px" color="textSubtle">
          {t('Teams and traders will be ranked in the order of trading volume. Collect your prizes and celebrate!')}
        </Text>
      </HowToCard>
    </Flex>
  )
}

export default HowToJoin
