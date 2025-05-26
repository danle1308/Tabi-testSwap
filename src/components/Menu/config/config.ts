import React from 'react'
import {
  MenuItemsType,
  // DropdownMenuItemType,
  // SwapIcon,
  // SwapFillIcon,
  // EarnFillIcon,
  // EarnIcon,
  // TrophyIcon,
  // TrophyFillIcon,
  // NftIcon,
  // NftFillIcon,
  // MoreIcon,
  // TradeIcon,
  // FarmIcon,
} from 'packages/uikit'
import { ContextApi } from 'contexts/Localization/types'
// import { nftsBaseUrl } from 'views/Nft/market/constants'
// import { perpLangMap } from 'utils/getPerpetualLanguageCode'
import { DropdownMenuItems, DropdownMenuItemType } from 'packages/uikit/src/components/DropdownMenu/types'
import {
  // HomePageIcon,
  SwapPageIcon,
  LiquidityPageIcon,
  StakingPageIcon,
  FarmingPageIcon,
  EarnIcon,
  // LaunchpadPageIcon,
  // NFTIcon,
  BridgeIcon,
} from 'components/TabiSwap/components/svgs'

export type ConfigMenuDropDownItemsType = DropdownMenuItems & { hideSubNav?: boolean }
export type ConfigMenuItemsType = Omit<MenuItemsType, 'items'> & { hideSubNav?: boolean } & {
  items?: ConfigMenuDropDownItemsType[]
}

const config: (t: ContextApi['t'], languageCode?: string) => ConfigMenuItemsType[] = (t, languageCode) => [
  {
    label: t('Swap'),
    href: '/swap',
    // icon: SwapPageIcon,
  },
  {
    label: t('Pools'),
    href: '/liquidity',
    // icon: LiquidityPageIcon,
    items: [
      {
        label: 'All Pools',
        href: '/liquidity',
        // icon: FarmingPageIcon,
      },
      {
        label: 'Create a Position',
        href: '/add',
        // icon: StakingPageIcon,
      },
    ],
  },
  // {
  //   label: t('Earn'),
  //   icon: EarnIcon,
  //   href: '/farms',
  //   showItemsOnMobile: true,
  //   items: [
  //     {
  //       label: 'Farms',
  //       href: '/farms',
  //       icon: FarmingPageIcon,
  //     },
  //     {
  //       label: 'Stake',
  //       href: '/stake/1',
  //       icon: StakingPageIcon,
  //     },
  //   ],
  // },
  {
    label: t('Bridge'),
    href: '#',
    icon: BridgeIcon,
    // type: DropdownMenuItemType.EXTERNAL_LINK,
  },
  // {
  //   label: t('Fairlaunch'),
  //   href: '/fairlaunch',
  //   icon: LaunchpadPageIcon,
  // },
  // {
  //   label: t('Staking'),
  //   href: '/pools',
  //   icon: StakingPageIcon,
  // },
  // {
  //   label: t('Yield Farming'),
  //   href: '/farms',
  //   icon: FarmingPageIcon,
  // },
  // {
  //   label: t('nft'),
  //   href: '/nft',
  //   icon: NFTIcon,
  // },
]

export default config
