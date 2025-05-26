import { useState } from 'react'
import { Flex, Box, IconButton, CogIcon, useModal, useOnClickOutside, useMatchBreakpoints } from 'packages/uikit'
import { usePopper } from 'react-popper'
// import SettingsModal from './SettingsModal'
import { AnimatePresence, motion } from 'framer-motion'
import styled from 'styled-components'
import SettingsBox from './SettingsBox'

type Props = {
  color?: string
  mr?: string
}

const AnimationBox = styled(motion(Box))``

const GlobalSettings = ({ color, mr = '8px' }: Props) => {
  // const [onPresentSettingsModal] = useModal(<SettingsModal />)
  const [open, setOpen] = useState(false)
  const { isMobile } = useMatchBreakpoints()
  const [targetRef, setTargetRef] = useState<HTMLDivElement | null>(null)
  const [tooltipRef, setTooltipRef] = useState<HTMLDivElement | null>(null)
  const { styles, attributes } = usePopper(targetRef, tooltipRef, {
    strategy: 'absolute',
    placement: 'bottom-end',
    modifiers: [{ name: 'offset', options: { offset: isMobile ? [-7, 0] : [0, 5] } }],
  })

  useOnClickOutside(
    {
      current: targetRef,
    },
    () => setOpen(false),
  )

  return (
    <Flex ref={setTargetRef}>
      <IconButton
        onClick={() => setOpen((prev) => !prev)}
        variant="text"
        scale="sm"
        mr={mr}
        id="open-settings-dialog-button"
      >
        <CogIcon height={isMobile ? 13 : 20} width={isMobile ? 13 : 20} color={color} />
      </IconButton>

      <AnimatePresence>
        {open ? (
          <AnimationBox
            // initial={{ opacity: 0, y: 40 }}
            // animate={{ opacity: 1, y: 40 }}
            // exit={{ opacity: 0, y: 40 }}
            // transition={{ duration: 0.2 }}
            zIndex="9"
            background="var(--color-black)"
            width={isMobile ? '180px' : '280px'}
            borderRadius="10px"
            border="1px solid rgba(250, 250, 250, 0.5)"
            style={styles.popper}
            ref={setTooltipRef}
            {...attributes.popper}
          >
            {open ? <SettingsBox onClose={() => setOpen(false)} /> : null}
          </AnimationBox>
        ) : null}
      </AnimatePresence>
    </Flex>
  )
}

export default GlobalSettings
