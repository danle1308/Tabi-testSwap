import styled from 'styled-components'
import { Flex } from 'packages/uikit'
import Image from 'next/image'
import { LaunchpadViewDetailButton, LaunchpadTextBlock } from 'components/venuswap/components/launchpad'

export const Banner = ({ imgSrc, infos, href }) => {
  return (
    <StyledBanner flexDirection="column" alignItems="center">
      <BannerImage>
        <Image src={imgSrc} layout="fill" objectFit="cover" alt="banner-image" />
      </BannerImage>

      <InfoSection flexDirection="column">
        <Grid>
          {infos?.map((info) => (
            <LaunchpadTextBlock main={info?.title} sub={info?.description} />
          ))}
        </Grid>

        <DetailLink href={href} />
      </InfoSection>
    </StyledBanner>
  )
}

const StyledBanner = styled(Flex)`
  max-width: 100%;
  background: ${({ theme }) => theme.colors.dropdownDeep};
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.colors.venusMainColor};
`

const BannerImage = styled.div`
  position: relative;
  width: 100%;
  max-width: 574;
  height: 100%;
  aspect-ratio: 7/3;

  display: flex;
  flex: 1;
`

const InfoSection = styled(Flex)`
  padding: 24px;
  width: 100%;
  flex-wrap: wrap;
`

const Grid = styled.div`
  --amount: 3;

  display: grid;
  grid-template-columns: repeat(var(--amount), 1fr);
  grid-gap: 10px;

  margin-bottom: 10px;
`

const DetailLink = styled(LaunchpadViewDetailButton)`
  padding: 0 24px;
  max-width: fit-content;
  margin: auto;
`
