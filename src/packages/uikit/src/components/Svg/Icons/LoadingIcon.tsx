import React from 'react'
import Svg from '../Svg'
import { SvgProps } from '../types'

const Icon: React.FC<SvgProps> = (props) => {
  return (
    <Svg {...props} viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12.5" cy="12.5" r="10.5" stroke="url(#paint0_linear_4425_3090)" strokeWidth="4" fill="transparent" />
      <defs>
        <linearGradient id="paint0_linear_4425_3090" x1="12.5" y1="0" x2="12.5" y2="25" gradientUnits="userSpaceOnUse">
          <stop stopColor="#737373" />
          <stop offset="1" stopColor="#D9D9D9" />
        </linearGradient>
      </defs>
    </Svg>
  )
}

export default Icon
