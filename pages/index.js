import Head from 'next/head'
import Modal from '../components/Modal'
import Sidebar from '../components/Sidebar'
import styled from "styled-components";


export default function Home() {
  return (
    <div>
      <Head>
        <title>Whatsapp 2.0</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Container>
          <Sidebar/>
          <SideContainer>
            <img className="h-full" src="https://api.backlinko.com/app/uploads/2021/03/whatsapp-user-statistics.png"/>
          </SideContainer>
      </Container>
    </div>
  )
}
const Container = styled.div`
  display: flex;
`;
const SideContainer=styled.div`
flex:1;
`
            
