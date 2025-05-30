import React, { cloneElement, Children, ReactElement } from 'react'
import styled from 'styled-components'
import { NotificationDotProps, DotProps } from './types'

const NotificationDotRoot = styled.span`
  display: inline-flex;
  position: relative;
`

const Dot = styled.span<DotProps>`
  display: ${({ show }) => (show ? 'inline-flex' : 'none')};
  position: absolute;
  top: ${({ top }) => top || '0'};
  right: ${({ right }) => right || '0'};
  width: ${({ width }) => width || '10px'};
  height: ${({ height }) => height || '10px'};
  pointer-events: none;
  border: 2px solid ${({ theme }) => theme.colors.invertedContrast};
  border-radius: 50%;
  background-color: ${({ theme, color }) => theme.colors[color]};
`

const NotificationDot: React.FC<NotificationDotProps> = ({
  show = false,
  color = 'failure',
  children,
  top,
  right,
  width,
  height,
  ...props
}) => (
  <NotificationDotRoot>
    {Children.map(children, (child: ReactElement) => cloneElement(child, props))}
    <Dot show={show} color={color} top={top} right={right} width={width} height={height} />
  </NotificationDotRoot>
)

export default NotificationDot
