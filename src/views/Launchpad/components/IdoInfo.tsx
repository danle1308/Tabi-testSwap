/* eslint-disable @typescript-eslint/no-unused-vars */
import styled from 'styled-components'
import { Flex, Text, Skeleton, Input, RefreshIcon, AutoRenewIcon, CopyIcon } from 'packages/uikit'
import { useTranslation } from 'contexts/Localization'
import { FlexGap } from 'components/Layout/Flex'
import { BalanceWithLoading } from 'components/Balance'
import { VenusButton } from 'components/venuswap/components/ui'
import React, { FC, ReactElement } from 'react'
import { getTime, parse } from 'date-fns'
import useCountdown from 'hooks/useCountDown'
import getTimePeriods from 'utils/getTimePeriods'
import { Timer } from './Timer'
import { IdoContentWrapper } from './styles'

// const arraySkeleton = Array.from(new Array(4))
const address = '0x1Lbcfr7sAHTD9CgdQo3HTMTkV8LK4ZnX71'

type Info = {
  children?: ReactElement | string | null
  endIcon?: ReactElement | null
}

const InfoValue: FC<Info> = ({ children, endIcon }) => {
  return (
    <FlexGap gap="0">
      <Text bold pl="5px">
        {children}
      </Text>
      {React.isValidElement(endIcon)
        ? React.cloneElement(endIcon, {
            ml: '0.5em',
          })
        : null}
    </FlexGap>
  )
}

const IdoInfo = ({ info }) => {
  const TIME_STAMP_END_DAY = parse('2023-12-15', 'yyyy-mm-dd', new Date()).getTime()
  const { t } = useTranslation()
  const addressTokenEllipsis = address ? `${address.substring(0, 9)}...${address.substring(address.length - 5)}` : null
  const secondsRemaining = useCountdown(TIME_STAMP_END_DAY)
  const { days, hours, minutes, seconds } = getTimePeriods(secondsRemaining)

  return (
    <IdoContentWrapper>
      <StyledInfo flexDirection="column">
        {/* {typeof info !== undefined ? (
        arraySkeleton.map((i) => <Skeleton key={i} width="100%" height="25px" />)
      ) : ( */}
        <>
          <InfoHeader justifyContent="space-between">
            <FlexGap flexDirection="column" gap="0">
              <Text>{t('Total Raise')}</Text>
              <Text fontSize="30px" color="venusMainColor">
                {info?.raise || '50 ETH'}
              </Text>
            </FlexGap>

            <CoinIcon alignItems="flex-start">
              <img src={info?.icon || '/images/venus/svgs/zetachain-icon.svg'} alt="ido-icon" />
            </CoinIcon>
          </InfoHeader>

          <FillerDotInfo justifyContent="space-between">
            <Fillter />
            <Text pr="5px">Swap Rate</Text>

            <InfoValue endIcon={<AutoRenewIcon />}>1 ETH = 720,000 ETV</InfoValue>
          </FillerDotInfo>

          <FillerDotInfo justifyContent="space-between">
            <Fillter />
            <Text pr="5px">Max Allocation</Text>

            <InfoValue>2 ETH</InfoValue>
          </FillerDotInfo>

          <FillerDotInfo justifyContent="space-between">
            <Fillter />
            <Text pr="5px">IDO Date</Text>

            <InfoValue>12 Nov,2023 11:00 UTC</InfoValue>
          </FillerDotInfo>

          <FillerDotInfo justifyContent="space-between">
            <Fillter />
            <Text pr="5px">Listing Date</Text>

            <InfoValue>15 Nov,2023 11:00 UTC</InfoValue>
          </FillerDotInfo>

          <FillerDotInfo justifyContent="space-between">
            <Fillter />
            <Text pr="5px">Network</Text>

            <InfoValue>ETHchain</InfoValue>
          </FillerDotInfo>

          <FillerDotInfo justifyContent="space-between">
            <Fillter />
            <Text pr="5px">Contract Token</Text>

            <InfoValue endIcon={<CopyIcon />}>{addressTokenEllipsis}</InfoValue>
          </FillerDotInfo>

          <Line />

          <Flex alignSelf="flex-end">
            <Text color="venusWhiteColorLight" small>
              {t('Balance')}:{' '}
            </Text>
            <BalanceWithLoading color="venusWhiteColorLight" small value={0} decimals={2} />
            <Text color="venusWhiteColorLight" small>
              {t('ETH')}
            </Text>
          </Flex>

          <InputWrapper>
            <Input
              placeholder="Enter in ETH amount"
              scale="lg"
              style={{ background: 'none', border: 'none', borderRadius: '8px' }}
            />
            <StyledButton>{t('Buy Token')}</StyledButton>
          </InputWrapper>

          <Flex width="100%" alignItems="center">
            <Text bold style={{ whiteSpace: 'nowrap' }}>
              {secondsRemaining <= 0 ? t('End In') : t('Starts In')}
            </Text>

            <Timer days={days} hours={hours} minutes={minutes} seconds={seconds} />
          </Flex>
        </>
        {/* )} */}
      </StyledInfo>
    </IdoContentWrapper>
  )
}

export default IdoInfo

const StyledInfo = styled(Flex)`
  width: 100%;
`

const InfoHeader = styled(Flex)`
  width: 100%;
`

export const FillerDotInfo = styled(Flex)`
  position: relative;
  width: 100%;

  & > * {
    position: relative;
    background: ${({ theme }) => theme.colors.dropdownDeep};
    color: #fbfbfb;
  }
`

export const Fillter = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  bottom: 1px;
  transform: translateY(-50%);
  border-bottom: 2px dotted #fbfbfb;
  height: 50%;
  color: #fbfbfb;
`

export const CoinIcon = styled(Flex)`
  img {
    width: 40px;
    aspect-ratio: 1/1;
  }
`

export const Line = styled.div`
  width: 100%;
  height: 2px;
  background: #9b9c9f;
  margin: 8px 0;
`

export const InputWrapper = styled(Flex)`
  position: relative;
  padding: 8px 8px 8px 8px;
  min-height: 52px;
  background-color: ${({ theme }) => theme.colors.venusBlackColor};
  border-radius: 8px;

  & > ${Input} {
    background-color: none !important;
    border: none !important;

    &::placeholder {
      font-size: 12px;
    }

    &:focus {
      box-shadow: none;
    }
  }
`

export const StyledInput = styled(Input)``

export const StyledButton = styled(VenusButton.VenusStyledActionButton)`
  white-space: nowrap;
`
