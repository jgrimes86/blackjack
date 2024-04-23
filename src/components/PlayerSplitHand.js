import { useEffect } from 'react';
import { Button, ButtonGroup, Image, Stack, Text } from '@chakra-ui/react';

import { BlackJackContext } from '../context/BlackJackContext';
import { totalHandValue } from '../tools/handValue';

function PlayerSplitHand({
    hand,
    index
}) {
    const { newDeal, setNewDeal, playerCards, playerTurn, setPlayerTurn, splitHand, setSplitHand, canPlayerSplit, setCanPlayerSplit, playerTotal, dealCard } = BlackJackContext()

    const cards = hand ? hand.map((card, index) => {
        return <Image key={index} src={card.image} alt={`${card.value} of ${card.suit}`} boxSize='200px'/>
    }) : null;

    const handValue = totalHandValue(hand);
    
    const activeHand = (splitHand.splitHand === index && playerTurn) ? false : true;
    
    const handleHit = async () => {
        const newCard = await dealCard(1)
        if (newCard.success) {
            splitHand.hands[index].push(newCard.cards[0])
            setSplitHand({...splitHand})        }
    }

    const handleStand = () => {
        if (splitHand.splitHand === 0 && index === 0) {
            setSplitHand({...splitHand, splitHand: 1})
        } else if (splitHand.splitHand === 1 && index === 1){
            setNewDeal(false)
            setPlayerTurn(false)
        }
    }
    
    // deals one additional card to each split hand after split
    useEffect(() => {
        if (hand.length === 1) {
            const createSplitHand = async () => {
                const newCard = await dealCard(1)
                if (newCard.success) {
                    splitHand.hands[index].push(newCard.cards[0])
                    setSplitHand({...splitHand})
                }
            }
            createSplitHand();
        }
    }, [])

    // runs when player gets new card; checks value of player's split hand
    useEffect(() => {
        if (splitHand.splitHand === index && handValue) {
            if (handValue >= 21) {
                if (splitHand.splitHand === 0 && index === 0) {
                    setSplitHand({...splitHand, splitHand: 1})
                } else if (splitHand.splitHand === 1 && index === 1){
                    setNewDeal(false)
                    setPlayerTurn(false)
                }
            }
        }

    }, [splitHand])

    return (
        <div>
            <Stack direction='row' name={`split hand ${index}`}>
                {cards}
            </Stack>
            <Text>Hand total: {handValue}</Text>
            <ButtonGroup isDisabled={activeHand}>
                <Button onClick={handleHit}>Hit</Button>
                <Button onClick={handleStand}>Stand</Button>
            </ButtonGroup>
        </div>
    )
}

export default PlayerSplitHand