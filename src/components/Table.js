import { useEffect } from "react";
import { Box, Button, Stack, Text } from '@chakra-ui/react';

import DealerHand from "./DealerHand";
import PlayerHand from "./PlayerHand";
import PlayerSplitHand from "./PlayerSplitHand";
import SplitHands from "./SplitHands";
import { BlackJackContext } from "../context/BlackJackContext";

function Table() {
    const {
        setDeck, 
        newDeal,
        setNewDeal, 
        setPlayerCards, 
        playerTurn, 
        setPlayerTurn, 
        splitHand, 
        setSplitHand, 
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
        setSplitHand({
            ...splitHand,
            split: false
        })
        setPlayerCards(() => [])
        setPlayerTurn(true)
        setDealerCards(() => [])
        setNewDeal(true)
        firstDeal()
    };
  
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
            <Text>Dealer Hand</Text>
            <DealerHand 
                dealCard={dealCard}
            />
            <Text>
                {(playerTurn) ? dealersFirstCard: `Dealer card value: ${dealerTotal}`}
            </Text>
            <Text>Player Hand</Text>
            {playerArea}
            <Button onClick={handleStartGame} isDisabled={startButtonStatus} >Start Deal</Button>
        </div>
    )
}

export default Table

