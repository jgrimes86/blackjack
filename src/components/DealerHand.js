import { useEffect } from 'react';
import { Image, Stack } from '@chakra-ui/react';

import { BlackJackContext } from "../context/BlackJackContext";

function DealerHand() {
    const {setNewDeal, playerCards, playerTurn, setPlayerTurn, dealerTurn, splitHand, dealerCards, setDealerCards, setDealersFirstCard, dealerTotal, playerTotal, splitHandTotals, dealCard, wins, setWins} = BlackJackContext();

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

    useEffect(() => {
        if (!playerTurn && dealerCards) {
            if (!splitHand.split) {
                // dealer logic for original (un-split) player hand
                if (playerTotal === 21 && playerCards.length === 2) {
                    // If player has natural 21, check if dealer has natural 21
                    if (dealerTotal === 21) {
                        console.log("Draw")
                        setWins({...wins, draw: wins.draw+1})
                    } else {
                        console.log("PLAYER WINS!")
                        setWins({...wins, player: wins.player+1})
                    }
                    setNewDeal(false)
                    setPlayerTurn(true)
                }
                else if (dealerTotal < 17) {
                    // otherwise, draw new card if dealer total less than 17
                    dealerDraw()
                } else {
                    if (playerTotal > 21) {
                        // if player busts, dealer wins
                        console.log("Dealer Wins.")
                        setWins({...wins, dealer: wins.dealer+1})
                    }
                    else if (dealerTotal <= 21) {
                        if (dealerTotal > playerTotal) {
                            // dealer wins with higher card total
                            console.log("Dealer Wins")
                            setWins({...wins, dealer: wins.dealer+1})
                        } else if (dealerTotal === playerTotal) {
                            // draw when card values are equal
                            console.log("Draw")
                            setWins({...wins, draw: wins.draw+1})
                        } else {
                            // player wins with higher card total
                            console.log("PLAYER WINS!")
                            setWins({...wins, player: wins.player+1})
                        }
                    } else {
                        // player wins if dealer busts and player doesn't
                        console.log("PLAYER WINS!")
                        setWins({...wins, player: wins.player+1})
                    }
                    setNewDeal(false)
                    setPlayerTurn(true)
                }
            } else {
                // dealer logic for split player hand
                if (dealerTotal < 17) {
                    dealerDraw()
                } else {
                    let newWins = {...wins}
                    for (let i=0; i < 2; i++) {
                        // for each split hand
                        if (splitHandTotals[i] > 21) {
                            console.log(`Dealer Wins Against Split Hand #${i+1}`)
                            newWins.dealer++
                        } else if (dealerTotal <= 21) {
                            if (dealerTotal > splitHandTotals[i]) {
                                // dealer wins against hand of lesser value or if split hand busts
                                console.log(`Dealer Wins Against Split Hand #${i+1}`)
                                newWins.dealer++
                            } else if (dealerTotal === splitHandTotals[i]) {
                                // draw if both hands equal
                                console.log(`Dealer Draw With Split Hand #${i+1}`)
                                newWins.draw++
                            } else {
                                // player wins split hand with higher hand total
                                console.log(`PLAYER WINS WITH SPLIT HAND #${i+1}`)
                                newWins.player++
                            }
                        } else {
                                // player hand wins if dealer busts and player doesn't
                                console.log(`PLAYER WINS WITH SPLIT HAND #${i+1}`)
                                newWins.player++

                        }
                    }
                    setWins(newWins)
                    setNewDeal(false)
                    setPlayerTurn(true)
                }
            }
        }
    }, [playerTurn, dealerCards])


    return (
        <Stack direction='row' name='player hand'>
            {dealerTurn ? dealerHandVisible : dealerHandHidden}
        </Stack>
    )
}

export default DealerHand