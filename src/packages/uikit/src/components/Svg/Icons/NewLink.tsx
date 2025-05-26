import React from 'react'
import Svg from '../Svg'
import { SvgProps } from '../types'

const Icon: React.FC<SvgProps> = (props) => {
  return (
    <Svg {...props} viewBox="0 0 9 9" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M8 8H1V1H4.5V0H1C0.445 0 0 0.45 0 1V8C0 8.55 0.445 9 1 9H8C8.55 9 9 8.55 9 8V4.5H8V8ZM5.5 0V1H7.295L2.38 5.915L3.085 6.62L8 1.705V3.5H9V0H5.5Z"
        fill="black"
      />
    </Svg>
  )
}

export default Icon
