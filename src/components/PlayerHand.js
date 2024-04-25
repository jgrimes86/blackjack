import { useEffect } from 'react';
import { Button, ButtonGroup, Image, Stack, Text } from '@chakra-ui/react';

import { BlackJackContext } from '../context/BlackJackContext';

function PlayerHand() {
    const { dealCard, newDeal, setNewDeal, playerCards, setPlayerCards, setPlayerTurn, setDealerTurn, splitHand, setSplitHand, canPlayerSplit, setCanPlayerSplit, playerTotal } = BlackJackContext()

    const playerHand = playerCards ? playerCards.map((card, index) => {
        return <Image key={index} src={card.image} alt={`${card.value} of ${card.suit}`} boxSize='200px'/>
    }) : null;

    // deal player one more card
    const handleHit = async () => {
        const newCard = await dealCard(1)
        if (newCard.success) {
            setPlayerCards(currCards => [...currCards, newCard.cards[0]])
        }
    }

    // end player turn
    const handleStand = () => {
        if (splitHand.split === false) {
            setPlayerTurn(false)
            setDealerTurn(true)
        } else {
            setSplitHand({
                ...splitHand,
                splitHand: 1
            })
        }
    }

    const handleSplit = () => {
        setSplitHand({
            ...splitHand,
            split: true,
            hands: [[playerCards[0]], [playerCards[1]]]
        })
        setCanPlayerSplit(false)
    }

    // useEffect runs when player gets new card
    useEffect(() => {
        if (playerCards && playerTotal && splitHand.split === false) {
            if (playerTotal === 21) {
                setPlayerTurn(false)
                setDealerTurn(true)
            } else if (playerTotal > 21) {
                console.log("PLAYER BUSTS!");
                setPlayerTurn(false)
                setNewDeal(false)
                setDealerTurn(true)
            }
        }

        if (playerCards) {
            if (playerCards.length === 2 && !splitHand.split) {
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

    // buttons shown for player interaction
    const playerButtons = newDeal
    ? <ButtonGroup>
        <Button onClick={handleHit}>Hit</Button>
        <Button onClick={handleStand}>Stand</Button>
        <Button onClick={handleSplit} isDisabled={!canPlayerSplit}>Split</Button>
    </ButtonGroup>
    : null;

    return (
        <div>
            <Stack direction='row' name='player hand'>
                {playerHand}
            </Stack>
            <Text>Player card value: {playerTotal}</Text>
            {playerButtons}
        </div>
    )
}

export default PlayerHand