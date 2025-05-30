import styled from 'styled-components'
import { Card, CardHeader, Box, Heading, Text } from 'packages/uikit'
import { useTranslation } from 'contexts/Localization'
import EasterPrizesGrid from './PrizesGrid/EasterPrizesGrid'

const StyledCard = styled(Card)`
  ${({ theme }) => theme.mediaQueries.md} {
    margin-right: 40px;
    flex: 1;
  }
`

const EasterPrizesCard = () => {
  const { t } = useTranslation()

  return (
    <StyledCard>
      <CardHeader>
        <Heading scale="lg" color="secondary">
          {t('Prizes by Team')}
        </Heading>
        <Text color="textSubtle" fontSize="14px">
          {t('Higher trading volume = higher rank!')}
        </Text>
      </CardHeader>
      <EasterPrizesGrid />
      <Box p="24px">
        <Text color="textSubtle" fontSize="14px">
          {t(
            'Prizes to be distributed in TABI and shared by all members of a tier. TABI price in USD to be determined on the day of distribution. Details below.',
          )}
        </Text>
      </Box>
    </StyledCard>
  )
}

export default EasterPrizesCard
