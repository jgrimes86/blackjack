import { useEffect } from "react";
import { Image, Stack } from '@chakra-ui/react';

function DealerHand({
    setNewDeal,
    dealerCards, 
    setDealerCards,
    setDealersFirstCard,
    playerTurn,
    dealCard,
    dealerTotal,
    playerTotal,
}) {

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

    // useEffect runs when player ends turn and when dealer draws cards
    useEffect(() => {
        if (!playerTurn && dealerCards) {
            if (playerTotal === 21) {
                // If player has natural 21, check if dealer also has natural 21
                if (dealerTotal === 21) {
                    console.log("Draw")
                } else {
                    console.log("PLAYER WINS!")
                }
                setNewDeal(false)
                return
            } else if (dealerTotal === 21) {
                // If dealer has natural 21 and player does not, dealer wins
                console.log("Dealer Wins")
                setNewDeal(false)
                return
            } else if (dealerTotal < 17) {
                // otherwise, draw new card if dealer total less than 17
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
        <Stack direction='row' name='player hand'>
            {playerTurn ? dealerHandHidden : dealerHandVisible}
        </Stack>
    )
}

export default DealerHand