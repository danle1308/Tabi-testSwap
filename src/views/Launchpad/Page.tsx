import { PageMeta } from 'components/Layout/Page'
import { Main } from './styles'

const Page = ({ children }) => {
  return (
    <>
      <PageMeta />
      <Main>{children}</Main>
    </>
  )
}

export default Page
