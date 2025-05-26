import { ContextApi } from 'contexts/Localization/types'
import { PageMeta } from './types'

export const DEFAULT_META: PageMeta = {
  title: 'Tabiswap -  Trade, Stake & Earn from Intellectual Property',
  description: '',
}

export const getCustomMeta = (path: string, t: ContextApi['t']): PageMeta => {
  let basePath
  if (path.startsWith('/swap')) {
    basePath = '/swap'
  } else if (path.startsWith('/add')) {
    basePath = '/add'
  } else if (path.startsWith('/remove')) {
    basePath = '/remove'
  } else if (path.startsWith('/teams')) {
    basePath = '/teams'
  } else if (path.startsWith('/voting/proposal') && path !== '/voting/proposal/create') {
    basePath = '/voting/proposal'
  } else if (path.startsWith('/nfts/collections')) {
    basePath = '/nfts/collections'
  } else if (path.startsWith('/nfts/profile')) {
    basePath = '/nfts/profile'
  } else if (path.startsWith('/pancake-squad')) {
    basePath = '/pancake-squad'
  } else {
    basePath = path
  }

  switch (basePath) {
    case '/':
      return {
        title: `${t('Home')} | ${t('ETH')}`,
      }
    case '/swap':
      return {
        title: DEFAULT_META.title,
      }
    case '/add':
      return {
        title: DEFAULT_META.title,
      }
    case '/remove':
      return {
        title: DEFAULT_META.title,
      }
    case '/liquidity':
      return {
        title: DEFAULT_META.title,
      }
    case '/find':
      return {
        title: DEFAULT_META.title,
      }
    case '/competition':
      return {
        title: DEFAULT_META.title,
      }
    case '/prediction':
      return {
        title: DEFAULT_META.title,
      }
    case '/prediction/leaderboard':
      return {
        title: DEFAULT_META.title,
      }
    case '/farms':
      return {
        title: DEFAULT_META.title,
      }
    case '/farms/auction':
      return {
        title: DEFAULT_META.title,
      }
    case '/pools':
      return {
        title: DEFAULT_META.title,
      }
    case '/lottery':
      return {
        title: DEFAULT_META.title,
      }
    case '/ifo':
      return {
        title: DEFAULT_META.title,
      }
    case '/teams':
      return {
        title: DEFAULT_META.title,
      }
    case '/voting':
      return {
        title: DEFAULT_META.title,
      }
    case '/voting/proposal':
      return {
        title: DEFAULT_META.title,
      }
    case '/voting/proposal/create':
      return {
        title: DEFAULT_META.title,
      }
    case '/info':
      return {
        title: DEFAULT_META.title,
      }
    case '/info/pools':
      return {
        title: DEFAULT_META.title,
      }
    case '/info/tokens':
      return {
        title: DEFAULT_META.title,
      }
    case '/nfts':
      return {
        title: DEFAULT_META.title,
      }
    case '/nfts/collections':
      return {
        title: DEFAULT_META.title,
      }
    case '/nfts/activity':
      return {
        title: DEFAULT_META.title,
      }
    case '/nfts/profile':
      return {
        title: DEFAULT_META.title,
      }
    case '/pancake-squad':
      return {
        title: DEFAULT_META.title,
      }
    default:
      return null
  }
}
