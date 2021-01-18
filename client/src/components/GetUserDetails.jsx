import React from 'react';

class GetUserDetails extends React.Component {
    state = {
        name: ''
    }

    componentDidMount() {
        //todo: show err if name already in use
        //after server confirmation send status + user details to app.js
        this.props.socket.on('checkUserDetailResponse', (res) => {
            this.props.registrationConfirmation(res);
        });
    };

    onNameChange = (event) => {
        this.setState({ name: event.target.value });
    };

    submitName = (event) => {
        event.preventDefault();
        this.props.socket.emit('checkUserDetail', { name: this.state.name });
    };


    render() {
        return (
            <section className="get-user-details">
                <form>
                    <label>
                        Enter Name
                        <input
                            type="text"
                            value={this.state.name}
                            onChange={this.onNameChange}
                            placeholder="John Smith"
                        />
                    </label>
                    <button onClick={this.submitName}>Connect</button>
                </form>
            </section>
        )
    }
}

export default GetUserDetails;