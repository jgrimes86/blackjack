import { useEffect } from 'react';
import { Button, ButtonGroup, Image, Stack } from '@chakra-ui/react';

function PlayerHand({
    newDeal, 
    setNewDeal,
    playerCards, 
    playerTotal,
    handleStartGame, 
    handleHit, 
    handleStand
}) {

    const playerHand = playerCards ? playerCards.map((card, index) => {
        return <Image key={index} src={card.image} alt={`${card.value} of ${card.suit}`} boxSize='200px'/>
    }) : null;

    // buttons shown for player interaction
    const playerButtons = !newDeal
    ? <Button onClick={handleStartGame}>Place Bet</Button>
    : <ButtonGroup>
        <Button onClick={handleHit}>Hit</Button>
        <Button onClick={handleStand}>Stand</Button>
    </ButtonGroup>

    // useEffect runs when player gets new card
    useEffect(() => {
        if (playerCards && playerTotal) {
            if (playerTotal === 21) {
                console.log("PLAYER WINS!")
                setNewDeal(false)
            } else if (playerTotal > 21) {
                console.log("PLAYER BUSTS!");
                setNewDeal(false)
            }
        }
    }, [playerCards])

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