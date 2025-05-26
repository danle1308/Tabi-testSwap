import React from 'react'
import Link from './Link'
import { LinkProps } from './types'
import OpenNewIcon from '../Svg/Icons/OpenNew'
// import Links from '../Svg/Icons/links'

const LinkExternal: React.FC<LinkProps> = ({ children, widthIcon = '9px', heightIcon = '7px', ...props }) => {
  return (
    <Link external {...props}>
      {children}
      <OpenNewIcon width={widthIcon} height={heightIcon} color={props.color ? props.color : 'WhiteColor'} ml="4px" />
    </Link>
  )
}

export default LinkExternal
