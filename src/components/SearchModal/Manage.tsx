import { useState } from 'react'
import { Token } from '@tabi-dex/sdk'
import { ButtonMenu, ButtonMenuItem, ModalBody } from 'packages/uikit'
import styled from 'styled-components'
import { TokenList } from '@uniswap/token-lists'
import { useTranslation } from 'contexts/Localization'
import ManageLists from './ManageLists'
import ManageTokens from './ManageTokens'
import { CurrencyModalView } from './types'

const TabsButton = styled(ButtonMenuItem)`
  border-radius: 8px;
  background-color: ${({ isActive }) => (isActive ? `#fff` : `#000000`)};
  color: ${({ isActive }) => (isActive ? `#000000` : `#ffffff`)};
  font-weight: 700 !important;
`

export default function Manage({
  setModalView,
  setImportList,
  setImportToken,
  setListUrl,
}: {
  setModalView: (view: CurrencyModalView) => void
  setImportToken: (token: Token) => void
  setImportList: (list: TokenList) => void
  setListUrl: (url: string) => void
}) {
  const [showLists, setShowLists] = useState(false)

  const { t } = useTranslation()

  return (
    <ModalBody>
      <ButtonMenu
        activeIndex={showLists ? 0 : 1}
        onItemClick={() => setShowLists((prev) => !prev)}
        scale="sm"
        mb="32px"
      >
        <TabsButton>{t('Lists')}</TabsButton>
        <TabsButton>{t('Tokens')}</TabsButton>
      </ButtonMenu>
      {showLists ? (
        <ManageLists setModalView={setModalView} setImportList={setImportList} setListUrl={setListUrl} />
      ) : (
        <ManageTokens setModalView={setModalView} setImportToken={setImportToken} />
      )}
    </ModalBody>
  )
}
