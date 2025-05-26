import React from 'react'
import Svg from '../Svg'
import { SvgProps } from '../types'

const Icon: React.FC<SvgProps> = (props) => {
  return (
    <Svg viewBox="0 0 10 15" {...props}>
      <path d="M9.2625 1.7625L7.5 0L0 7.5L7.5 15L9.2625 13.2375L3.5375 7.5L9.2625 1.7625Z" fill="white" />
    </Svg>
  )
}

export default Icon
