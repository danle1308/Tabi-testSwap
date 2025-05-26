import { scales, variants } from './types'

export const scaleVariants = {
  [scales.MD]: {
    height: '48px',
    padding: '12px 24px',
  },
  [scales.SM]: {
    height: '32px',
    fontSize: '16px',
    padding: '0 16px',
  },
  [scales.XS]: {
    height: '20px',
    fontSize: '12px',
    padding: '0 8px',
  },
}

export const styleVariants = {
  [variants.PRIMARY]: {
    backgroundColor: 'primary',
    color: 'text',
    boxShadow: '0px 3px 0px 0px #FFFFFF',
    borderRadius: '30px',
  },
  [variants.SECONDARY]: {
    backgroundColor: 'transparent',
    border: '1px solid',
    borderColor: '#fff',
    borderRadius: '30px',
    boxShadow: 'none',
    color: 'primary',
    ':disabled': {
      backgroundColor: 'transparent',
    },
  },
  [variants.TERTIARY]: {
    backgroundColor: '#ffffff',
    border: '1px solid #2D5000',
    boxShadow: 'none',
    color: '#000000',
  },
  [variants.SUBTLE]: {
    backgroundColor: '#cbd3bf',
    color: '#000000',
  },
  [variants.DANGER]: {
    backgroundColor: '#2d5000',
    color: 'white',
  },
  [variants.SUCCESS]: {
    backgroundColor: 'success',
    color: 'white',
  },
  [variants.TEXT]: {
    backgroundColor: 'transparent',
    color: 'text',
    boxShadow: 'none',
  },
  [variants.LIGHT]: {
    backgroundColor: 'input',
    color: 'textSubtle',
    boxShadow: 'none',
  },
  [variants.ACTIVE]: {
    backgroundColor: '#000',
    color: '#fff',
  },

  [variants.BUTTON]: {
    backgroundColor: '#ffffff',
    color: '#000000',
  },

  [variants.DURATION]: {
    backgroundColor: 'MainColor',
    color: 'BlackColor',
  },
  [variants.CUSTOM]: {
    backgroundColor: 'MainColor',
    borderRadius: '25px',
    color: 'BlackColor',
    fontWeight: '400',
  },
  [variants.VENUS]: {
    backgroundColor: 'MainColor',
    borderRadius: '8px',
    color: 'BlackColor',
    fontWeight: '400',
  },
  [variants.CONNECT]: {
    backgroundColor: 'primary',
    boxShadow: '0px 3px 0px 0px #FFFFFF',
    borderRadius: '10px',
    color: 'text',
  },
}
