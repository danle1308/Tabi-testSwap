import { useCallback, useEffect, useRef } from 'react'
import { CSSTransition } from 'react-transition-group'
import styled from 'styled-components'
import { Alert, alertVariants, useOnClickOutside, ToastProgressBar } from 'packages/uikit'
import { ToastProps, types } from './types'

const alertTypeMap = {
  [types.INFO]: alertVariants.INFO,
  [types.SUCCESS]: alertVariants.SUCCESS,
  [types.DANGER]: alertVariants.DANGER,
  [types.WARNING]: alertVariants.WARNING,
}

const StyledToast = styled.div`
  right: 16px;
  position: fixed;
  max-width: 200px;
  transition: all 250ms ease-in;
  width: 100%;
  border: 1px solid rgba(250, 250, 250, 0.5);
  border-top-right-radius: 8px;
  border-top-left-radius: 8px;
  height: auto;

  /* ${({ theme }) => theme.mediaQueries.sm} {
    max-width: 400px;
  } */

  ${({ theme }) => theme.mediaQueries.md} {
    max-width: 377px;
    height: 52px;
  }
`

const Toast: React.FC<ToastProps> = ({ toast, onRemove, style, ttl, ...props }) => {
  const timer = useRef<number>()
  const ref = useRef(null)
  const removeHandler = useRef(onRemove)
  const { id, title, description, type } = toast

  const handleRemove = useCallback(() => removeHandler.current(id), [id, removeHandler])

  const handleMouseEnter = () => {
    clearTimeout(timer.current)
  }

  const handleMouseLeave = () => {
    if (timer.current) {
      clearTimeout(timer.current)
    }

    timer.current = window.setTimeout(() => {
      handleRemove()
    }, ttl)
  }

  useOnClickOutside(ref, () => {
    handleRemove()
  })

  useEffect(() => {
    if (timer.current) {
      clearTimeout(timer.current)
    }

    timer.current = window.setTimeout(() => {
      handleRemove()
    }, ttl)

    return () => {
      clearTimeout(timer.current)
    }
  }, [timer, ttl, handleRemove])

  return (
    <CSSTransition nodeRef={ref} timeout={250} style={style} {...props}>
      <StyledToast ref={ref} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
        <Alert title={title} variant={alertTypeMap[type]} onClick={handleRemove}>
          {description}
        </Alert>
        <ToastProgressBar ttl={ttl} onFinish={handleRemove} />
      </StyledToast>
    </CSSTransition>
  )
}

export default Toast
