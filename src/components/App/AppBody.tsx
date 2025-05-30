import styled from 'styled-components'
import { Card } from 'packages/uikit'

export const BodyWrapper = styled(Card)`
  width: 100%;
  z-index: 1;
`

/**
 * The styled container element that wraps the content of most pages and the tabs.
 */
export default function AppBody({ children }: { children: React.ReactNode }) {
  return <BodyWrapper>{children}</BodyWrapper>
}
