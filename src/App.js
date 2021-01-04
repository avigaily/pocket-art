import React, { useState } from 'react';

import './App.css';
import GetUserDetails from "./components/GetUserDetails";
import CreateGame from "./components/CreateGame";
import Board from "./components/Board";

function App() {
  const [endpoint, setEndpoint] = useState("http://127.0.0.1:4444");
  const [socket, setSocket] = useState(null);
  // const [user, setUser] = useState(null);
  const [user, setUser] = useState({name:"avi"});
  // const [isGameStarted, setIsGameStarted] = useState(false);
  const [isGameStarted, setIsGameStarted] = useState(true);
  const [gameId, setGameId] = useState(null);
  const [gameData, setGameData] = useState(null);

  return (
    <div className="app">
      <header>
        <h1>Pocket Art</h1>
        {/* <button>new game</button> */}
      </header>
      <main>
          {/* if no name entered */ /* else- if no game in action  */ /* else */ }
          {/* Q: why did i get problems when not using () around user? */}
         {
           !user ? < GetUserDetails /> : !isGameStarted ? < CreateGame /> : < Board />
         } 
      </main>
    </div>
  );
}

export default App;
