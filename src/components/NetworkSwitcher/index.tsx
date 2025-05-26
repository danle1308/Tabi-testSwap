import { Box, Text, UserMenuItem, TelosIcon, VelasIcon, Scroll } from 'packages/uikit'
import { useRouter } from 'next/router'
import { useTranslation } from 'contexts/Localization'
import Wrapper from './Wrapper'

const chains = [
  { url: '', label: 'ETH', Icon: Scroll },
  // { url: '', label: 'Telos', Icon: TelosIcon },
]

// eslint-disable-next-line no-empty-pattern
const NetworkSelect = ({}) => {
  // const { t } = useTranslation()
  const origin = typeof window !== 'undefined' && window.location.origin ? window.location.origin : ''
  const selectedOne = chains.find((c) => c.url.toLowerCase() === origin.toLowerCase())

  return (
    <>
      {chains.map((chain) => (
        <UserMenuItem
          key={chain.url}
          style={{ justifyContent: 'flex-start' }}
          onClick={() => {
            if (window) {
              window.location.replace(chain.url)
            }
          }}
        >
          <chain.Icon />
          <Text style={{ fontWeight: '400' }} bold={selectedOne?.url === chain.url.toLowerCase()} pl="12px">
            {chain.label}
          </Text>
        </UserMenuItem>
      ))}
    </>
  )
}

export const NetworkSwitcher = () => {
  const { t } = useTranslation()
  // const router = useRouter()
  const origin = typeof window !== 'undefined' && window.location.origin ? window.location.origin : ''
  const selectedOne = chains.find((c) => c.url.toLowerCase() === origin.toLowerCase())

  return (
    <Box height="100%">
      {/* <Wrapper mr="8px" placement="bottom" variant="default" text={t(selectedOne?.label || 'ETH')}>
        {() => <NetworkSelect />}
      </Wrapper> */}
    </Box>
  )
}
