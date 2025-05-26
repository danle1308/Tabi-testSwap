import { Text, Flex, Image, Box } from 'packages/uikit'
import { BalanceWithLoading } from 'components/Balance'
// import Divider from 'components/Divider'
import { useTranslation } from 'contexts/Localization'
import getTokenLogoURL from 'utils/getTokenLogoURL'
import { StaticAmountPropsType } from '../types'

const StaticAmount: React.FC<StaticAmountPropsType> = ({
  stakingSymbol,
  stakingAddress,
  lockedAmount,
  usdValueStaked,
}) => {
  const { t } = useTranslation()

  return (
    <>
      <Flex alignItems="center" justifyContent="space-between" mb="16px">
        <Text color="WhiteColorLight" fontSize="14px">
          {t('Add TABI to lock')}
        </Text>
        <Flex alignItems="center" minWidth="70px">
          <Image src={getTokenLogoURL(stakingAddress)} width={24} height={24} alt={stakingSymbol} />
          <Text ml="4px" bold>
            {stakingSymbol}
          </Text>
        </Flex>
      </Flex>
      <Box>
        <BalanceWithLoading color="WhiteColorLight" fontSize="18px" value={lockedAmount} decimals={2} />
        {/* <BalanceWithLoading
          value={usdValueStaked}
          fontSize="12px"
          color="WhiteColorLight"
          decimals={2}
          prefix="~"
          unit=" USD"
        /> */}
      </Box>

      {/* <Divider /> */}
    </>
  )
}

export default StaticAmount
