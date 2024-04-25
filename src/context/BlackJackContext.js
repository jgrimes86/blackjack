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

const naturalTestCards = [
    {
        "code": "JS",
        "image": "https://deckofcardsapi.com/static/img/JS.png",
        "images": {
            "svg": "https://deckofcardsapi.com/static/img/JS.svg",
            "png": "https://deckofcardsapi.com/static/img/JS.png"
        },
        "value": "JACK",
        "suit": "SPADES"
    },
    {
        "code": "AH",
        "image": "https://deckofcardsapi.com/static/img/AH.png",
        "images": {
            "svg": "https://deckofcardsapi.com/static/img/AH.svg",
            "png": "https://deckofcardsapi.com/static/img/AH.png"
        },
        "value": "ACE",
        "suit": "HEARTS"
    }
]


export const ContextProvider = ({ children }) => {
    const [deck, setDeck] = useState({deck_id: "", remaining: 0})

    const [gameStatus, setGameStatus] = useState({
        newDeal: false,
        playerTurn: true,
        canPlayerSplit: false,
        dealerTurn: false,
    })
    const [newDeal, setNewDeal] = useState(false)
    const [playerTurn, setPlayerTurn] = useState(true)
    const [canPlayerSplit, setCanPlayerSplit] = useState(false)
    const [dealerTurn, setDealerTurn] = useState(false)

    const [playerCards, setPlayerCards] = useState([])
    const [splitHand, setSplitHand] = useState({
        split: false,
        splitHand: 0,
        hands: []
    })
    const [dealerCards, setDealerCards] = useState([])
    const [dealersFirstCard, setDealersFirstCard] = useState('')
    
    const [wins, setWins] = useState({
        player: 0,
        dealer: 0,
        draw: 0
    })

    const playerTotal = totalHandValue(playerCards)
    const splitHandTotals = [totalHandValue(splitHand.hands[0]), totalHandValue(splitHand.hands[1])]
    const dealerTotal = totalHandValue(dealerCards)

    console.log(splitHandTotals)

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
        dealerTurn,
        setDealerTurn,
        splitHand,
        setSplitHand,
        dealerCards,
        setDealerCards,
        dealersFirstCard,
        setDealersFirstCard,
        playerTotal,
        splitHandTotals,
        dealerTotal,
        dealCard,
        canPlayerSplit,
        setCanPlayerSplit,
        wins,
        setWins
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
