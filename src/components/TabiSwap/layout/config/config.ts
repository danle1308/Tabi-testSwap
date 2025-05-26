import React from 'react'
import { ContextApi } from 'contexts/Localization/types'

interface IVenusMenuItem {
  label: string
  href: string
  icon: React.ReactNode
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const config: (t: ContextApi['t'], languageCode?: string) => IVenusMenuItem[] = (t, languageCode) => []

export default config
