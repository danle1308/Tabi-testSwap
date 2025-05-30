import styled, { DefaultTheme } from 'styled-components'
import { space, typography, layout } from 'styled-system'
import getThemeValue from '../../util/getThemeValue'
import { TextProps } from './types'

interface ThemedProps extends TextProps {
  theme: DefaultTheme
}

const getColor = ({ color, theme }: ThemedProps) => {
  return getThemeValue(`colors.${color}`, color)(theme)
}

const Text = styled.div<TextProps>`
  color: ${getColor || '#fff'};
  font-weight: ${({ bold }) => (bold ? 700 : 400)};
  line-height: 1.5;

  ${({ textTransform }) => textTransform && `text-transform: ${textTransform};`}
  ${({ ellipsis }) =>
    ellipsis &&
    `white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;`}

  ${space}
  ${typography}
  ${layout}

  ${({ small }) => small && `font-size: 12px;`}
`

Text.defaultProps = {
  color: 'text',
  small: false,
  fontSize: ['12px', , , , '14px'],
  ellipsis: false,
}

export default Text
