import { useEffect, useState } from "react";
import { Text } from '@chakra-ui/react';

import DealerHand from "./DealerHand";
import PlayerHand from "./PlayerHand";
import { totalHandValue } from "../tools/handValue";

function Table() {
    const [deck, setDeck] = useState({deck_id: "", remaining: 0})
    const [newDeal, setNewDeal] = useState(false)
    const [playerCards, setPlayerCards] = useState([])
    const [playerTurn, setPlayerTurn] = useState(true)
    const [dealerCards, setDealerCards] = useState([])
    const playerTotal = totalHandValue(playerCards)
    const dealerTotal = totalHandValue(dealerCards)

    // get cards from Deck of Cards API
    const dealCard = async (draw) => {
        return fetch(`https://www.deckofcardsapi.com/api/deck/${deck.deck_id}/draw/?count=${draw}`)
        .then(resp => resp.json())
    };

    // start a new hand by drawing two cards for the player
    const handleStartGame = async () => {
        setPlayerCards(() => [])
        setPlayerTurn(true)
        setDealerCards(() => [])
        setNewDeal(true)
        const firstCard = await dealCard(1)
        if (firstCard.success) {
            setPlayerCards([firstCard.cards[0]])
        }
        const secondCard = await dealCard(1)
        if (secondCard.success) {
            setPlayerCards(currCards => [...currCards, secondCard.cards[0]])
        }
    };

    // deal player one more card
    const handleHit = async () => {
        const newCard = await dealCard(1)
        if (newCard.success) {
            setPlayerCards(currCards => [...currCards, newCard.cards[0]])
        }
    }

    // end player turn
    const handleStand = () => {
        setPlayerTurn(false)
    }
  
    // useEffect runs when page loads to retreive new deck info
    useEffect(() => {
        fetch('https://www.deckofcardsapi.com/api/deck/new/shuffle/?deck_count=4')
        .then(resp => {
            if (resp.ok) {
                resp.json()
                .then(data => setDeck(data))
            }
        })
    }, [])

    return (
        <div>
            <Text>Dealer Hand</Text>
            <DealerHand 
                setNewDeal={setNewDeal}
                dealerCards={dealerCards}
                setDealerCards={setDealerCards}
                playerTurn={playerTurn}
                dealCard={dealCard}
                dealerTotal={dealerTotal}
                playerTotal={playerTotal}
            />
            <Text>Dealer card value: {dealerTotal}</Text>
            <Text>Player Hand</Text>
            <PlayerHand 
                newDeal={newDeal}
                setNewDeal={setNewDeal}
                playerCards={playerCards}
                playerTotal={playerTotal}
                handleStartGame={handleStartGame}
                handleHit={handleHit}
                handleStand={handleStand}
            />
            <Text>Player card value: {playerTotal}</Text>
        </div>
    )
}

export default Table

