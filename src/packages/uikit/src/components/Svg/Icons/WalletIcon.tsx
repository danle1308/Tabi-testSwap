import React from 'react'
import Svg from '../Svg'
import { SvgProps } from '../types'

const Icon: React.FC<SvgProps> = (props) => {
  return (
    <Svg {...props} viewBox="0 0 10 9" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M9.47368 7.5V8C9.47368 8.55 9 9 8.42105 9H1.05263C0.468421 9 0 8.55 0 8V1C0 0.45 0.468421 0 1.05263 0H8.42105C9 0 9.47368 0.45 9.47368 1V1.5H4.73684C4.15263 1.5 3.68421 1.95 3.68421 2.5V6.5C3.68421 7.05 4.15263 7.5 4.73684 7.5H9.47368ZM4.73684 6.5H10V2.5H4.73684V6.5ZM6.84211 5.25C6.40526 5.25 6.05263 4.915 6.05263 4.5C6.05263 4.085 6.40526 3.75 6.84211 3.75C7.27895 3.75 7.63158 4.085 7.63158 4.5C7.63158 4.915 7.27895 5.25 6.84211 5.25Z"
        fill="#737373"
      />
    </Svg>
  )
}

export default Icon
