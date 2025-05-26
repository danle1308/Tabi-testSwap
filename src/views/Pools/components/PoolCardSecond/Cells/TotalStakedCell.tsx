import { useMemo } from 'react'
import { Flex, Skeleton, Text } from 'packages/uikit'
import styled from 'styled-components'
import { useTranslation } from 'contexts/Localization'
import Balance from 'components/Balance'
import { DeserializedPool } from 'state/types'
import { useVaultPoolByKey } from 'state/pools/hooks'
import { getBalanceNumber } from 'utils/formatBalance'
import { CurrencyLogo } from 'components/Logo'
import BaseCell, { CellContent } from './BaseCell'

interface TotalStakedCellProps {
  pool: DeserializedPool
}

const StyledCell = styled(BaseCell)`
  /* flex: 2 0 100px; */
  padding: 0px;
`

const ColorBalance = styled(Balance)`
  color: black;
  font-weight: 700;
`

const TotalStakedCell: React.FC<TotalStakedCellProps> = ({ pool }) => {
  const { t } = useTranslation()
  const { stakingToken, totalStaked, vaultKey } = pool
  const { totalCakeInVault } = useVaultPoolByKey(vaultKey)

  const totalStakedBalance = useMemo(() => {
    if (vaultKey) {
      return getBalanceNumber(totalCakeInVault, stakingToken.decimals)
    }

    return getBalanceNumber(totalStaked, stakingToken.decimals)
  }, [vaultKey, totalCakeInVault, totalStaked, stakingToken.decimals])

  return (
    <StyledCell role="cell">
      <CellContent>
        <Text fontSize={['14px']} color="var(--color-grey-border-input)" textAlign="left">
          {t('Your Total Staked:')}
        </Text>
        {totalStaked && totalStaked.gte(0) ? (
          <Flex
            height="37px"
            alignItems="center"
            justifyContent="center"
            style={{ background: '#00000047', borderRadius: '5px' }}
          >
            <CurrencyLogo currency={stakingToken} size="18px" />
            <ColorBalance
              fontSize={['18px']}
              value={totalStakedBalance}
              decimals={0}
              unit={` ${stakingToken.symbol}`}
            />
          </Flex>
        ) : (
          <Skeleton width="80px" height="16px" />
        )}
      </CellContent>
    </StyledCell>
  )
}

export default TotalStakedCell
