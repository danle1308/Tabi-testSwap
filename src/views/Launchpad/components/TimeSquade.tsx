import { FC } from 'react'
import { Text } from 'packages/uikit'
import styled from 'styled-components'

export const TimeSquade: FC = ({ time }) => {
  return (
    <StyledTimeSquade>
      <Text color="venusWhiteColor" fontSize="24px">
        {time}
      </Text>
    </StyledTimeSquade>
  )
}

const StyledTimeSquade = styled.div`
  max-width: 40px;
  height: 100%;
  max-height: 42px;
  aspect-ratio: 1/1.05;
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
  position: relative;

  &:before {
    content: '';
    background: url('/images/venus/svgs/time-bg.svg') no-repeat;
    background-size: cover;

    position: absolute;
    width: 100%;
    height: 100%;
  }

  &:after {
    content: '';
    background: url('/images/venus/svgs/time-line-bg.svg') no-repeat;
    width: calc(100% - 4px);
    height: 2px;

    position: absolute;
    right: 2px;
    top: 50%;
    left: 2px;
    transform: translateY(-50%);
  }
`
