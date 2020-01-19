import React from "react";
import NavBar from "./components/NavBar";
import { useAuth0 } from "./react-auth0-spa";
import styled from 'styled-components';

const WashDate = styled.input`
  
`

function App() {
  const { loading, isAuthenticated } = useAuth0();

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="App">
      <header>
        <NavBar />
      </header>
      {isAuthenticated ? <WashDate type="date" /> : null }
    </div>
  );
}

export default App;
