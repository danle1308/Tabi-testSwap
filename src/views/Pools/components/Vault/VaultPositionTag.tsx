import { Tag, TagProps, Text, SplitIcon, LockIcon, UnlockIcon, HotIcon, Box } from 'packages/uikit'
import { FlexGap, FlexGapProps } from 'components/Layout/Flex'
import Trans from 'components/Trans'
import { useTranslation } from 'contexts/Localization'
import { FC, ReactNode, useMemo } from 'react'
import { DeserializedLockedVaultUser } from 'state/types'
import { VaultPosition, getVaultPosition } from 'utils/cakePool'
import styled from 'styled-components'

const RounderTag = styled.div`
  border-radius: 25px;
  overflow: hidden;
  width: fit-content;
  color: #000;
`

const tagConfig: Record<VaultPosition, TagProps> = {
  [VaultPosition.None]: {},
  [VaultPosition.Flexible]: {
    variant: 'primary',
  },
  [VaultPosition.Locked]: {
    variant: 'primary',
  },
  [VaultPosition.LockedEnd]: {
    variant: 'primary',
    outline: true,
  },
  [VaultPosition.AfterBurning]: {
    variant: 'failure',
    outline: true,
  },
}
const iconConfig: Record<VaultPosition, any> = {
  [VaultPosition.None]: null,
  [VaultPosition.Flexible]: SplitIcon,
  [VaultPosition.Locked]: LockIcon,
  [VaultPosition.LockedEnd]: UnlockIcon,
  [VaultPosition.AfterBurning]: HotIcon,
}

const positionLabel: Record<VaultPosition, ReactNode> = {
  [VaultPosition.None]: '',
  [VaultPosition.Flexible]: <Trans>Flexible</Trans>,
  [VaultPosition.Locked]: <Trans>Locked</Trans>,
  [VaultPosition.LockedEnd]: <Trans>Locked End</Trans>,
  [VaultPosition.AfterBurning]: <Trans>After Burning</Trans>,
}

const VaultPositionTag: FC<{ position: VaultPosition }> = ({ position }) => {
  return (
    <RounderTag>
      <Tag {...tagConfig[position]}>
        <Box as={iconConfig[position]} mr="4px" />
        <Text as="span" color="BlackColor">
          {positionLabel[position]}
        </Text>
      </Tag>
    </RounderTag>
  )
}

export const VaultPositionTagWithLabel: FC<{ userData: DeserializedLockedVaultUser } & FlexGapProps> = ({
  userData,
  ...props
}) => {
  const { t } = useTranslation()

  const position = useMemo(() => getVaultPosition(userData), [userData])

  if (position) {
    return (
      <FlexGap alignItems="center" justifyContent="space-between" marginX="8px" mb="12px" gap="12px" {...props}>
        <Text fontSize="14px" color="WhiteColor">
          {t('My Position')}
        </Text>
        <VaultPositionTag position={position} />
      </FlexGap>
    )
  }

  return null
}
