import React from 'react'
import Svg from '../Svg'
import { SvgProps } from '../types'

interface LogoProps extends SvgProps {
  isDark: boolean
}

const NewArrowDown: React.FC<LogoProps> = ({ isDark, ...props }) => {
  const textColor = isDark ? '#FFFFFF' : '#000000'
  return (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      width="8"
      height="5"
      fill="none"
      viewBox="0 0 8 5"
      style={{ marginBottom: '3px', marginLeft: '3px' }}
    >
      <path
        fill="#000"
        d="M.71 1.872l2.59 2.59a.996.996 0 001.41 0l2.59-2.59c.63-.63.18-1.71-.71-1.71H1.41c-.89 0-1.33 1.08-.7 1.71z"
      />
    </Svg>
  )
}

export default React.memo(NewArrowDown, (prev, next) => prev.isDark === next.isDark)
