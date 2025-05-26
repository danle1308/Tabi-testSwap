import { createGlobalStyle } from 'styled-components'
import { PancakeTheme } from 'packages/uikit'

declare module 'styled-components' {
  /* eslint-disable @typescript-eslint/no-empty-interface */
  export interface DefaultTheme extends PancakeTheme {}
}

const GlobalStyle = createGlobalStyle`
  :root {
    --core-color: #24BD7D;
    --color-primary: ${({ theme }) => theme.colors.primary};
    --color-white: rgba(255, 255, 255, 1);
    --color-white-80: #FFFFFFCC;
    --color-white-50: rgba(255, 255, 255, 0.5);
    --color-white-20: #FFFFFF33;
    --color-black: rgba(0, 0, 0, 1);
    --color-grey-border-input: #737373;
    --color-hover-button: #666464;
    --color-hover-menuitems: #403E3E;
    --color-text-second: #9B9B9B;
    --color-border-50: rgba(250, 250, 250, 0.5);
    --color-red: #FE0034;
    --color-token: #FF0B0F; 
    --color-text-third: #D9D9D9;
  }
  * {
    font-family: 'Kanit', sans-serif;
  }
  body {
    background-color: ${({ theme }) => theme.colors.background};

    img {
      height: auto;
      max-width: 100%;
    }
  }
`

export default GlobalStyle
