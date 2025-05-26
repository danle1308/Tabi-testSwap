import { useRef } from 'react'
import styled from 'styled-components'
import { useTable, Button, ArrowDropUpIcon, ColumnType, Text } from 'packages/uikit'
import { useTranslation } from 'contexts/Localization'

import Row, { RowProps } from './Row'

export interface ITableProps {
  data: RowProps[]
  columns: ColumnType<RowProps>[]
  userDataReady: boolean
  sortColumn?: string
}

const Container = styled.div`
  width: 100%;
  background: #060606;
  margin: 0px;
  border-radius: 15px;
  padding: 16px 24px 16px 24px;
  border: 0.5px solid var(--color-white-50);
`

const TableWrapper = styled.div`
  overflow: visible;
  scroll-margin-top: 64px;
  /* margin-bottom: 16px; */

  &::-webkit-scrollbar {
    display: none;
  }
`

const StyledTable = styled.table`
  border-collapse: collapse;
  font-size: 14px;
  border-radius: 16px;
  width: 100%;
  /* margin: 0 auto 16px auto; */
`

const TableBody = styled.tbody`
  & tr {
    &:first-child {
      &:hover {
        /* background-color: ${({ theme }) => theme.colors.InvertedContrastColor}; */
      }
    }

    td {
      font-size: 16px;
      vertical-align: middle;
    }
  }
`

const TableContainer = styled.div`
  position: relative;
`

const ScrollButtonContainer = styled.div`
  padding-top: 5px;
  padding-bottom: 5px;
`

const Line = styled.div`
  width: 100%;
  height: 1px;
  background-color: ${({ theme }) => theme.colors.WhiteColor};
`

const ScrollText = styled(Button)`
  color: ${({ theme }) => theme.colors.WhiteColor};
  font-weight: 500;
  background: unset;
  margin: auto;
  display: flex;
`

const FarmTable: React.FC<ITableProps> = (props) => {
  const tableWrapperEl = useRef<HTMLDivElement>(null)
  const { t } = useTranslation()
  const { data, columns, userDataReady } = props

  const { rows } = useTable(columns, data, { sortable: true, sortColumn: 'farm' })

  const scrollToTop = (): void => {
    tableWrapperEl.current.scrollIntoView({
      behavior: 'smooth',
    })
  }

  // console.log('rows', rows)

  return (
    <Container id="farms-table">
      <TableContainer id="table-container">
        <TableWrapper ref={tableWrapperEl}>
          <StyledTable>
            <TableBody>
              {rows.slice(0, 1).map((row) => {
                return <Row {...row.original} userDataReady={userDataReady} key={`table-row-${row.id}`} />
              })}
            </TableBody>
          </StyledTable>
        </TableWrapper>

        {/* <TableWrapper ref={tableWrapperEl}>
          <StyledTable>
            <TableBody>
              {rows.map((row) => {
                return <Row {...row.original} userDataReady={userDataReady} key={`table-row-${row.id}`} />
              })}
            </TableBody>
          </StyledTable>
        </TableWrapper>

        <TableWrapper ref={tableWrapperEl}>
          <StyledTable>
            <TableBody>
              {rows.map((row) => {
                return <Row {...row.original} userDataReady={userDataReady} key={`table-row-${row.id}`} />
              })}
            </TableBody>
          </StyledTable>
        </TableWrapper>

        <TableWrapper ref={tableWrapperEl}>
          <StyledTable>
            <TableBody>
              {rows.map((row) => {
                return <Row {...row.original} userDataReady={userDataReady} key={`table-row-${row.id}`} />
              })}
            </TableBody>
          </StyledTable>
        </TableWrapper> */}

        {/* <ScrollButtonContainer>
          <Line />
          <ScrollText onClick={scrollToTop}>
            {t('To Top')}
            <ArrowDropUpIcon color="WhiteColor" />
          </ScrollText>
        </ScrollButtonContainer> */}
      </TableContainer>
    </Container>
  )
}

export default FarmTable
