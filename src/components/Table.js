import { useEffect, useState } from "react";
import { Box, Button, ButtonGroup, Image, Stack, Text } from '@chakra-ui/react';

function totalHandValue(cards) {
    if (cards) {
        let values = 0
        for (const card of cards) {
            if (["JACK", "QUEEN", "KING"].includes(card.value)) {
                values = values + 10
            } else if (card.value === "ACE") {
                if (values <= 10) {
                    values = values + 11
                } else {
                    values = values + 1
                }
            } else {
                values = values + parseInt(card.value, 10)
            }
        }
        return values
    } else {
        return 0
    }

}

function Table() {
    const [deck, setDeck] = useState({deck_id: "", remaining: 0})
    const [newDeal, setNewDeal] = useState(false)
    const [playerCards, setPlayerCards] = useState([])
    const [playerTurn, setPlayerTurn] = useState(true)
    const [dealerCards, setDealerCards] = useState([])
    const playerTotal = totalHandValue(playerCards)
    const dealerTotal = totalHandValue(dealerCards)

    console.log('player turn: ',playerTurn)
    console.log('player cards: ',playerCards)
    console.log('dealer cards: ',dealerCards)
    console.log('player total: ',playerTotal)
    console.log('dealer total: ',dealerTotal)

    const dealCard = async (draw) => {
        return fetch(`https://www.deckofcardsapi.com/api/deck/${deck.deck_id}/draw/?count=${draw}`)
        .then(resp => resp.json())
    };

    const handleStartGame = async () => {
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

    const handleHit = async () => {
        const newCard = await dealCard(1)
        if (newCard.success) {
            setPlayerCards(currCards => [...currCards, newCard.cards[0]])
        }
    }

    const handleStand = () => {
        setPlayerTurn(false)
    }

    const dealerHand = dealerCards ? dealerCards.map((card, index) => {
        return <Image key={index} src={card.image} alt={`${card.value} of ${card.suit}`} boxSize='200px'/>
    }) : null;

    const playerHand = playerCards ? playerCards.map((card, index) => {
        return <Image key={index} src={card.image} alt={`${card.value} of ${card.suit}`} boxSize='200px'/>
    }) : null;

    const playerButtons = !newDeal
        ? <Button onClick={handleStartGame}>Place Bet</Button>
        : <ButtonGroup>
            <Button onClick={handleHit}>Hit</Button>
            <Button onClick={handleStand}>Stand</Button>
        </ButtonGroup>
    
    useEffect(() => {
        fetch('https://www.deckofcardsapi.com/api/deck/new/shuffle/?deck_count=4')
        .then(resp => {
            if (resp.ok) {
                resp.json()
                .then(data => setDeck(data))
            }
        })
    }, [])

    useEffect(() => {
        if (!playerTurn) {
            async function dealerTurn() {
                const cards = await dealCard(2)
                if (cards.success) {
                    setDealerCards(cards.cards)
                }
            }
            dealerTurn()
        }
    }, [playerTurn])

    return (
        <div>
            <Text>Dealer Hand</Text>
            <Stack direction='row' name='player hand'>
                {dealerHand}
            </Stack>
            <Text>Player Hand</Text>
            <Stack direction='row' name='player hand'>
                {playerHand}
            </Stack>
            {playerButtons}
        </div>
    )
}

export default Table

