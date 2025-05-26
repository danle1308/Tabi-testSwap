import { useEffect, useState, useRef } from 'react'

/**
 * Consider this moving up to the global level
 */

const useCountdown = (timestamp: number) => {
  const [secondsRemaining, setSecondsRemaining] = useState(null)
  const timer = useRef(null)

  useEffect(() => {
    const currentSeconds = Math.floor(Date.now() / 1000)
    const secondsRemainingCalc = Math.max(timestamp - currentSeconds, 0)
    setSecondsRemaining(secondsRemainingCalc)

    timer.current = setInterval(() => {
      setSecondsRemaining((prevSecondsRemaining) => Math.max(prevSecondsRemaining - 1, 0))
    }, 1000)

    return () => clearInterval(timer.current)
  }, [timestamp])

  return secondsRemaining
}

export default useCountdown
