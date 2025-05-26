import { Box, Flex, Modal, ModalHeader, ModalTitle, useMatchBreakpoints } from 'packages/uikit'
import styled from 'styled-components'
import { useState } from 'react'
import RemoveLiquidityModol from 'views/RemoveLiquidityModol'
import Modals from 'packages/uikit/src/widgets/Modal/Modals'
import AddLiquidityModol from 'views/AddLiquidityModol'

// Tab buttons
const TabButton = styled.button<{ active?: boolean }>`
  padding: 8px 16px;
  font-size: 20px;
  font-weight: 500;
  color: ${({ active }) => (active ? 'white' : 'white')};
  background: ${({ active }) => (active ? 'none' : '#73737369')};
  border: none;
  border-bottom: 0.5px solid ${({ active }) => (active ? '#FE0034' : 'var(--color-white-50)')};
  /* border-left: 0.5px solid ${({ active }) => (active ? '' : 'var(--color-white-50)')};
  border-right: 0.5px solid ${({ active }) => (active ? 'var(--color-white-50)' : '')}; */
  cursor: pointer;
  width: 50%;
  &:hover {
    /* color: white; */
  }
  ${({ theme }) => theme.mediaQueries.xs} {
    font-size: 14px;
    font-weight: 500;
  }
  ${({ theme }) => theme.mediaQueries.md} {
    font-size: 20px;
    font-weight: 500;
  }
`

const TabsContainer = styled.div`
  display: flex;
  justify-content: center;
  justify-content: space-around;
  min-height: 62px;
  height: 100%;
`

const ModalContent = styled.div`
  padding: 10px 20px 20px 20px;
`

const StakeModal = ({ currency0, currency1, onDismiss }) => {
  const [activeTab, setActiveTab] = useState<'add' | 'remove'>('add')
  const { isMobile } = useMatchBreakpoints()

  return (
    <Modals bodyPadding="0px" maxWidth={isMobile ? '300px' : '482px'}>
      <TabsContainer role="tablist">
        <TabButton
          role="tab"
          aria-selected={activeTab === 'add'}
          active={activeTab === 'add'}
          onClick={() => setActiveTab('add')}
        >
          Deposit
        </TabButton>
        <Box style={{ background: 'var(--color-white-50)', width: '0.5px', height: 'auto' }} />
        <TabButton
          role="tab"
          aria-selected={activeTab === 'remove'}
          active={activeTab === 'remove'}
          onClick={() => setActiveTab('remove')}
        >
          Withdraw
        </TabButton>
      </TabsContainer>
      <ModalContent>
        {activeTab === 'add' ? (
          <AddLiquidityModol currencyIdA={currency0} currencyIdB={currency1} />
        ) : (
          <RemoveLiquidityModol currencyIdA={currency0} currencyIdB={currency1} />
        )}
      </ModalContent>
    </Modals>
  )
}
export default StakeModal
