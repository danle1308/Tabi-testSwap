import { ReactElement } from 'react'
import styled from 'styled-components'
import { useTranslation } from 'contexts/Localization'
import { Box, LinkExternal } from 'packages/uikit'
import Container from 'components/Layout/Container'
import IfoLayout, { IfoLayoutWrapper } from './IfoLayout'
import IfoPoolVaultCard from './IfoPoolVaultCard'
import IfoQuestions from './IfoQuestions'

const IfoStepBackground = styled(Box)`
  background: ${({ theme }) => theme.colors.gradients.bubblegum};
`

interface TypeProps {
  ifoSection: ReactElement
  ifoSteps: ReactElement
}

const IfoContainer: React.FC<TypeProps> = ({ ifoSection, ifoSteps }) => {
  const { t } = useTranslation()

  return (
    <IfoLayout id="current-ifo" py={['24px', '24px', '40px']}>
      <Container>
        <IfoLayoutWrapper>
          <IfoPoolVaultCard />
          {ifoSection}
        </IfoLayoutWrapper>
      </Container>
      <IfoStepBackground>
        <Container>{ifoSteps}</Container>
      </IfoStepBackground>
      <Container>
        <IfoQuestions />
        <LinkExternal href="/" mx="auto" mt="16px">
          {t('Apply to run an IFO!')}
        </LinkExternal>
      </Container>
    </IfoLayout>
  )
}

export default IfoContainer
