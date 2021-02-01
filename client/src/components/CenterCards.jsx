import React from 'react';
import Card from './Card';

class CenterCards extends React.Component {
    render() {
        var { cards, onChangeCard } = this.props
        return (
            <section className="center-cards">
                <p>which card matches best to this description?</p>
                <section className="cards">
                    {
                        cards.map(card => {
                            return <Card card={card} onChangeCard={onChangeCard} />
                        })
                    }
                </section>
            </section>
        )
    }
}

export default CenterCards;