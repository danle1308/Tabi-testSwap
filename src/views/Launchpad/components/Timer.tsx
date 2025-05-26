import { FlexGap } from 'components/Layout/Flex'
import { TimeSquade } from './TimeSquade'

export const Timer = ({ days, hours, minutes, seconds }) => {
  return (
    <FlexGap ml="auto" width="100%" alignItems="center" justifyContent="flex-end">
      {days !== 0 ? <TimeSquade time={days} /> : null}
      <TimeSquade time={hours} />
      <TimeSquade time={minutes} />
      <TimeSquade time={seconds} />
    </FlexGap>
  )
}
