import React from 'react'
import { ArrowDownIcon, IconButton, ArrowUpDownIcon } from 'packages/uikit'
import styled from 'styled-components'
import { AutoColumn } from 'components/Layout/Column'
import { AutoRow } from 'components/Layout/Row'

const StyledButton = styled(IconButton)`
  box-shadow: inset 0px -2px 0px rgba(0, 0, 0, 0.1);
  .icon-up-down {
    display: none;
  }
  &:hover {
    background-color: ${({ theme }) => theme.colors.primary};
    .icon-down {
      display: none;
      fill: white;
    }
    .icon-up-down {
      display: block;
      fill: white;
    }
  }
`

interface SwitchIconButtonProps {
  color: 'active' | 'text'
  handleSwitchTokens: () => void
}

const SwitchIconButton: React.FC<SwitchIconButtonProps> = ({ handleSwitchTokens, color }) => {
  return (
    <AutoColumn justify="space-between">
      <AutoRow justify="center" style={{ padding: '0 1rem' }}>
        <StyledButton
          variant="light"
          scale="sm"
          onClick={() => {
            handleSwitchTokens()
          }}
        >
          <ArrowDownIcon className="icon-down" color={color} />
          <ArrowUpDownIcon className="icon-up-down" color={color} />
        </StyledButton>
      </AutoRow>
    </AutoColumn>
  )
}

export default SwitchIconButton
