import React from "react";
import NavBar from "./components/NavBar";
import { useAuth0 } from "./react-auth0-spa";
import LoggedIn from "./components/LoggedIn/LoggedIn"
import LoadingModal from "./components/LoadingModal/LoadingModal"
import styled from 'styled-components';
import loadingStore from './stores/loading/loading'

const Wrapper = styled.div`
  text-align: center;
  margin-bottom: 40px;
`

const Title = styled.h1`
  font-family: "Leckerli One";
  color: white;
`

function App() {
  const { loading, isAuthenticated } = useAuth0();
  const globalLoading = loadingStore(state => state.loading)

  if (loading) {
    return <div>Loading...</div>;
  }


  return (
    <>
      <LoadingModal loading={globalLoading} />
      <header>
          <NavBar />
        </header>
      <Wrapper> 
        <Title>Urtegata 39 vaskeri</Title>
        {isAuthenticated && <LoggedIn/>}
      </Wrapper>
    </>
  );
}

export default App;
