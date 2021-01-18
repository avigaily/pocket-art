import React from 'react';

class CreateGame extends React.Component {
    //todo: render invitation status: pending/ accepted/ declined
    //todo:handle opponent left 
    
    state = {
        opponents: [],
        invitationReceived: {},
        opponentResponse: {}
    }

    componentDidMount() {
        const { socket } = this.props
        socket.on('getOpponentsResponse', opponents => {
            // opponents = [{id,name}]
            this.updateOpponents(opponents);
        });
        socket.on('newOpponentAdded', data => {
            this.updateOpponents([...this.state.opponents, data]);
        });
        socket.on('receivedInvitation', data => {
            this.receivedInvitation(data)
        });
        socket.on('invitationResponse', data => {
            this.gotInvitationResponse(data)
        });
        socket.on('gameStarted', data => {
            this.props.gameStartConfirmation(data);
        });
        socket.emit('getOpponents', {});
    }

    updateOpponents = (opponents) => {
        this.setState({ opponents });
    }

    onInvite = (id) => {
        this.props.socket.emit('inviteOpponents', { id });
        this.setState({ opponentResponse: 'pending' });
    }

    receivedInvitation = (details) => {
        console.log('client received invite', details);
        this.setState({ invitationReceived: details });
    }

    acceptInvitation = () => {
        this.props.socket.emit('acceptInvitation', this.state.invitationReceived.inviter.id);
    }

    gotInvitationResponse = (data) => {
        console.log(data.opponent.name, data.answer, ' your request');
        this.setState({ opponentResponse: { status: data.answer, opponent: data.opponent } })
    }

    onStartGame=()=>{
        this.props.socket.emit('startGame', this.state.opponentResponse.opponent);
    }

    render() {
        const { user, gameStartConfirmation } = this.props
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
                    invitationReceived.inviter &&
                    <section className="message">
                        <p>{invitationReceived.inviter.name} invited you to play</p>
                        <button onClick={this.acceptInvitation}>accept</button>
                        <button >decline</button>
                    </section>
                }
                {
                    opponentResponse.opponent ?
                        <section className="accept">
                            {opponentResponse.opponent.name} has accepted your invite!
                        </section>
                        : ''
                }
            </section>
        )
    }
}


export default CreateGame;