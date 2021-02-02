import React from 'react';

class Card extends React.Component {
    render() {
        const cardSrc = `images/${this.props.card.url}.jpg`
        return (
            <div key={this.props.card.url} className={"card "+ this.props.isSelected} onClick={() => this.props.onChangeCard(this.props.card.id)}>
                <img src={cardSrc} alt="card" />
            </div>
        )
    }
}

export default Card;