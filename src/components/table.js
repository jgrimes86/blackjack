import { useEffect, useState } from "react";
import { Box, Button, ButtonGroup, Image, Stack } from '@chakra-ui/react';

function Table() {
    const [deck, setDeck] = useState({deck_id: "", remaining: 0})
    const [hand, setHand] = useState([])

    useEffect(() => {
        fetch('https://www.deckofcardsapi.com/api/deck/new/shuffle/?deck_count=4')
        .then(resp => {
            if (resp.ok) {
                resp.json()
                .then(data => setDeck(data))
            }
        })
    }, [])

    const handleDeal = () => {
        fetch(`https://www.deckofcardsapi.com/api/deck/${deck.deck_id}/draw/?count=2`)
        .then(resp => resp.json())
        .then(deal => {
            dealCard(deal.cards[0]);
            setTimeout(dealCard, 500, deal.cards[1])
        })
    };

    const dealCard = (card) => {
        setHand(currentHand => [...currentHand, card])
    };

    console.log(hand)
    const playerHand = hand ? hand.map((card, index) => {
        return <Image key={index} src={card.image} alt={`${card.value} of ${card.suit}`} boxSize='200px'/>
    }) : null;

    return (
        <div>
            <Button onClick={handleDeal}>Place Bet</Button>
            <Stack direction='row' name='player hand'>
                {playerHand}
            </Stack>
        </div>
    )
}

export default Table

