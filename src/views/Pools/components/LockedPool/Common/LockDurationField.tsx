import { Text, Flex, Button, Input, Box } from 'packages/uikit'
import styled from 'styled-components'
import { useTranslation } from 'contexts/Localization'
import _toNumber from 'lodash/toNumber'
import { secondsToWeeks, weeksToSeconds } from '../../utils/formatSecondsToWeeks'
import { LockDurationFieldPropsType } from '../types'

const DURATIONS = [1, 5, 10, 25, 52]

const StyledInput = styled(Input)`
  text-align: right;
  margin-right: 8px;
  border: 1px solid ${({ theme }) => theme.colors.MainColor};
  border-radius: 8px;
  background: rgba(50, 52, 54, 0.66);
  color: ${({ theme }) => theme.colors.WhiteColor};
  max-width: 183px;
`

const DurationButton = styled(Button)`
  border-radius: 8px;
`

const LockDurationField: React.FC<LockDurationFieldPropsType> = ({ duration, setDuration, isOverMax }) => {
  const { t } = useTranslation()

  return (
    <>
      <Box mb="16px">
        <Flex mb="8px">
          <Text fontSize="14px" color="WhiteColorLight">
            {t('Add')} {t('duration')}
          </Text>
        </Flex>
        <Flex flexWrap="wrap" justifyContent="space-between">
          {DURATIONS.map((week) => (
            <DurationButton
              key={week}
              onClick={() => setDuration(weeksToSeconds(week))}
              // mt="4px"
              // mr={['2px', '2px', '4px', '4px']}
              scale="sm"
              variant={weeksToSeconds(week) === duration ? 'duration' : 'button'}
            >
              {week}W
            </DurationButton>
          ))}
        </Flex>
      </Box>
      <Flex justifyContent="flex-start" alignItems="center" mb="8px">
        <StyledInput
          value={`${secondsToWeeks(duration)}W`}
          autoComplete="off"
          pattern="^[0-9]+$"
          inputMode="numeric"
          onChange={(e) => {
            const weeks = _toNumber(e?.target?.value)

            // Prevent large number input which cause NaN
            // Why 530, just want to avoid user get laggy experience
            // For example, allow user put 444 which they still get warning no more than 52
            if (e.currentTarget.validity.valid && weeks < 530) {
              setDuration(weeksToSeconds(_toNumber(e?.target?.value)))
            }
          }}
        />
        <Text>{t('Week')}</Text>
      </Flex>
      {isOverMax && (
        <Text fontSize="12px" textAlign="right" color="WhiteColorLight">
          {t('Total lock duration exceeds 52 weeks')}
        </Text>
      )}
    </>
  )
}

export default LockDurationField
