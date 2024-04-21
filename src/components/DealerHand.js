import { Image, Stack } from '@chakra-ui/react';

import { BlackJackContext } from "../context/BlackJackContext";

function DealerHand() {
    const {playerTurn, dealerCards, setDealersFirstCard} = BlackJackContext();

    const dealerHandHidden = dealerCards
        ? dealerCards.map((card, index) => {
            if (index === 1) {
                return <Image key={index} src={'https://www.deckofcardsapi.com/static/img/back.png'} alt='Image of back of card' boxSize='200px'/>
            } else {
                setDealersFirstCard(`Dealer is showing ${card.value} of ${card.suit}`)
                return <Image key={index} src={card.image} alt={`${card.value} of ${card.suit}`} boxSize='200px'/>
            }
        })
        : null;

    const dealerHandVisible = dealerCards ? dealerCards.map((card, index) => {
        return <Image key={index} src={card.image} alt={`${card.value} of ${card.suit}`} boxSize='200px'/>
    }) : null;

    return (
        <Stack direction='row' name='player hand'>
            {playerTurn ? dealerHandHidden : dealerHandVisible}
        </Stack>
    )
}

export default DealerHand