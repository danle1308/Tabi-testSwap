import { FlexGap } from 'components/Layout/Flex'
import { Text } from 'packages/uikit'
import DoubleLogoPool from 'components/Logo/DoubleLogoPool'
import Dots from 'components/Loader/Dots'

const PoolCell = ({ currency0, currency1 }) => {
  return (
    <FlexGap
      flexDirection={['column', , , , 'row']}
      gap="clamp(0.2rem, 1.5vw, 0.6rem)"
      alignItems={['flex-start', , , , 'center']}
    >
      <DoubleLogoPool currency0={currency0} currency1={currency1} size={20} />
      <Text fontSize={[12, , , , 14]} fontWeight="400" color="white">
        {!currency0 || !currency1 ? <Dots>{t('Loading')}</Dots> : `${currency0.symbol}/${currency1.symbol}`}
      </Text>
    </FlexGap>
  )
}

export default PoolCell
