import React from 'react'
import Svg from '../Svg'
import { SvgProps } from '../types'

const Icon: React.FC<SvgProps> = (props) => {
  return (
    <Svg {...props} viewBox="0 0 23 23" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M11.5 0C5.152 0 0 5.152 0 11.5C0 17.848 5.152 23 11.5 23C17.848 23 23 17.848 23 11.5C23 5.152 17.848 0 11.5 0ZM9.2 17.25L3.45 11.5L5.0715 9.8785L9.2 13.9955L17.9285 5.267L19.55 6.9L9.2 17.25Z"
        fill="#14F194"
      />
    </Svg>
  )
}

export default Icon
