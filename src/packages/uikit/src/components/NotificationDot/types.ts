import { Colors } from '../../theme/types'

export interface NotificationDotProps {
  show?: boolean
  color?: keyof Colors
  children: React.ReactElement | React.ReactElement[]
  top: string
  right: string
  width: string
  height: string
}

export interface DotProps {
  show: boolean
  color: keyof Colors
  top: string
  right: string
  width: string
  height: string
}
