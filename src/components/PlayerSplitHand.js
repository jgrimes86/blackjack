import { Button, ButtonGroup, Image, Stack, Text } from '@chakra-ui/react';

import { BlackJackContext } from '../context/BlackJackContext';

function PlayerSplitHand({
    hand,
    index
}) {
    const { newDeal, playerCards, playerSplit, setPlayerSplit, canPlayerSplit, setCanPlayerSplit, playerTotal } = BlackJackContext()


    const splitHand = hand ? hand.map((card, index) => {
        return <Image key={index} src={card.image} alt={`${card.value} of ${card.suit}`} boxSize='200px'/>
    }) : null;

    const handleHit = () => {}

    const handleStand = () => {}

    const activeHand = (playerSplit.splitHand === index) ? false : true;

    return (
        <div>
            {splitHand}
            <ButtonGroup isDisabled={activeHand}>
                <Button onClick={handleHit()}>Hit</Button>
                <Button onClick={handleStand()}>Stand</Button>
            </ButtonGroup>
        </div>
    )
}

export default PlayerSplitHand