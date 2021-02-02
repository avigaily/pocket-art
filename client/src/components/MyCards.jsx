import React from 'react';
import Card from './Card';

class MyCards extends React.Component {
    render() {
        var { cards, onChangeCard, selectedCard } = this.props
        return (
            <section className="my-cards">
                <div className="hidden-cards">
                    <span>choose your card</span>
                </div>
                <section className="current-user">
                    {
                        cards.map((card) => {
                            var isSelected = selectedCard.id===card.id? 'selected': '';
                            return (<Card card={card} onChangeCard={onChangeCard} isSelected={isSelected} />)
                        })
                    }
                </section>
            </section>
        )
    }
}

export default MyCards;