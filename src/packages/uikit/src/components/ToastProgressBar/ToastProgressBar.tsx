import React, { useEffect, useState } from 'react'
import styled from 'styled-components'

interface ToastProgressBarProps {
  ttl: number
  onFinish?: () => void
}

const ProgressContainer = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  height: 4.5px;
  width: 100%;
  background-color: ${({ theme }) => theme.colors.primary};
  /* border-radius: 0 0 8px 8px; */
  overflow: hidden;
`

const Progress = styled.div<{ width: number }>`
  height: 100%;
  background-color: var(--color-grey-border-input);
  width: ${({ width }) => width}%;
  transition: width 100ms linear;
  /* border-right: 0.5px solid var(--color-white-80); */
  /* border-top: 0.5px solid var(--color-white-80); */
`

const ToastProgressBar: React.FC<ToastProgressBarProps> = ({ ttl, onFinish }) => {
  const [width, setWidth] = useState(0)

  useEffect(() => {
    const interval = 100
    const step = (interval / ttl) * 100
    let current = 0

    const timer = setInterval(() => {
      current += step
      if (current >= 100) {
        setWidth(100)
        clearInterval(timer)
        onFinish?.()
      } else {
        setWidth(current)
      }
    }, interval)

    return () => clearInterval(timer)
  }, [ttl, onFinish])

  return (
    <ProgressContainer>
      <Progress width={width} />
    </ProgressContainer>
  )
}

export default ToastProgressBar
