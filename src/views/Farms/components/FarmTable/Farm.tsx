import styled from 'styled-components'
import { useFarmUser } from 'state/farms/hooks'
import { useTranslation } from 'contexts/Localization'
import { LinkExternal, Text } from 'packages/uikit'
import { Token } from '@tabi-dex/sdk'
import { getBalanceNumber } from 'utils/formatBalance'
import { TokenPairImage } from 'components/TokenImage'
import { getAddress } from 'utils/addressHelpers'
import { getBscScanLink } from 'utils'
import { BASE_VELAS_SCAN_URLS } from 'config'
import { FarmWithStakedValue } from '../types'

export interface FarmProps {
  label: string
  pid: number
  token: Token
  quoteToken: Token
  details: FarmWithStakedValue
  bscScanAddress?: string
}

const Container = styled.div`
  /* padding-left: 16px; */
  display: flex;
  align-items: center;

  ${({ theme }) => theme.mediaQueries.sm} {
    /* padding-left: 32px; */
  }
`

const TokenWrapper = styled.div`
  padding-right: 8px;
  width: 56px;
`
const StyledLinkExternal = styled(LinkExternal)`
  font-weight: 400;
  font-size: 14px;
  color: #f34065;
  display: flex;
  width: 100%;
  gap: 10px;
`
const Farm: React.FunctionComponent<FarmProps> = ({ token, quoteToken, label, pid, details, bscScanAddress }) => {
  console.log(details)
  const farm = details
  console.log(farm)
  const { stakedBalance } = useFarmUser(pid)
  const { t } = useTranslation()
  const rawStakedBalance = getBalanceNumber(stakedBalance)
  // const lpAddress = getAddress(farm.lpAddresses)
  // const bsc = getBscScanLink(lpAddress, 'address')

  const handleRenderFarming = (): JSX.Element => {
    if (rawStakedBalance) {
      return (
        <Text color="WhiteColor" fontSize="12px">
          {t('Farming')}
        </Text>
      )
    }

    return null
  }

  return (
    <Container>
      <TokenWrapper>
        <TokenPairImage variant="default" primaryToken={quoteToken} secondaryToken={token} width={58} height={58} />
      </TokenWrapper>
      <div>
        {handleRenderFarming()}
        <Text style={{ fontSize: '20px', fontWeight: '800', color: 'white' }}>Stake {label} Pool</Text>
        <StyledLinkExternal
        // href={bsc}
        // href={BASE_VELAS_SCAN_URLS / address/>}
        >
          {t('View Contract')}
        </StyledLinkExternal>
      </div>
    </Container>
  )
}

export default Farm
