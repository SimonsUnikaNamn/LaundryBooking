import React from "react";
import NavBar from "./components/NavBar";
import { useAuth0 } from "./react-auth0-spa";
import LoggedIn from "./components/LoggedIn/LoggedIn"

function App() {
  const { loading, isAuthenticated, ...rest } = useAuth0();

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="App">
      <header>
        <NavBar />
      </header>
      {isAuthenticated && <LoggedIn/>}
    </div>
  );
}

export default App;
