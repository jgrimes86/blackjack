import { useEffect, useState } from "react";
import { Button, ButtonGroup, Image, Stack, Text } from '@chakra-ui/react';

// Any cards with a value 'ACE' should come last in the card list
function sortCardsByValue(card1, card2) {
    if (card1.value === 'ACE') {
        return 1
    } else {
        return -1
    }
}

function totalHandValue(cards) {
    if (cards) {
        let sortedCards = cards.toSorted(sortCardsByValue)
        let values = 0
        for (const card of sortedCards) {
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

    const playerHand = playerCards ? playerCards.map((card, index) => {
        return <Image key={index} src={card.image} alt={`${card.value} of ${card.suit}`} boxSize='200px'/>
    }) : null;

    const dealerHand = dealerCards ? dealerCards.map((card, index) => {
        return <Image key={index} src={card.image} alt={`${card.value} of ${card.suit}`} boxSize='200px'/>
    }) : null;

    // buttons shown for player interaction
    const playerButtons = !newDeal
        ? <Button onClick={handleStartGame}>Place Bet</Button>
        : <ButtonGroup>
            <Button onClick={handleHit}>Hit</Button>
            <Button onClick={handleStand}>Stand</Button>
        </ButtonGroup>
    
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

    // useEffect runs when player gets new card
    useEffect(() => {
        if (playerHand && playerTotal) {
            if (playerTotal === 21) {
                console.log("PLAYER WINS!")
                setNewDeal(false)
            } else if (playerTotal > 21) {
                console.log("PLAYER BUSTS!");
                setNewDeal(false)
            }
        }
    }, [playerHand])

    // useEffect runs when player ends turn and when dealer draws cards
    useEffect(() => {
        if (!playerTurn && !dealerCards) {
            // if dealer has no cards yet, get two cards
            async function dealerFirstTurn() {
                const cards = await dealCard(2)
                if (cards.success) {
                    setDealerCards(cards.cards)
                }
            }
            dealerFirstTurn()
        } else if (!playerTurn && dealerCards) {
            // if dealer has cards, draw new card if dealer total less than 17
            if (dealerTotal < 17) {
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

    return (
        <div>
            <Text>Dealer Hand</Text>
            <Stack direction='row' name='player hand'>
                {dealerHand}
            </Stack>
            <Text>Dealer card value: {dealerTotal}</Text>
            <Text>Player Hand</Text>
            <Stack direction='row' name='player hand'>
                {playerHand}
            </Stack>
            {playerButtons}
            <Text>Player card value: {playerTotal}</Text>
        </div>
    )
}

export default Table

