import React from 'react'
import { ChevronDownIcon, ChevronUpIcon, ArrowDropDownIcon, ArrowDropUpIcon } from '../Svg'
import Button from './Button'
import IconButton from './IconButton'

interface Props {
  onClick?: () => void
  expanded?: boolean
}

export const ExpandableButton: React.FC<Props> = ({ onClick, expanded, children }) => {
  return (
    <IconButton aria-label="Hide or show expandable content" onClick={onClick}>
      {children}
      {expanded ? <ChevronUpIcon color="invertedContrast" /> : <ChevronDownIcon color="invertedContrast" />}
    </IconButton>
  )
}
ExpandableButton.defaultProps = {
  expanded: false,
}

export const ExpandableLabel: React.FC<Props> = ({ onClick, expanded, children }) => {
  return (
    <Button
      variant="text"
      style={{ color: '#fff', background: 'transparent', fontWeight: '800' }}
      aria-label="Hide or show expandable content"
      onClick={onClick}
      endIcon={expanded ? <ArrowDropUpIcon color="WhiteColor" /> : <ArrowDropDownIcon color="WhiteColor" />}
    >
      {children}
    </Button>
  )
}
ExpandableLabel.defaultProps = {
  expanded: false,
}
