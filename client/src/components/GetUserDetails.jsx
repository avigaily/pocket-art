import React from 'react';

class GetUserDetails extends React.Component {
    state = {
        name: ''
    }

    componentDidMount() {
        this.props.socket.on('checkUserDetailResponse', (res) => {
            this.props.registrationConfirmation(res);
        });
    };

    submitName = (event) => {
        event.preventDefault();
        this.props.socket.emit('checkUserDetail', { name: this.state.name });
    };

    onNameChange = (event) => {
        this.setState({ name: event.target.value });
    };

    render() {
        return (
            <section className="get-user-details">
                <form>
                    <input
                        type="text"
                        value={this.state.name}
                        onChange={this.onNameChange}
                        placeholder="ENTER NAME"
                    />
                    <button onClick={this.submitName}>Connect</button>
                </form>
            </section>
        )
    }
}

export default GetUserDetails;