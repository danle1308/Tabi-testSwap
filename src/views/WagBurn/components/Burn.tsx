import { BigNumber } from '@ethersproject/bignumber'
import { parseEther } from '@ethersproject/units'
import { useEffect, useState } from 'react'
import styled from 'styled-components'
import { IBurnInfo } from '..'

const Container = styled.div`
  width: 100%;
  height: 100%;
  background-color: white;
  padding: 12px;
  border-radius: 16px;
`

const Content = styled.div`
  border-radius: 16px;
  background-image: url(/images/burn/bg-burn.png);
  height: 100%;
  background-size: cover;
  background-position: center;
  text-align: center;
  display: flex;
  flex-direction: column;
`

const Title = styled.div`
  background-color: #de2549;
  border-radius: 37px;
  padding: 12px 24px;
  font-size: 36px;
  display: inline-block;
  font-weight: bold;
  margin: 26px auto;
  color: white;
`

const BurnContent = styled.div`
  margin: auto 24px;
  margin-top: 0;
  background-color: white;
  border: 1px solid #ff3323;
  border-radius: 4px;
  padding: 12px;
`

const NextBurnWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 24px;
  justify-content: center;
  margin: 24px 0;
`

const NextBurnLabel = styled.div`
  font-size: 60px;
  color: #1e1e1e;
  @media screen and (max-width: 1000px) {
    font-size: 48px;
  }

  @media screen and (max-width: 600px) {
    font-size: 40px;
  }

  @media screen and (max-width: 500px) {
    font-size: 32px;
  }
`

const WagImg = styled.img``

const TimerWrapper = styled.div`
  background-color: #c03f58;
  border: 1px solid #ff3323;
  padding: 16px;
  display: flex;
  align-items: center;
  margin-top: 24px;
`

const TimerItem = styled.div`
  flex: 1;
  text-align: center;
`

const TimerValue = styled.div`
  width: 100%;
  background-color: white;
  border-radius: 6px;
  color: #1e1e1e;
  font-size: 56px;
  padding: 32px 0;
`

const TimerLabel = styled.div`
  margin-top: 16px;
  color: white;
  font-size: 18px;
  font-weight: bold;
`

const TimerSeparator = styled.div`
  color: white;
  font-size: 36px;
  font-weight: bold;
  padding: 0 6px;
  padding-bottom: 40px;
`

const BottomBg = styled.div`
  margin-top: -36px;
  min-height: 100px;
  position: relative;
  overflow: hidden;

  @media screen and (max-width: 850px) {
    margin-top: -50px;
    min-height: 150px;
  }

  @media screen and (max-width: 850px) {
  }

  &::after {
    content: ' ';
    z-index: 11;
    position: absolute;
    left: -50px;
    right: -50px;
    top: 0;
    bottom: -50px;
    background-image: url(/images/burn/bg-bottom.png);
    background-size: contain;
    background-position: top;
    background-origin: bottom;
    background-repeat: no-repeat;

    @media screen and (max-width: 850px) {
      bottom: -100px;
    }

    @media screen and (max-width: 650px) {
      bottom: -50px;
      left: -100px;
      right: -100px;
    }
  }
`

interface IProps {
  burn: IBurnInfo
}

const formatWag = (amount: BigNumber) => amount.div(parseEther('1')).toNumber().toLocaleString('en-US')

const currentUnixTimestamp = () => Math.floor(Date.now() / 1000)

export const Burn = (props: IProps) => {
  const [target, setTarget] = useState(0)
  const [timestamp, setTimestamp] = useState(currentUnixTimestamp())

  const getTargetTime = () => {
    // 0h0m0s everyday
    const day = 24 * 60 * 60
    const curTimestamp = currentUnixTimestamp()
    const start_of_tomorrow = curTimestamp - (curTimestamp % day) + day

    return start_of_tomorrow
  }

  useEffect(() => {
    setTarget(getTargetTime())
  }, [props.burn.nextBurn.toString()])

  useEffect(() => {
    const interval = setInterval(() => {
      setTimestamp(currentUnixTimestamp())
    }, 1000)

    return () => {
      clearInterval(interval)
    }
  }, [])

  const { hour, min, sec } = (() => {
    let hour = 0,
      min = 0,
      sec = 0
    if (target > timestamp) {
      const duration = target - timestamp
      sec = duration % 60
      min = Math.floor(duration / 60) % 60
      hour = Math.floor(duration / 3600) % 24
    }

    return { hour, min, sec }
  })()

  return (
    <Container>
      <Content>
        <Title>NEXT BURN</Title>
        <BurnContent>
          <NextBurnWrapper>
            <NextBurnLabel>{formatWag(props.burn.nextBurn)}</NextBurnLabel>
            <WagImg src="/images/burn/wag.svg" />
          </NextBurnWrapper>
          <TimerWrapper>
            <TimerItem>
              <TimerValue>{hour.toString().padStart(2, '0')}</TimerValue>
              <TimerLabel>HOURS</TimerLabel>
            </TimerItem>
            <TimerSeparator>:</TimerSeparator>
            <TimerItem>
              <TimerValue>{min.toString().padStart(2, '0')}</TimerValue>
              <TimerLabel>MINS</TimerLabel>
            </TimerItem>
            <TimerSeparator>:</TimerSeparator>
            <TimerItem>
              <TimerValue>{sec.toString().padStart(2, '0')}</TimerValue>
              <TimerLabel>SECS</TimerLabel>
            </TimerItem>
          </TimerWrapper>
        </BurnContent>
        <BottomBg />
      </Content>
    </Container>
  )
}
