import { useEffect, useState } from 'react'
import { useWeb3React } from '@web3-react/core'
import styled from 'styled-components'
import {
  Modal,
  Text,
  Flex,
  Image,
  Button,
  Slider,
  BalanceInput,
  AutoRenewIcon,
  Link,
  CalculateIcon,
  IconButton,
  Skeleton,
  ModalBody,
  InjectedModalProps,
} from 'packages/uikit'
import { useTranslation } from 'contexts/Localization'
import useTheme from 'hooks/useTheme'
import useToast from 'hooks/useToast'
import { DeserializedPool } from 'state/types'
import { useAppDispatch } from 'state'
import { getInterestBreakdown } from 'utils/compoundApyHelpers'
import getTokenLogoURL from 'utils/getTokenLogoURL'
import { UIButton } from 'components/TabiSwap/components/ui'
import { RowBetween } from 'components/Layout/Row'
import { AutoColumn } from 'components/Layout/Column'
import { useRouter } from 'next/router'
import CardOfList from './CardOfList'

interface ListModalProps {
  // isBnbPool: boolean
  pool: DeserializedPool[]
  onDismiss?: InjectedModalProps
}

const ListModal: React.FC<ListModalProps> = ({
  // isBnbPool,
  pool,
  onDismiss,
}) => {
  // const { sousId, stakingToken, earningTokenPrice, apr, userData, stakingLimit, earningToken } = pool
  const { account } = useWeb3React()
  const { t } = useTranslation()
  const { theme } = useTheme()

  const router = useRouter()

  const handleClick = (id: number) => {
    router.push(`/stake/${id}`)
    onDismiss?.()
  }

  return (
    <Modal
      minWidth="458px"
      title={t('All Pools')}
      textScale="lg"
      onDismiss={onDismiss}
      hideCloseButton
      headerBackground={theme.colors.gradients.cardHeader}
    >
      <AutoColumn>
        {pool.map((pools) => (
          <>
            <Flex padding="0 0 1rem 0">
              <CardOfList pool={pools} account={account} onClick={() => handleClick(pools.sousId)} />
            </Flex>
          </>
        ))}
      </AutoColumn>
    </Modal>
  )
}

export default ListModal
