import React from 'react';

class CreateGame extends React.Component {
    //todo: render invitation status: pending/ accepted/ declined
    //todo: handle opponent left
    //todo: invitation should be array
    
    state = {
        opponents: [],
        invitationReceived: {},
        opponentResponse: {}
    }

    componentDidMount() {
        const { socket } = this.props
        socket.on('getOpponentsResponse', opponents => {
            // opponents = [{id, name}]
            this.updateOpponents(opponents);
        });
        socket.on('newOpponentAdded', opponent => {
            // opponent = {id, name}
            this.updateOpponents([...this.state.opponents, opponent]);
        });
        socket.on('receivedInvitation', invitation => {
            // invitation = {to:'id', from:'id' ,inviter:{name,id...}} 
            this.receivedInvitation(invitation)
        });
        socket.on('invitationResponse', data => {
            // data = { answer:'accept/declined', opponent:{name,id...}  }
            this.gotInvitationResponse(data)
        });
        socket.on('gameStarted', gameData => {
            // gameData = players:{ [id]:{name,id...} } - dictionery ,
            //        whoseTurn: 'id', playboard: [],  status:"ongoing", winner: {}
            this.props.gameStartConfirmation(gameData);
        });
        socket.emit('getOpponents', {});
    }

    updateOpponents = (opponents) => {
        this.setState({ opponents });
    }

    onInvite = (id) => {
        this.props.socket.emit('inviteOpponent', id);
        this.setState({ opponentResponse: 'pending' });
    }

    receivedInvitation = (details) => {
        this.setState({ invitationReceived: details });
    }

    respondToInvitation = (answer) => {
        answer =answer+'Invitation'
        this.props.socket.emit(answer, this.state.invitationReceived);
        this.setState({ invitationReceived: {} })
    }

    gotInvitationResponse = (data) => {
        this.setState({ opponentResponse: { status: data.answer, opponent: data.opponent } }, () => {
            setTimeout(() => {
                this.closeModal()
            }, 5000);
        })
    }

    closeModal = () => {
        this.setState({ opponentResponse: {} })
    }

    onStartGame = () => {
        this.props.socket.emit('startGame', 'start');
    }

    render() {
        const { user } = this.props//todo: need to get user from app.js
        const { opponents, invitationReceived, opponentResponse } = this.state
        return !opponents ? <p>wait for friends to connect</p> : (
            <section className="create-game">
                {user}
                <ul className="connected">
                    {
                        opponents.map((opponent, idx) => {
                            return (
                                <li key={idx}>
                                    <span>{opponent.name}</span>
                                    <button onClick={() => this.onInvite(opponent.id)}>Invite</button>
                                </li>
                            )
                        })
                    }
                </ul>
                <button onClick={() => this.onStartGame()}>start now</button>
                {
                    invitationReceived.to &&
                    <section className="message">
                        <p>{invitationReceived.inviter.name} invited you to play</p>
                        <button onClick={()=>this.respondToInvitation('accept')}>accept</button>
                        <button onClick={()=>this.respondToInvitation('decline')}>decline</button>
                    </section>
                }
                {
                    opponentResponse.opponent &&
                    <section className="accept">
                        {opponentResponse.opponent.name} has {opponentResponse.status} your invite!
                    </section>
                }
            </section>
        )
    }
}

export default CreateGame;