import React, { useEffect, useRef, useState } from 'react'
import CountUp from 'react-countup'
import { Text, TextProps } from 'packages/uikit'

interface BalanceProps extends TextProps {
  value: number
  isDisabled?: boolean
}

const RemainingTime: React.FC<BalanceProps> = ({ value: duration, color = 'text', isDisabled = false, ...props }) => {
  const [secs, setSecs] = useState(duration)

  useEffect(() => {
    const interval = setInterval(() => {
      setSecs((prev) => (prev === 0 ? 0 : prev - 1))
    }, 1000)
    return () => {
      clearInterval(interval)
    }
  }, [])

  if (secs === 0) return null

  const timeStr = (() => {
    let str = ''
    const sec = secs % 60
    str = `${sec}S`

    const mins = Math.floor(secs / 60)

    if (mins === 0) return str

    const min = mins % 60
    str = `${min}M ${str}`

    const hours = Math.floor(mins / 60)
    if (hours === 0) return str
    const hour = hours % 24
    str = `${hour}H ${str}`

    const days = Math.floor(hours / 24)
    if (days === 0) return str

    return `${days}D ${str}`
  })()

  return (
    <Text color={isDisabled ? 'textDisabled' : color} {...props}>
      {timeStr}
    </Text>
  )
}

export default RemainingTime
