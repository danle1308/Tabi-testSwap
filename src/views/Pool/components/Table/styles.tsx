import styled from 'styled-components'

export const TableContainer = styled.table`
  width: 100%;
  ${({ theme }) => theme.mediaQueries.xs} {
    /* border-radius: 15px;
    border: 0.5px solid var(--color-white-50); */
  }
  ${({ theme }) => theme.mediaQueries.md} {
  }
`

export const TableHeader = styled.thead`
  z-index: 9;
  top: 0;
  width: 100%;
  border-bottom: 0.5px solid var(--color-white-50);
`

export const TableBody = styled.tbody`
  & tr {
    & td {
      padding: 12px 0 16px 23px;
      vertical-align: middle;

      &:first-child {
        padding: 12px 20px 16px 20px;
      }

      &:last-child {
        padding: 12px 20px 16px 20px;
      }
    }
  }
`
