import { FlexGap } from 'components/Layout/Flex'
import { Text } from 'packages/uikit'
import { FC } from 'react'
import styled from 'styled-components'

type IText = {
  main: string
  sub: string
}

const LaunchpadTextBlock: FC<IText> = ({ main, sub }) => {
  return (
    <FlexGap flexDirection="column" gap="5px">
      <Title as="h2" bold color="MainColor">
        {main || 'TabiSwap'}
      </Title>
      <Text as="span">{sub || 'IDO Project'}</Text>
    </FlexGap>
  )
}

export default LaunchpadTextBlock

const Title = styled(Text)`
  font-size: 30px;
  line-height: 1.2;
`
