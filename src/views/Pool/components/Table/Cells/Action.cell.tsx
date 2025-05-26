import { FlexGap } from 'components/Layout/Flex'
import { NextLinkFromReactRouter } from 'components/NextLink'
import { Box, Button, Flex, Link, useModal } from 'packages/uikit'
import { currencyId } from 'utils/currencyId'
import styled from 'styled-components'
import { View } from 'views/Pool'
import StakeModal from '../../StakeLP/StakeModol'

const ActionButton = styled(Button).attrs({
  height: ['30px', , , , '35px'],
  width: '100%',
  px: [16],
  fontSize: [10, , , , 14],
})`
  background: #fe0034;
  box-shadow: none;
  box-shadow: none;
  color: white;
  font-weight: 500;
  white-space: nowrap;
  border-radius: 5px;
  border: 0.5px solid var(--color-white-50);

  &.pancake-button--disabled {
    box-shadow: none;
    color: #ffffff;
  }
`

const RestyledLink = styled(Link)`
  width: 100%;

  :hover {
    text-decoration: none;
  }
`

const ActionCell = ({ currency0, currency1, view }) => {
  const [onPresentExpertModal] = useModal(
    <StakeModal currency0={currencyId(currency0)} currency1={currencyId(currency1)} onDismiss={onDismiss} />,
  )
  return (
    <>
      <FlexGap gap="0.5rem" width="100%">
        <Box style={{ width: '100%' }}>
          <ActionButton onClick={onPresentExpertModal}>Add Liquidity</ActionButton>
        </Box>
        <RestyledLink href="/#">
          <ActionButton disabled>Stake</ActionButton>
        </RestyledLink>
      </FlexGap>
    </>
  )
}

export default ActionCell
function onDismiss(): void {
  throw new Error('Function not implemented.')
}
