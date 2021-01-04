import React from 'react';
 
function Card({card}) {
    const cardSrc = `images/${card.url}.jpg`
    return (
        <div key={card.url} className="card" onClick={() => { console.log('main user chose their card'); }}>
            <img src={cardSrc} alt="card" />
        </div>
    )
}


export default Card;