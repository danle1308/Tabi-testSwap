import styled from 'styled-components'
import { Box } from 'packages/uikit'
import Container from '../Layout/Container'
import { PageHeaderProps } from './types'

const Outer = styled(Box)<{ background?: string }>`
  background: linear-gradient(92.29deg, #ffc998 0.69%, #fe9655 40.26%, #ff833d 57.22%, #fcc6a8 88.01%);
  max-width: 1080px;
  margin: 40px auto;
  border-radius: 20px;
`

const Inner = styled(Container)`
  padding-top: 32px;
  padding-bottom: 32px;
`

const PageHeader: React.FC<PageHeaderProps> = ({ background, children, ...props }) => (
  <Outer background={background} {...props}>
    <Inner>{children}</Inner>
  </Outer>
)

export default PageHeader
