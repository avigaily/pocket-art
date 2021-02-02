import React from 'react';
import socketIOClient from "socket.io-client";
import './App.css';
import GetUserDetails from "./components/GetUserDetails";
import CreateGame from "./components/CreateGame";
import Board from "./components/Board";
import { loadUser, loadGame } from '../store/actions/gameActions.js'
import { connect } from 'react-redux';

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

  //app.js gets registration details if it was successfull
  registrationConfirmation = (res) => {
    this.setState({ isRegistered: res.flag, user: res.user });
  };

  //app.js gets game details if initiation was successfull
  gameStartConfirmation = (gameData) => {
    this.setState({ isGameStarted: true, gameId: gameData.id, gameData: gameData });
    //each socket needs to join
    this.state.socket.emit('joinGame', gameData.id);
  };

  //todo: handle opponent left, pass function as props to <Board>
  // opponentLeft = (data) => {
  //   // If opponent left then get back from game to create screen
  //   alert("Opponent Left");
  //   this.setState({ isGameStarted: false, gameId: null, gameData: null });
  // };

  render() {
    const { socket, isGameStarted, gameData, isRegistered, user } = this.state;
    return !socket ? 'loading' : (
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
                : < Board socket={socket} gameData={gameData} user={user} />
          }
        </main>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
      user: state.game.user,
      gameData: state.game.gameData
  }
}

const mapDispatchToProps = {
  loadUser,
  loadGame,
}

export default connect(mapStateToProps, mapDispatchToProps)(App);