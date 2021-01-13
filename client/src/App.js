import React from 'react';
import socketIOClient from "socket.io-client";
import './App.css';
import GetUserDetails from "./components/GetUserDetails";
import CreateGame from "./components/CreateGame";
import Board from "./components/Board";

class App extends React.Component {
  state = {
    endpoint: "http://localhost:8000",
    socket: null,
    isGameStarted: false,
    gameId: null,
    gameData: null,
    user: null,
    isRegistered: false
  };

  componentDidMount() {
    const { endpoint } = this.state;
    // Made a connection with server
    const socket = socketIOClient(endpoint);
    socket.on("connected", data => {
      this.setState({ socket: socket })
    });
  }

  registrationConfirmation = (res) => {
    var {user} = res
    // If registration successfully redirect to player list
    this.setState({ isRegistered: res.flag});
  };

  gameStartConfirmation = (data) => {
    // If select opponent player then start game and redirect to game play
    this.setState({ isGameStarted: data.status, gameId: data.game_id, gameData: data.game_data });
    console.log('game start');
  };

  opponentLeft = (data) => {
    // If opponent left then get back from game play to player screen
    alert("Opponent Left");
    this.setState({ isGameStarted: false, gameId: null, gameData: null });
  };

  render() {
    const { user, socket, isGameStarted, gameData , isRegistered} = this.state;
    return !socket?'loading':(
      <div className="app">
        <header>
          <h1>Pocket Art</h1>
        </header>
        <main>
          {/* if no name entered */ /* else- if no game in action  */ /* else */}
          {
            !isRegistered ? < GetUserDetails socket={socket} registrationConfirmation={this.registrationConfirmation} />
            : !isGameStarted ? < CreateGame socket={socket} gameStartConfirmation={this.gameStartConfirmation} />
              : < Board socket={socket} gameData={gameData}  />
          }
        </main>
      </div>
    );
  }
}

export default App;