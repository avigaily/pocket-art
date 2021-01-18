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
    // connect to server
    const socket = socketIOClient(endpoint);
    socket.on("connected", data => {
      this.setState({ socket: socket })
    });
  }

  //todo: res should get user so the name shows
  //app.js gets registration details if it was successfull
  registrationConfirmation = (res) => {
    this.setState({ isRegistered: res.flag});
  };
  
  //app.js gets game details if initiation was successfull
  gameStartConfirmation = (data) => {
    this.setState({ isGameStarted: true, gameId: data.game_id, gameData: data.game_data });
    //each socket needs to join
    this.state.socket.emit('joinGame',  data.game_id);
  };

  //todo: handle opponent left, pass function as props to <Board>
  // opponentLeft = (data) => {
  //   // If opponent left then get back from game to create screen
  //   alert("Opponent Left");
  //   this.setState({ isGameStarted: false, gameId: null, gameData: null });
  // };

  render() {
    const { socket, isGameStarted, gameData , isRegistered} = this.state;
    return !socket?'loading':(
      <div className="app">
        <header>
          <h1>Pocket Art</h1>
        </header>
        <main>
          {/* if no name entered < GetUserDetails >
              else  if no game in action < CreateGame >
                    else- < Board > */}
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