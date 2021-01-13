import React from 'react';

class CreateGame extends React.Component {
    state = {
        opponents: [],
        invitation: {},
        opponentResponse: {}
    }

    componentDidMount() {
        const {socket} = this.props

        socket.on('getOpponentsResponse', data => {
            this.updateOpponents(data);
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
            console.log(data);
            this.props.gameStartConfirmation(data);
        });

        socket.emit('getOpponents', {});
    }

    updateOpponents = (opponents) => {
        this.setState({ opponents });
    }

    onInvite = (id) => {
        console.log('client invited');
        this.props.socket.emit('inviteOpponents', { id });
        this.setState({ opponentResponse: 'pending' });
    }

    receivedInvitation = (details) => {
        console.log('client received invite', details);
        this.setState({ invitation: details });
    }

    acceptInvitation = () => {
        this.props.socket.emit('acceptInvitation', this.state.invitation.inviter.id);
    }

    gotInvitationResponse = (data) => {
        console.log(data.opponent.name,data.answer,' your request');
        // this.setState({ opponentResponse: { status: didAccept, invitedDetails: data } })
    }

    render() {
        const { user, gameStartConfirmation } = this.props
        const { opponents, invitation, opponentResponse } = this.state

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
                <button onClick={() => console.log('start')}>start now</button>
                {
                    invitation.inviter &&
                    <section className="message">
                        <p>{invitation.inviter.name} invited you to play</p>
                        <button onClick={this.acceptInvitation}>accept</button>
                        <button >decline</button>
                    </section>
                }
                {
                    // opponentResponse.invitedDetails.id &&
                    //     opponentResponse.status ?
                    //     <section className="accept">
                    //         {opponentResponse.invitedDetails.name} has accepted your invite!
                    //     </section>
                    //     : <section className="declined">
                    //         {opponentResponse.invitedDetails.name} has declined your invite!
                    //     </section>
                }
            </section>
        )
    }
}


export default CreateGame;