import Trans from 'components/Trans'
import { Flex, Text } from 'packages/uikit'
import styled from 'styled-components'

const ImageGroup = ({ src = '/images/svgs/footer-logo.svg', name = 'TabiSwap', ...props }) => {
  return (
    <StyledImageGr {...props} justifyConten="center" flexDirection="column" alignItems="center">
      <img src={src} alt="" />
      <Text fontSize="25px" fontWeight="800">
        <Trans>{name}</Trans>
      </Text>
    </StyledImageGr>
  )
}

export default ImageGroup

const StyledImageGr = styled(Flex)`
  & > img {
    max-width: 100px;
    width: 100%;
    height: auto;
  }
`
