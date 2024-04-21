import { Button, ButtonGroup, Image, Stack } from '@chakra-ui/react';

import { BlackJackContext } from '../context/BlackJackContext';

function PlayerHand({
    handleStartGame, 
    handleHit, 
    handleStand
}) {
    const { newDeal, playerCards } = BlackJackContext()

    const playerHand = playerCards ? playerCards.map((card, index) => {
        return <Image key={index} src={card.image} alt={`${card.value} of ${card.suit}`} boxSize='200px'/>
    }) : null;

    // buttons shown for player interaction
    const playerButtons = !newDeal
    ? <Button onClick={handleStartGame}>Start Deal</Button>
    : <ButtonGroup>
        <Button onClick={handleHit}>Hit</Button>
        <Button onClick={handleStand}>Stand</Button>
    </ButtonGroup>

    return (
        <div>
            <Stack direction='row' name='player hand'>
                {playerHand}
            </Stack>
            {playerButtons}
        </div>
    )
}

export default PlayerHand