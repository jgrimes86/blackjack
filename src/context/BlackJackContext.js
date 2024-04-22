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
    const [playerCards, setPlayerCards] = useState(splitTestCards)
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

    // useEffect runs when player gets new card
    useEffect(() => {
        if (playerCards && playerTotal && playerSplit.split === false) {
            if (playerTotal === 21) {
                setPlayerTurn(false)
            } else if (playerTotal > 21) {
                console.log("PLAYER BUSTS!");
                setNewDeal(false)
            }
        }

        if (playerCards) {
            if (playerCards.length === 2 && !playerSplit.split) {
                const card1 = playerCards[0]
                const card2 = playerCards[1]
                if (card1.value === card2.value) {
                    setCanPlayerSplit(true)
                }
            } else {
                setCanPlayerSplit(false)
            }
        }
    }, [playerCards])

    console.log(playerSplit)

    // useEffect runs when player ends turn and when dealer draws cards
    useEffect(() => {
        if (!playerTurn && dealerCards) {
            if (playerTotal === 21) {
                // If player has natural 21, check if dealer also has natural 21
                if (dealerTotal === 21) {
                    console.log("Draw")
                } else {
                    console.log("PLAYER WINS!")
                }
                setNewDeal(false)
                return
            } else if (dealerTotal === 21) {
                // If dealer has natural 21 and player does not, dealer wins
                console.log("Dealer Wins")
                setNewDeal(false)
                return
            } else if (dealerTotal < 17) {
                // otherwise, draw new card if dealer total less than 17
                async function dealerDraw() {
                    const card = await dealCard(1)
                    if (card.success) {
                        setDealerCards(currCards => [...currCards, card.cards[0]])
                    }
                }
                dealerDraw()
            } else {
                if (dealerTotal > playerTotal && dealerTotal <= 21) {
                    console.log("Dealer Wins")
                } else if (dealerTotal === playerTotal) {
                    console.log("Draw")
                } else {
                    console.log("PLAYER WINS!")
                }
                setNewDeal(false)
            }
        }
    }, [playerTurn, dealerCards])

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
