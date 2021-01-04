import React, { useState, useEffect } from 'react';
import Card from './Card'
import {gCards} from '../cardsService'

function Board({ gameData }) {
    const [description, setDescription] = useState('');
    const [cards, setCards] = useState(null);
    const [isChoosingMyCard, setIsChoosingMyCard] = useState(true);
    useEffect(() => {
        let cards =gCards.slice(0,4)
        setCards(cards)
      }, []);
    return !cards?'loading':(
        <section className="board">
            <section className="opponents">
                <div className="user">
                    😄
                    <p className="name">rony</p>
                    <p>score: {3}</p>
                </div>
                <div className="user">
                    😄
                    <p className="name">yossi</p>
                    <p>score: {7}</p>
                </div>
                <div className="user">
                    😄
                    <p className="name">mali</p>
                    <p>score: {4}</p>
                </div>
            </section>
            <h3 className="description">
                {/* gameData.description */}
                funny
            </h3>
            {/* or */}
            {/* <label>
                Enter your card description:
                <input
                    type="text"
                    value={description}
                    onChange={event => setDescription(event.target.value)}
                />
            </label> */}
            {!isChoosingMyCard &&
                <section>
                    <p>which card matches best to this description?</p>
                    <section className="cards">
                        {
                            cards.map((card) => {
                                return(<Card card={card} />)
                            })
                        }
                    </section>
                </section>
            }
            {isChoosingMyCard &&
                <section>
                    <div className="hidden-cards">
                        <span>choose your card</span>
                    </div>
                    <section className="current-user">
                        {
                            cards.map((card) => {
                               return(<Card card={card} />) 
                            })
                        }
                    </section>
                    <button onClick={() => setIsChoosingMyCard(!isChoosingMyCard)}>OK</button>
                </section>
            }
        </section>
    )
}


export default Board;