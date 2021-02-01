import React from 'react';
import Card from './Card';

class MyCards extends React.Component {
    render() {
        var { cards, onChangeCard } = this.props
        return (
            <section className="my-cards">
                <div className="hidden-cards">
                    <span>choose your card</span>
                </div>
                <section className="current-user">
                    {
                        cards.map((card) => {
                            return (<Card card={card} onChangeCard={onChangeCard} />)
                        })
                    }
                </section>
            </section>
        )
    }
}

export default MyCards;