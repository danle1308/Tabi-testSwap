import React from 'react'
import Svg from '../Svg'
import { SvgProps } from '../types'

const Icon: React.FC<SvgProps> = (props) => {
  return (
    <Svg viewBox="0 0 12 12" {...props}>
      <path
        d="M6.66667 0H5.33333V6.66667H6.66667V0ZM9.88667 1.44667L8.94 2.39333C9.99333 3.24 10.6667 4.54 10.6667 6C10.6667 8.58 8.58 10.6667 6 10.6667C3.42 10.6667 1.33333 8.58 1.33333 6C1.33333 4.54 2.00667 3.24 3.05333 2.38667L2.11333 1.44667C0.82 2.54667 0 4.17333 0 6C0 9.31333 2.68667 12 6 12C9.31333 12 12 9.31333 12 6C12 4.17333 11.18 2.54667 9.88667 1.44667Z"
        fill="#FE0034"
      />
    </Svg>
  )
}

export default Icon
