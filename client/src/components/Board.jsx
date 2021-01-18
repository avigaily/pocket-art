import React from 'react';
import Card from './Card';
import { gCards } from '../cardsService';

class Board extends React.Component {
    render() {
        var { socket, gameData } = this.props
        var cards = gCards
        console.log(gameData);
        // game_status: "ongoing"
        // game_winner: null
        // playboard: []
        // players: {_Ft02HHlvso5OhYcAAAE: {…}, f7cKboKqgogdJbz8AAAF: {…}}
        // whose_turn: "_Ft02HHlvso5OhYcAAAE"
        return 'board'
        // return !cards ? 'loading' : (
        //     <section className="board">
        //         <section className="opponents">
        //             {
        //                  Object.keys(gameData.players).map((player, idx) => {
        //                     return (
        //                         <div key={idx} className="user">
        //                             😄
        //                             <p className="name">{player}</p>
        //                             <p>score: {idx}</p>
        //                         </div>
        //                     )
        //                 })
        //             }

        //         </section>
        //         {
        //             gameData.isUserTurn ? <h3 className="description">{gameData.description} </h3>
        //                 : <label>
        //                     Enter your card description:
        //                 <input
        //                         type="text"
        //                         value={description}
        //                         onChange={event => setDescription(event.target.value)}
        //                     />
        //                 </label>
        //         }
        //         {!isChoosingMyCard &&
        //             <section>
        //                 <p>which card matches best to this description?</p>
        //                 <section className="cards">
        //                     {
        //                         cards.map((card) => {
        //                             return (<Card card={card} />)
        //                         })
        //                     }
        //                 </section>
        //             </section>
        //         }
        //         {isChoosingMyCard &&
        //             <section>
        //                 <div className="hidden-cards">
        //                     <span>choose your card</span>
        //                 </div>
        //                 <section className="current-user">
        //                     {
        //                         cards.map((card) => {
        //                             return (<Card card={card} />)
        //                         })
        //                     }
        //                 </section>
        //                 <button onClick={() => setIsChoosingMyCard(!isChoosingMyCard)}>OK</button>
        //             </section>
        //         }
        //     </section>
        // )
    }
}


export default Board;