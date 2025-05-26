import { Text } from 'packages/uikit'

const ShareCell = ({ share }) => {
  return (
    <Text value={share} fontSize={[12, , , , 14]} fontWeight="400" color="white">
      {share}
    </Text>
  )
}

export default ShareCell
