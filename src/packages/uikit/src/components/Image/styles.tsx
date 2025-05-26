import styled from 'styled-components'
import { variant as StyledSystemVariant } from 'styled-system'
import { ImageProps, Variant, variants } from './types'
import TokenImage from './TokenImage'

interface StyledImageProps extends ImageProps {
  variant: Variant
}

export const StyledPrimaryImage = styled(TokenImage)<StyledImageProps>`
  position: absolute;
  // 92, 82 are arbitrary numbers to fit the variant
  /* width: ${({ variant }) => (variant === variants.DEFAULT ? '50%' : '82%')}; */

  ${StyledSystemVariant({
    variants: {
      [variants.DEFAULT]: {
        bottom: 'auto',
        left: 0,
        right: 'auto',
        top: '50%',
        transform: `translateY(-50%)`,
        zIndex: 5,
        width: '50%',
      },
      [variants.INVERTED]: {
        bottom: 0,
        left: 'auto',
        right: 0,
        top: 'auto',
        zIndex: 6,
        width: '82%',
      },
      [variants.STAKING]: {
        bottom: 'auto',
        left: 0,
        right: 'auto',
        top: 0,
        zIndex: 5,
        width: '92%',
      },
    },
  })}
`

export const StyledSecondaryImage = styled(TokenImage)<StyledImageProps>`
  position: absolute;
  width: 50%;

  ${StyledSystemVariant({
    variants: {
      [variants.DEFAULT]: {
        bottom: 0,
        left: 'auto',
        right: '5px',
        top: '50%',
        transform: `translateY(-50%)`,
        zIndex: 6,
      },
      [variants.INVERTED]: {
        bottom: 'auto',
        left: 0,
        right: 'auto',
        top: 0,
        zIndex: 5,
      },
      [variants.STAKING]: {
        bottom: 0,
        left: 'auto',
        right: 0,
        top: 'auto',
        zIndex: 5,
      },
    },
  })}
`
