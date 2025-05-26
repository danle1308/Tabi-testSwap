/* eslint-disable no-param-reassign */
import { FC, useRef } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation } from 'swiper'
import styled from 'styled-components'
import { useMultiBanners } from './hooks/useMultiBanners'
import { Banner } from './Banner'
import 'swiper/css'
import 'swiper/css/effect-fade'

const MultiBanners: FC = () => {
  const bannerList = useMultiBanners()
  const nextButtonRef = useRef<HTMLDivElement>(null)
  const prevButtonRef = useRef<HTMLDivElement>(null)

  const config = {
    slidesPerView: 2,
    spaceBetween: 40,
    loop: true,
    effect: 'fade' as const,
    modules: [Navigation],
  }

  return (
    <SwiperContainer>
      <PrevButton ref={prevButtonRef}>
        <img src="/images/venus/svgs/prev-button-icon.svg" alt="prev-button" />
      </PrevButton>

      <Swiper
        navigation={{
          prevEl: nextButtonRef.current,
          nextEl: prevButtonRef.current,
        }}
        onSwiper={(swiper: any) => {
          // Delay execution for the refs to be defined
          setTimeout(() => {
            // Override prevEl & nextEl now that refs are defined
            swiper.params.navigation.prevEl = prevButtonRef.current
            swiper.params.navigation.nextEl = nextButtonRef.current

            // Re-init navigation
            swiper.navigation.destroy()
            swiper.navigation.init()
            swiper.navigation.update()
          }, 200)
        }}
        {...config}
      >
        {bannerList.map((banner) => (
          <SwiperSlide key={banner.id}>
            <Banner imgSrc={banner.bannerSrc} infos={banner.children} href={`/launchpad/${banner.id}`} />
          </SwiperSlide>
        ))}
      </Swiper>

      <NextButton ref={nextButtonRef}>
        <img src="/images/venus/svgs/next-button-icon.svg" alt="prev-button" />
      </NextButton>
    </SwiperContainer>
  )
}

export default MultiBanners

const SwiperContainer = styled.div`
  position: relative;
  z-index: 1;
  padding: 50px;
`

const SwiperButton = styled.div`
  position: absolute;
  z-index: 9;
  top: 50%;
  transform: translateY(-50%);

  width: 50px;
  aspect-ratio: 1/1;
  cursor: pointer;

  img {
    object-fit: contain;
  }
`

const NextButton = styled(SwiperButton)`
  right: -50px;
`

const PrevButton = styled(SwiperButton)`
  left: -50px;
`
