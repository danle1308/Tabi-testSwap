import { Text, Flex } from 'packages/uikit'
import isUndefinedOrNull from 'utils/isUndefinedOrNull'
import CrossText from './CrossText'

interface DiffTextPropsType {
  value: string
  newValue?: string
}

const DiffText: React.FC<DiffTextPropsType> = ({ value, newValue }) => {
  if (isUndefinedOrNull(newValue) || isUndefinedOrNull(value) || value === newValue) {
    return <Text fontSize="14px">{value || '-'}</Text>
  }

  return (
    <>
      <CrossText fontSize="14px" mr="4px">
        {value}
      </CrossText>
      <Text color="WhiteColorLight">{`->`}</Text>
      <Text color="WhiteColorLight" ml="4px" fontSize="14px">
        {newValue}
      </Text>
    </>
  )
}

interface TextRowPropsType extends DiffTextPropsType {
  title: string
}

const TextRow: React.FC<TextRowPropsType> = ({ title, value, newValue }) => (
  <Flex alignItems="center" justifyContent="space-between">
    <Text color="WhiteColor" fontSize="14px">
      {title}
    </Text>
    <Flex alignItems="center">
      <DiffText value={value} newValue={newValue} />
    </Flex>
  </Flex>
)

export default TextRow
