import { useEffect } from 'react';
import { Image, Stack } from '@chakra-ui/react';

import { BlackJackContext } from "../context/BlackJackContext";

function DealerHand() {
    const {setNewDeal, playerCards, playerTurn, setPlayerTurn, splitHand, dealerCards, setDealerCards, setDealersFirstCard, dealerTotal, playerTotal, splitHandTotals, dealCard, wins, setWins} = BlackJackContext();

    const dealerHandHidden = dealerCards
        ? dealerCards.map((card, index) => {
            if (index === 1) {
                return <Image key={index} src={'https://www.deckofcardsapi.com/static/img/back.png'} alt='Image of back of card' boxSize='200px'/>
            } else {
                return <Image key={index} src={card.image} alt={`${card.value} of ${card.suit}`} boxSize='200px'/>
            }
        })
        : null;

    const dealerHandVisible = dealerCards ? dealerCards.map((card, index) => {
        return <Image key={index} src={card.image} alt={`${card.value} of ${card.suit}`} boxSize='200px'/>
    }) : null;

    const dealerDraw = async () => {
        const card = await dealCard(1)
        if (card.success) {
            setDealerCards(currCards => [...currCards, card.cards[0]])
        }
    }

    useEffect(() => {
        if (dealerCards.length > 1) {
            const dealerSecondCard = dealerCards[1]
            setDealersFirstCard(`Dealer is showing ${dealerSecondCard.value} of ${dealerSecondCard.suit}`)
        }
    }, [dealerCards])

    // useEffect runs when player ends turn and when dealer draws cards
    useEffect(() => {
        if (!playerTurn && dealerCards) {
            if (!splitHand.split) {
                // dealer logic for original (un-split) player hand
                if (playerTotal === 21 && playerCards.length === 2) {
                    // If player has 21, check if dealer has natural 21
                    if (dealerTotal === 21) {
                        console.log("Draw")
                        setWins({...wins, draw: wins.draw+1})
                    } else {
                        console.log("PLAYER WINS!")
                        setWins({...wins, player: wins.player+1})
                    }
                    setNewDeal(false)
                }
                // else if (dealerTotal === 21) {
                //     // If dealer has natural 21 and player does not, dealer wins
                //     console.log("Dealer Wins")
                //     setNewDeal(false)
                //     return
                // } 
                else if (dealerTotal < 17) {
                    // otherwise, draw new card if dealer total less than 17
                    dealerDraw()
                } else {
                    if (dealerTotal <= 21) {
                        if (dealerTotal > playerTotal || playerTotal > 21) {
                            console.log("Dealer Wins")
                            setWins({...wins, dealer: wins.dealer+1})
                        } else if (dealerTotal === playerTotal) {
                            console.log("Draw")
                            setWins({...wins, draw: wins.draw+1})
                        } else {
                            console.log("PLAYER WINS!")
                            setWins({...wins, player: wins.player+1})
                        }
                    } else {
                        if (playerTotal <= 21) {
                            console.log("PLAYER WINS!")
                            setWins({...wins, player: wins.player+1})
                        } else {
                            console.log("Dealer Wins")
                            setWins({...wins, dealer: wins.dealer+1})
                        }
                    }
                    setNewDeal(false)
                }
            } else {
                // dealer logic for split player hand
                if (splitHandTotals[0] <= 21 || splitHandTotals[1] <= 21) {
                    if (dealerTotal < 17) {
                        dealerDraw()
                    } else {
                        for (let i=0; i < 2; i++) {
                            if (dealerTotal <= 21) {
                                if (dealerTotal > splitHandTotals[i] || splitHandTotals[i] > 21) {
                                    console.log(`Dealer Wins Against Split Hand #${i+1}`)
                                    setWins({...wins, dealer: wins.dealer+1})
                                } else if (dealerTotal === splitHandTotals[i]) {
                                    console.log(`Dealer Draw With Split Hand #${i+1}`)
                                    setWins({...wins, draw: wins.draw+1})
                                } else {
                                    console.log(`PLAYER WINS WITH SPLIT HAND #${i+1}`)
                                    setWins({...wins, player: wins.player+1})
                                }
                            } else {
                                if (splitHandTotals[i] <= 21) {
                                    console.log(`PLAYER WINS WITH SPLIT HAND #${i+1}`)
                                    setWins({...wins, player: wins.player+1})
                                } else {
                                    console.log(`Dealer Wins Against Split Hand #${i+1}`)
                                    setWins({...wins, dealer: wins.dealer+1})
                                }
                            }
                        }
                    }
                } else {
                    console.log("Dealer Wins")
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