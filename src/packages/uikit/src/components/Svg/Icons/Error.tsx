import React from 'react'
import Svg from '../Svg'
import { SvgProps } from '../types'

const Icon: React.FC<SvgProps> = (props) => {
  return (
    <Svg {...props} viewBox="0 0 23 23" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M11.5 0C5.152 0 0 5.152 0 11.5C0 17.848 5.152 23 11.5 23C17.848 23 23 17.848 23 11.5C23 5.152 17.848 0 11.5 0Z"
        fill="#FE0034"
      />
      <path
        d="M7.48913 6.70898L6.71094 7.48717L10.7244 11.5007L6.71094 15.5141L7.48913 16.2923L11.5026 12.2788L15.5161 16.2923L16.2943 15.5141L12.2808 11.5007L16.2943 7.48717L15.5161 6.70898L11.5026 10.7225L7.48913 6.70898Z"
        fill="white"
      />
    </Svg>
  )
}

export default Icon
