import { Pair } from '@tabi-dex/sdk'
import { Fragment } from 'react'
import { Text, Button, Box } from 'packages/uikit'
import { FlexGap } from 'components/Layout/Flex'
import { NextLinkFromReactRouter } from 'components/NextLink'
import { View } from 'views/Pool'
// import useDragScroll from 'hooks/useDragScroll'
import { TableContainer, TableHeader, TableBody } from './styles'
import { columns, columnsAccount } from './constants'
import Pool from './Pool'

const MainTable = ({ pools, view }) => {
  // const { ref, onMouseDown, onMouseMove, onTouchStart, onTouchMove, onMouseLeave, onMouseUp, onTouchEnd } =
  //   useDragScroll()

  const columnsDisplay = view === View.ALL_POSITION ? columns : columnsAccount

  if (pools.length > 0) {
    return (
      <Box
        // ref={ref}
        className="scroll-container"
        // onMouseDown={onMouseDown}
        // onMouseMove={onMouseMove}
        // onTouchStart={onTouchStart}
        // onTouchMove={onTouchMove}
        // onMouseLeave={onMouseLeave}
        // onMouseUp={onMouseUp}
        // onTouchEnd={onTouchEnd}
        style={{
          overflowX: 'auto',
          whiteSpace: 'nowrap',
          cursor: 'grab',
          userSelect: 'none',
          width: '100%',
        }}
      >
        <TableContainer>
          <TableHeader>
            <th>
              <Text fontSize={[14, , , , 14]} fontWeight="700">
                #
              </Text>
            </th>
            {columnsDisplay.map((col) => (
              <th key={col}>
                <th>
                  <Text fontSize={[14, , , , 14]} fontWeight="700" padding={['20px 20px']} color="white" ellipsis>
                    {col}
                  </Text>
                </th>
              </th>
            ))}
          </TableHeader>
          <TableBody>
            {pools.map((v2Pair: Pair, index: number) => {
              const id = index + 1

              return (
                <Fragment key={id}>
                  <Pool pair={v2Pair} view={view} index={index} />
                </Fragment>
              )
            })}
          </TableBody>
        </TableContainer>
      </Box>
    )
  }
  return null
}

export default MainTable
