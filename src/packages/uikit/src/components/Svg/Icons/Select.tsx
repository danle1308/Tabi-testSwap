import React from 'react'
import Svg from '../Svg'
import { SvgProps } from '../types'

const Icon: React.FC<SvgProps> = (props) => {
  return (
    <Svg {...props} viewBox="0 0 4 6" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M0 0V6L4 3L0 0Z" fill="#FE0034" />
    </Svg>
  )
}

export default Icon
