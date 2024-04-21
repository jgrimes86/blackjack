import { useEffect } from "react";
import { Text } from '@chakra-ui/react';

import DealerHand from "./DealerHand";
import PlayerHand from "./PlayerHand";
import { BlackJackContext } from "../context/BlackJackContext";

function Table() {
    const {
        setDeck, 
        setNewDeal, 
        setPlayerCards, 
        playerTurn, 
        setPlayerTurn, 
        playerSplit, 
        setPlayerSplit, 
        setDealerCards, 
        dealersFirstCard, 
        playerTotal, 
        dealerTotal,
        dealCard
    } = BlackJackContext();

    const firstDeal = async () => {
        const firstPlayerCard = await dealCard(1)
        if (firstPlayerCard.success) {
            setPlayerCards([firstPlayerCard.cards[0]])
        }
        const firstDealerCard = await dealCard(1)
        if (firstDealerCard.success) {
            setDealerCards([firstDealerCard.cards[0]])
        }
        const secondPlayerCard = await dealCard(1)
        if (secondPlayerCard.success) {
            setPlayerCards(currCards => [...currCards, secondPlayerCard.cards[0]])
        }
        const secondDealerCard = await dealCard(1)
        if (secondDealerCard.success) {
            setDealerCards(currCards => [...currCards, secondDealerCard.cards[0]])
        }
    }

    // start a new hand by drawing two cards for the player
    const handleStartGame = async () => {
        setPlayerCards(() => [])
        setPlayerTurn(true)
        setDealerCards(() => [])
        setNewDeal(true)
        firstDeal()
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
        if (playerSplit.split === false || playerSplit.splitHand === 1) {
            setPlayerTurn(false)
        } else {
            setPlayerSplit({
                ...playerSplit,
                splitHand: 1
            })
        }
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
                dealCard={dealCard}
            />
            <Text>
                {(playerTurn && dealersFirstCard) ? dealersFirstCard: `Dealer card value: ${dealerTotal}`}
            </Text>
            <Text>Player Hand</Text>
            <PlayerHand 
                handleStartGame={handleStartGame}
                handleHit={handleHit}
                handleStand={handleStand}
            />
            <Text>Player card value: {playerTotal}</Text>
        </div>
    )
}

export default Table

