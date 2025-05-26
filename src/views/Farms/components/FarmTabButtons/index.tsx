import styled from 'styled-components'
import { ButtonMenu, ButtonMenuItem, NotificationDot } from 'packages/uikit'
import { useTranslation } from 'contexts/Localization'
import { useRouter } from 'next/router'
import { NextLinkFromReactRouter } from 'components/NextLink'

interface FarmTabButtonsProps {
  hasStakeInFinishedFarms: boolean
}

const FarmTabButtons: React.FC<FarmTabButtonsProps> = ({ hasStakeInFinishedFarms }) => {
  const StyledButtonMenu = styled(ButtonMenu)`
    background: ${({ theme }) => theme.colors.WhiteColor};
    border-radius: 25px;
    overflow: hidden;
    height: 40px;
    gap: 0;
    padding: 2px;
  `

  const router = useRouter()
  const { t } = useTranslation()

  let activeIndex
  switch (router.pathname) {
    case '/farms':
      activeIndex = 0
      break
    case '/farms/history':
      activeIndex = 1
      break
    case '/farms/archived':
      activeIndex = 2
      break
    default:
      activeIndex = 0
      break
  }

  return (
    <Wrapper>
      <StyledButtonMenu activeIndex={activeIndex} variant="custom">
        <ButtonMenuItem as={NextLinkFromReactRouter} to="/farms">
          {t('Live')}
        </ButtonMenuItem>
        <NotificationDot show={hasStakeInFinishedFarms}>
          <ButtonMenuItem as={NextLinkFromReactRouter} to="/farms/history" id="finished-farms-button">
            {t('Finished')}
          </ButtonMenuItem>
        </NotificationDot>
      </StyledButtonMenu>
    </Wrapper>
  )
}

export default FarmTabButtons

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  gap: 5px;

  a {
    padding: 0 12px;
    height: 100%;
  }
`
