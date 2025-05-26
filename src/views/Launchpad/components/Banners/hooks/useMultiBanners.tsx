import { useMemo } from 'react'

export const useMultiBanners = () => {
  return useMemo(
    () => [
      {
        id: 1,
        bannerSrc: '/images/venus/venus-banner-1.png',
        children: [
          {
            title: 'Venuswap',
            description: 'IDO Project',
          },
          {
            title: '$100K',
            description: 'Total Raise',
          },
          {
            title: '$0.0025',
            description: 'IDO price',
          },
          {
            title: '200M',
            description: 'Total Supply',
          },
          {
            title: '28 NOV',
            description: 'IDO Date',
          },
          {
            title: '01 DEC',
            description: 'Listing Date',
          },
        ],
      },
      {
        id: 2,
        bannerSrc: '/images/venus/venus-banner-2.png',
        children: [
          {
            title: 'Earn TV',
            description: 'IDO Project',
          },
          {
            title: '$100K',
            description: 'Total Raise',
          },
          {
            title: '$0.0025',
            description: 'IDO price',
          },
          {
            title: '200M',
            description: 'Total Supply',
          },
          {
            title: '28 NOV',
            description: 'IDO Date',
          },
          {
            title: '01 DEC',
            description: 'Listing Date',
          },
        ],
      },
    ],
    [],
  )
}
