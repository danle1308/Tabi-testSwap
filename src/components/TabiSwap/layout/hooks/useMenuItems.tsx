import { useMemo } from 'react'
import { useTranslation } from '../../../../contexts/Localization'
import config from '../config/config'

export const useMenuItems = () => {
  const {
    t,
    currentLanguage: { code: languageCode },
  } = useTranslation()

  const menuItems = useMemo(() => {
    return config(t, languageCode)
  }, [t, languageCode])

  return useMemo(() => {
    return menuItems
  }, [menuItems])
}
