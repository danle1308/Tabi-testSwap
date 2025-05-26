import { Svg } from 'packages/uikit'

const Icon = (props) => {
  return (
    <Svg viewBox="0 0 32 32" {...props}>
      <path
        d="M4 14.5C4 12.5148 4.56279 10.5703 5.6231 8.89192C6.68341 7.21358 8.20719 5.85258 10 5V10"
        stroke="black"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M28 17C28 18.9852 27.4372 20.9297 26.3769 22.6081C25.3166 24.2864 23.7928 25.6474 22 26.5V21.5"
        stroke="black"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <rect x="5.8" y="18.8" width="11.4" height="8.4" rx="2.2" stroke="black" strokeWidth="1.6" />
      <rect x="14.8" y="4.8" width="11.4" height="8.4" rx="2.2" stroke="black" strokeWidth="1.6" />
      <path d="M26 9L23 9" stroke="black" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M17 23L14 23" stroke="black" strokeWidth="1.6" strokeLinecap="round" />
    </Svg>
  )
}

export default Icon
