export type Breakpoints = string[]

export type MediaQueries = {
  xs: string
  sm: string
  md: string
  lg: string
  xl: string
  xxl: string
  nav: string
}

export type Spacing = number[]

export type Radii = {
  small: string
  default: string
  card: string
  circle: string
}

export type Shadows = {
  level1: string
  active: string
  success: string
  warning: string
  focus: string
  inset: string
  tooltip: string
}

export type Gradients = {
  bubblegum: string
  inverseBubblegum: string
  cardHeader: string
  blue: string
  violet: string
  violetAlt: string
  gold: string
  venus: string
}

export type Colors = {
  primary: string
  primaryBright: string
  primaryDark: string
  secondary: string
  tertiary: string
  success: string
  failure: string
  warning: string
  cardBorder: string
  contrast: string
  dropdown: string
  dropdownDeep: string
  invertedContrast: string
  input: string
  inputSecondary: string
  background: string
  backgroundManta: string
  backgroundActive: string
  textActive: string
  textScroll: string
  backgroundButton: string
  backgroundDisabled: string
  backgroundAlt: string
  backgroundAlt2: string
  text: string
  textBlur: string
  textDisabled: string
  textSubtle: string
  disabled: string
  textColor: string

  // Gradients
  gradients: Gradients

  // Additional colors
  binance: string
  overlay: string
  gold: string
  silver: string
  bronze: string

  toggle: string

  BgColor: string
  MainColor: string
  TopBottomColor: string
  WhiteColor: string
  WhiteColorLight: string
  BlackColor: string
  ModalBg: string
  InputNumbericColor: string
  InvertedContrastColor: string
}

export type ZIndices = {
  ribbon: number
  dropdown: number
  modal: number
}

export type mainValues = {
  asideWidth: number
  contentWidth: number
  footerHeight: number
}
