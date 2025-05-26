import { Language } from '../LangSelector/types'
import { FooterLinkType } from './types'
import {
  TwitterIcon,
  TelegramIcon,
  // RedditIcon, InstagramIcon, GithubIcon, DiscordIcon, MediumIcon
} from '../Svg'

export const footerLinks: FooterLinkType[] = []

export const socials = []

export const langs: Language[] = [...Array(20)].map((_, i) => ({
  code: `en${i}`,
  language: `English${i}`,
  locale: `Locale${i}`,
}))
