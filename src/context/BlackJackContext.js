import { createContext, useContext, useEffect, useState } from "react";

import { totalHandValue } from "../tools/handValue";

const Context = createContext();

const splitTestCards = [
    {
        "code": "9S",
        "image": "https://deckofcardsapi.com/static/img/9S.png",
        "images": {
            "svg": "https://deckofcardsapi.com/static/img/9S.svg",
            "png": "https://deckofcardsapi.com/static/img/9S.png"
        },
        "value": "9",
        "suit": "SPADES"
    },
    {
        "code": "9S",
        "image": "https://deckofcardsapi.com/static/img/9S.png",
        "images": {
            "svg": "https://deckofcardsapi.com/static/img/9S.svg",
            "png": "https://deckofcardsapi.com/static/img/9S.png"
        },
        "value": "9",
        "suit": "SPADES"
    }
]


export const ContextProvider = ({ children }) => {
    const [deck, setDeck] = useState({deck_id: "", remaining: 0})
    const [newDeal, setNewDeal] = useState(false)
    const [playerCards, setPlayerCards] = useState([])
    const [playerTurn, setPlayerTurn] = useState(true)
    const [playerSplit, setPlayerSplit] = useState({
        split: false,
        splitHand: 0,
        hands: []
    })
    const [dealerCards, setDealerCards] = useState([])
    const [dealersFirstCard, setDealersFirstCard] = useState('')
    const [canPlayerSplit, setCanPlayerSplit] = useState(false)

    const playerTotal = totalHandValue(playerCards)
    const dealerTotal = totalHandValue(dealerCards)

    const dealCard = async (draw) => {
        return fetch(`https://www.deckofcardsapi.com/api/deck/${deck.deck_id}/draw/?count=${draw}`)
        .then(resp => resp.json())
    };

    const context = {
        deck,
        setDeck,
        newDeal,
        setNewDeal,
        playerCards,
        setPlayerCards,
        playerTurn,
        setPlayerTurn,
        playerSplit,
        setPlayerSplit,
        dealerCards,
        setDealerCards,
        dealersFirstCard,
        setDealersFirstCard,
        playerTotal,
        dealerTotal,
        dealCard,
        canPlayerSplit,
        setCanPlayerSplit,
    }

    return (
        <Context.Provider value={context}>
            {children}
        </Context.Provider>
    )
}

export const BlackJackContext = () => {
    return useContext(Context);
}
