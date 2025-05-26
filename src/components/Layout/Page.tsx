import styled from 'styled-components'
import { useTranslation } from 'contexts/Localization'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { DEFAULT_META, getCustomMeta } from 'config/constants/meta'
import { useCakeBusdPrice } from 'hooks/useBUSDPrice'
import Container from './Container'

const StyledPage = styled(Container)<{ $bg?: string }>`
  min-height: calc(100vh - 250px);
  padding-top: 16px;
  position: relative;

  ${({ theme }) => theme.mediaQueries.xs} {
    padding-bottom: 60px;
  }

  ${({ theme }) => theme.mediaQueries.lg} {
    padding-bottom: 16px;
  }

  &:after {
    position: absolute;
    content: ' ';
    left: 20px;
    right: 20px;
    top: 20px;
    bottom: 20px;
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
    z-index: -1;
  }
`

export const PageMeta: React.FC<{ symbol?: string }> = ({ symbol }) => {
  const { t } = useTranslation()
  const { pathname } = useRouter()
  const cakePriceUsd = useCakeBusdPrice()
  const cakePriceUsdDisplay = cakePriceUsd ? `$${cakePriceUsd.toFixed(3)}` : '...'

  const pageMeta = getCustomMeta(pathname, t) || {}
  const { title, description, image } = { ...DEFAULT_META, ...pageMeta }
  let pageTitle = cakePriceUsdDisplay ? [title, cakePriceUsdDisplay].join(' - ') : title
  if (symbol) {
    pageTitle = [symbol, title].join(' - ')
  }

  return (
    <Head>
      <title>{pageTitle}</title>
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
    </Head>
  )
}

interface PageProps extends React.HTMLAttributes<HTMLDivElement> {
  symbol?: string
  bgUrl?: string
}

const Page: React.FC<PageProps> = ({ children, symbol, bgUrl, ...props }) => {
  return (
    <>
      <PageMeta symbol={symbol} />
      <StyledPage $bg={bgUrl} {...props}>
        {children}
      </StyledPage>
    </>
  )
}

export default Page
