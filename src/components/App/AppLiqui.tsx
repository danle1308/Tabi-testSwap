import styled from 'styled-components'
import { Card } from 'packages/uikit'

export const BodyWrapperLiqui = styled(Card)`
  background-repeat: no-repeat;
  background-size: cover;
  min-width: 640px;
  min-height: 415px;
`

/**
 * The styled container element that wraps the content of most pages and the tabs.
 */
export default function AppLiqui({ children }: { children: React.ReactNode }) {
  return <BodyWrapperLiqui>{children}</BodyWrapperLiqui>
}
