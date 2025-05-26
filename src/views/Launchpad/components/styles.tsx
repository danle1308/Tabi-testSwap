import styled, { css } from 'styled-components'

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
