import styled, { css } from 'styled-components'
// import { Flex } from 'packages/uikit'
import { FlexGap } from 'components/Layout/Flex'

export const Main = styled.main`
  padding: 36px;
  min-height: 100vh;

  width: 100%;
  max-width: 1364px;
  margin: auto;
`

export const IdoBanner = styled.div`
  width: 100%;
  max-width: 812px;
  height: auto;
  border-radius: 8px;
  aspect-ratio: 7/4;
  overflow: hidden;
`

export const IdoRightSection = styled(FlexGap)`
  flex-basis: 812px;
`

export const IdoLeftSection = styled(FlexGap)`
  flex: 1;
`

export const IdoContentWrapper = styled.div`
  width: 100%;
  height: fit-content;
  position: relative;
  background: ${({ theme }) => theme.colors.dropdownDeep};
  border-radius: 8px;
  padding: 24px;

  ${({ padding }: { padding: string }) =>
    padding &&
    css`
      padding: ${padding};
    `}
`
