import { useEffect } from "react";
import { Image, Stack } from '@chakra-ui/react';

function DealerHand({
    setNewDeal,
    dealerCards, 
    setDealerCards,
    playerTurn,
    dealCard,
    dealerTotal,
    playerTotal,
}) {

    const dealerHand = dealerCards ? dealerCards.map((card, index) => {
        return <Image key={index} src={card.image} alt={`${card.value} of ${card.suit}`} boxSize='200px'/>
    }) : null;

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
        <Stack direction='row' name='player hand'>
                {dealerHand}
        </Stack>
    )
}

export default DealerHand