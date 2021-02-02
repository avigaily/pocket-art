import React from 'react';
import { gCards } from '../gameService';
import MyCards from "./MyCards";
// import CenterCards from "./CenterCards";
import { loadUser, loadGame } from '../store/actions/gameActions.js'
import { connect } from 'react-redux';

class Board extends React.Component {
    state = {
        description: '',
        card: null
    }

    onChangeDescription = (event) => {
        this.setState({ description: event.target.value });
    };

    onChangeCard = (id) => {
        this.setState({ card: id });
        //todo: show card was clicked
    };

    onEndTurn = () => {
        this.props.socket.emit('endTurn', this.state);
    };

    render() {
        var { gameData, user } = this.props
        var cards = gCards
        return !gameData ? 'loading' : (
            <section className="board">
                <section>
                    <p>{user.name}</p>
                    <p>score: 0</p>
                </section>
                <section className="opponents">
                    {
                        Object.keys(gameData.players).map((player, idx) => {
                            if (gameData.players[player].id !== user.id) {
                                return (
                                    <div key={player} className="user">
                                        😄
                                        <p className="name">{gameData.players[player].name}</p>
                                        <p>score: 0</p>
                                    </div>
                                )
                            }
                        })
                    }
                </section>
                {
                    gameData.whoseTurn !== user.id ?
                        gameData.board.description ?
                            <h3 className="description">{gameData.board.description} </h3>

                            : <h3 className="description">waiting for opponent to finish turn</h3>
                        : <label>
                            Enter your card description:
                            <input
                                type="text"
                                value={this.state.description}
                                onChange={event => this.onChangeDescription(event)}
                            />
                        </label>
                }
                {
                    gameData.turnStatus === 'story teller input part' &&
                        user.isStoryTeller ?
                        <section>
                            <MyCards cards={cards} onChangeCard={this.onChangeCard} selectedCard={this.state.card}/>
                            <button onClick={this.onEndTurn}>OK</button>
                        </section>
                        : 'wait- story teller is thinking'
                }
                {/* {
                    <CenterCards cards={cards} onChangeCard={this.onChangeCard} />
                } */}
            </section>
        )
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

export default connect(mapStateToProps, mapDispatchToProps)(Board);