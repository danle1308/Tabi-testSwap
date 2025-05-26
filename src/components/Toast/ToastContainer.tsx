import { TransitionGroup } from 'react-transition-group'
import styled from 'styled-components'
import { useMatchBreakpoints } from 'packages/uikit'
import Toast from './Toast'
import { ToastContainerProps } from './types'

const ZINDEX = 1000
const TOP_POSITION = 100
// Initial position from the top

const StyledToastContainer = styled.div`
  .enter,
  .appear {
    opacity: 0.01;
  }

  .enter.enter-active,
  .appear.appear-active {
    opacity: 1;
    transition: opacity 250ms ease-in;
  }

  .exit {
    opacity: 1;
  }

  .exit.exit-active {
    opacity: 0.01;
    transition: opacity 250ms ease-out;
  }
`

const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onRemove, ttl = 6000, stackSpacing = 24 }) => {
  const { isMobile } = useMatchBreakpoints()

  return (
    <StyledToastContainer>
      <TransitionGroup>
        {toasts.map((toast, index) => {
          const zIndex = (ZINDEX - index).toString()
          const top = (isMobile ? 45 : 100) + index * stackSpacing

          return (
            <Toast key={toast.id} toast={toast} onRemove={onRemove} ttl={ttl} style={{ top: `${top}px`, zIndex }} />
          )
        })}
      </TransitionGroup>
    </StyledToastContainer>
  )
}

export default ToastContainer
