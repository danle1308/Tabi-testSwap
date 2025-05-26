import { Button, Flex, Modal, useModalContext, Text } from 'packages/uikit'
import { utils } from 'ethers'
import { PRESALE_ADDRESS, SUGGESTED_BASES } from 'config/constants'
import { useState, useCallback } from 'react'
import styled from 'styled-components'
import { CHAIN_ID } from 'config/constants/networks'
import { ColumnCenter } from 'components/Layout/Column'
import { useTransactionAdder } from 'state/transactions/hooks'
import { UIButton } from 'components/TabiSwap/components/ui'
import useToast from 'hooks/useToast'
import { useCampaign, useClaimable } from '../hooks/useCampaign'

interface ClaimModalProps {
  account: string
}

type Steps = 'preview' | 'transfer' | 'completed'

const Wrapper = styled.div`
  width: 100%;
`
const ConfirmedIcon = styled(ColumnCenter)`
  padding: 24px 0;
`

const ClaimModal: React.FC<ClaimModalProps> = (props) => {
  const { account } = props
  const [step, setStep] = useState<Steps>('preview')
  const { onDismiss } = useModalContext()
  const addTransaction = useTransactionAdder()
  const campaignInstance = useCampaign(PRESALE_ADDRESS[CHAIN_ID])
  const claimAmount = useClaimable(PRESALE_ADDRESS[CHAIN_ID], account)
  const tokenSale = SUGGESTED_BASES[CHAIN_ID][1]
  const { toastError } = useToast()

  const formatAmount = useCallback((_amount: string | number) => {
    const number = typeof _amount === 'string' ? utils.formatUnits(_amount) : _amount
    return new Intl.NumberFormat('en-US', { maximumSignificantDigits: 3, notation: 'compact' }).format(number)
  }, [])

  const handleHarvest = async () => {
    try {
      const tx = await campaignInstance.claimAll()
      setStep('transfer')
      addTransaction(tx, {
        summary: `Harvest ${formatAmount(claimAmount.data?.toString())} to ${tokenSale?.symbol}`,
      })
      await tx?.wait(1)
      setStep('completed')
    } catch (error) {
      toastError(error?.data?.message)
      handleDismiss()
    }
  }

  const handleDismiss = () => {
    onDismiss()
  }

  const preview = (
    <>
      <Flex flexDirection="column">
        <Text>You will get</Text>
        <Text>
          {formatAmount(claimAmount.data?.toString())} {tokenSale?.symbol}
        </Text>
      </Flex>
      <UIButton.UIStyledActionButton style={{ flexGrow: 1 }} onClick={handleHarvest}>
        Confirm
      </UIButton.UIStyledActionButton>
    </>
  )

  const transferCompleted = (
    <>
      <Text>Received successful</Text>
      <Button onClick={handleDismiss} variant="secondary">
        Close
      </Button>
    </>
  )

  const waitingForTransfer = (
    <>
      <Flex justifyContent="center">
        <Wrapper>
          <ConfirmedIcon>
            <img src="/images/loading_TabiSwap.gif" alt="animation" />
          </ConfirmedIcon>
        </Wrapper>
      </Flex>
      <Text>Processing Transaction</Text>
    </>
  )

  const steps = {
    preview,
    transfer: waitingForTransfer,
    completed: transferCompleted,
  }

  return (
    <Modal title="Claim Tokens" onDismiss={handleDismiss} minWidth="min(100vw, 426px)">
      <Flex flexDirection="column" alignItems="stretch" style={{ gap: '1em' }}>
        {steps[step]}
      </Flex>
    </Modal>
  )
}

export default ClaimModal
