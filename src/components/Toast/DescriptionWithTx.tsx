import { Flex, Link, OpenNewIcon, Text } from 'packages/uikit'
import { getBscScanLink } from 'utils'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { useTranslation } from 'contexts/Localization'
import truncateHash from 'utils/truncateHash'
import styled from 'styled-components'

interface DescriptionWithTxProps {
  description?: string
  txHash?: string
}

const ToastDesc = styled(Text)`
  color: rgba(255, 255, 255, 0.8);
`

const ToastLinkDesc = styled(Link).attrs({ fontSize: [14] })`
  color: rgba(255, 255, 255, 0.8);
`

const DescriptionWithTx: React.FC<DescriptionWithTxProps> = ({ txHash, children }) => {
  const { chainId } = useActiveWeb3React()
  const { t } = useTranslation()

  return (
    <>
      {typeof children === 'string' ? <ToastDesc as="p">{children}</ToastDesc> : children}
      {txHash && (
        <Flex flexDirection="column" style={{ gap: '0' }}>
          <Text fontSize={[14]}>{t('View on Explorer')}:</Text>
          <ToastLinkDesc external href={getBscScanLink(txHash, 'transaction', chainId)}>
            {truncateHash(txHash, 8, 16)} <OpenNewIcon width="16px" ml="3px" />
          </ToastLinkDesc>
        </Flex>
      )}
    </>
  )
}

export default DescriptionWithTx
