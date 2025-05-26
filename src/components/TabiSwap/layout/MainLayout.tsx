import styled from 'styled-components'
import { Header } from './Header'
import { Sidebar } from './Aside'
import { Footer } from './Footer'

const MainLayout = ({ children }) => {
  return (
    <MainBody>
      <Sidebar />
      <MainSection>
        <Header />
        <Section>{children}</Section>
        <Footer />
      </MainSection>
    </MainBody>
  )
}

export default MainLayout

const MainBody = styled.div`
  background-color: ${({ theme }) => theme.colors.BgColor};
  min-height: 100vh;
  overflow-x: hidden;
`

const Section = styled.section`
  min-height: calc(100vh - calc(80px + 141px));
`

const MainSection = styled.main`
  position: relative;
  width: calc(100% - ${({ theme }) => theme.mainValues.asideWidth}px);
  min-height: 100vh;
  margin-left: ${({ theme }) => theme.mainValues.asideWidth}px;
`
