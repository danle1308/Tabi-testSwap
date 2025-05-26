import React from 'react'
import Svg from '../Svg'
import { SvgProps } from '../types'

const Icon: React.FC<SvgProps> = (props) => {
  return (
    <Svg {...props} viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="10.5" cy="10.5" r="9.5" fill="black" stroke="white" strokeWidth="2" />
      <path
        d="M14.6969 11.3408H11.3369V14.7008H9.65687V11.3408H6.29688V9.66078H9.65687V6.30078H11.3369V9.66078H14.6969V11.3408Z"
        fill="white"
      />
    </Svg>
  )
}

export default Icon
