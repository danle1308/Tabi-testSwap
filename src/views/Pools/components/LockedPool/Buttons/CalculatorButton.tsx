import { useContext } from 'react'
import { IconButton, CalculateIcon } from 'packages/uikit'

import { RoiCalculatorModalContext } from '../Modals/RoiCalculatorModalProvider'

const CalculatorButton = () => {
  const setShowRoiCalculator = useContext(RoiCalculatorModalContext)

  return (
    <IconButton variant="text" scale="sm" mr="-8px" onClick={() => setShowRoiCalculator && setShowRoiCalculator(true)}>
      <CalculateIcon color="MainColor" width="18px" />
    </IconButton>
  )
}

export default CalculatorButton
