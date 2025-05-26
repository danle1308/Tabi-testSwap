import { NextLinkFromReactRouter } from 'components/NextLink'
import ToggleView from 'components/ToggleView/ToggleView'
import { ViewMode } from 'state/user/actions'
import { useRouter } from 'next/router'
import styled from 'styled-components'
import { ButtonMenu, ButtonMenuItem, Toggle, Text, NotificationDot, Flex } from 'packages/uikit'
import { useTranslation } from 'contexts/Localization'

const ToggleWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-left: 0;

  ${({ theme }) => theme.mediaQueries.sm} {
    margin-left: 12px;
  }
`

const ViewControls = styled.div`
  flex-wrap: wrap;
  justify-content: space-between;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;

  > div {
    padding: 8px 0px;
  }

  & > ${Flex} {
    ${Text}:first-child {
      margin-left: 0;
    }
  }

  ${({ theme }) => theme.mediaQueries.sm} {
    justify-content: flex-start;
    align-items: flex-end;
    flex-direction: row;
    width: auto;

    > div {
      padding: 0;
    }
  }
`

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  a {
    padding-left: 12px;
    padding-right: 12px;
  }

  ${({ theme }) => theme.mediaQueries.sm} {
    margin-left: 16px;
  }
`

const ButtonActive = styled(ButtonMenu)`
  background: ${({ theme }) => theme.colors.WhiteColor};
  border-radius: 25px;
  overflow: hidden;
  gap: 0;
  padding: 2px;
`

const PoolTabButtons = ({ stakedOnly, setStakedOnly, hasStakeInFinishedPools, viewMode, setViewMode }) => {
  const router = useRouter()

  const { t } = useTranslation()

  const isExact = router.asPath === '/pools'

  const viewModeToggle = (
    <ToggleView idPrefix="clickPool" viewMode={viewMode} onToggle={(mode: ViewMode) => setViewMode(mode)} />
  )

  const liveOrFinishedSwitch = (
    <Wrapper>
      <ButtonActive activeIndex={isExact ? 0 : 1} scale="sm" variant="custom">
        <ButtonMenuItem as={NextLinkFromReactRouter} to="/pools" replace>
          {t('Live')}
        </ButtonMenuItem>
        <NotificationDot show={hasStakeInFinishedPools}>
          <ButtonMenuItem id="finished-pools-button" as={NextLinkFromReactRouter} to="/pools/history" replace>
            {t('Finished')}
          </ButtonMenuItem>
        </NotificationDot>
      </ButtonActive>
    </Wrapper>
  )

  const stakedOnlySwitch = (
    <ToggleWrapper>
      <Toggle checked={stakedOnly} onChange={() => setStakedOnly(!stakedOnly)} scale="md" />
      <Text color="WhiteColor" ml="8px">
        {' '}
        {t('Staked only')}
      </Text>
    </ToggleWrapper>
  )

  return (
    <ViewControls>
      {viewModeToggle}
      <Flex flexDirection="column">
        <Text textTransform="uppercase" ml="24px">
          {t('Filter by')}
        </Text>
        {stakedOnlySwitch}
      </Flex>
      {liveOrFinishedSwitch}
    </ViewControls>
  )
}

export default PoolTabButtons
