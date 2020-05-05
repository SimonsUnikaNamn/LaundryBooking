import React from "react";
import NavBar from "./components/NavBar";
import { useAuth0 } from "./react-auth0-spa";
import LoggedIn from "./components/LoggedIn/LoggedIn"
import styled from 'styled-components';

const Wrapper = styled.div`
  text-align: center;
`

const Title = styled.h1`
  font-family: "Leckerli One";
  color: white;
`

function App() {
  const { loading, isAuthenticated, ...rest } = useAuth0();

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
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
