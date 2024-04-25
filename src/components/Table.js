import { useEffect } from "react";
import { Box, Button, Stack, Text } from '@chakra-ui/react';

import DealerHand from "./DealerHand";
import PlayerHand from "./PlayerHand";
import Scoreboard from "./Scoreboard";
import SplitHands from "./SplitHands";
import { BlackJackContext } from "../context/BlackJackContext";

function Table() {
    const {
        deck,
        setDeck, 
        newDeal,
        setNewDeal, 
        setPlayerCards, 
        playerTurn, 
        setPlayerTurn, 
        dealerTurn,
        setDealerTurn,
        splitHand, 
        setSplitHand, 
        setDealerCards, 
        dealersFirstCard, 
        playerTotal, 
        dealerTotal,
        dealCard
    } = BlackJackContext();

    const shuffleDeck = async () => {
        return fetch(`https://www.deckofcardsapi.com/api/deck/${deck.deck_id}/shuffle/`)
        .then(resp => {
            if (resp.ok) {
                resp.json()
                .then(data => setDeck(data))
            }
        })
    }

    const handleStartGame = async () => {
        if (deck.remaining < 40) {
            await shuffleDeck()
            resetState()
        } else {
            resetState()
        }
    };
    
    const resetState = () => {
        setSplitHand({
            split: false,
            splitHand: 0,
            hands: []
        })
        setPlayerCards(() => [])
        setPlayerTurn(true)
        setDealerTurn(false)
        setDealerCards(() => [])
        setNewDeal(true)
        firstDeal()
    }
    
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

    const playerArea = !splitHand.split
        ? <PlayerHand handleStartGame={handleStartGame} />
        : <SplitHands />;
    
    const startButtonStatus = newDeal ? true : false;

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
            <Text>Blackjack</Text>
            <Scoreboard />
            <Text>Dealer Hand</Text>
            <DealerHand 
                dealCard={dealCard}
            />
            <Text>
                {dealerTurn ? `Dealer card value: ${dealerTotal}` : dealersFirstCard}
            </Text>
            <Text>Player Hand</Text>
            {playerArea}
            {deck.success && <Button onClick={handleStartGame} isDisabled={startButtonStatus} >Start Deal</Button>}
        </div>
    )
}

export default Table

