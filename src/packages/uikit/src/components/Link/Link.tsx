import React from 'react'
import styled from 'styled-components'
import getExternalLinkProps from '../../util/getExternalLinkProps'
import Text from '../Text/Text'
import { LinkProps } from './types'

const StyledLink = styled(Text)<LinkProps>`
  display: flex;
  align-items: center;

  &:hover {
    text-decoration: underline;
  }
`

const Link: React.FC<LinkProps> = ({ external, ...props }) => {
  const internalProps = external ? getExternalLinkProps() : {}
  return <StyledLink as="a" bold {...internalProps} {...props} />
}

/* eslint-disable react/default-props-match-prop-types */
Link.defaultProps = {
  color: 'primary',
}

export default Link
