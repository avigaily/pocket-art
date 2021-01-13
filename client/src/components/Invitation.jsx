import React from 'react';

class Invitation extends React.Component{
    render(){
        const {inviter,getAnswer} =this.props;
        return(
            <section>
                <p>{inviter.name} invited you to play</p>
                <button onClick={()=>getAnswer(true)}>yes</button>
                <button onClick={()=>getAnswer(false)}>no</button>
            </section>
        )
    }
}

export default Invitation;