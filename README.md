
[Deck of Cards API](https://www.deckofcardsapi.com/)

[Blackjack rules](https://bicyclecards.com/how-to-play/blackjack/)

TODO:

- Player Split Hand
    - confirm correct behavior - deal additional cards as soon as hand is split? or wait for player to hit as the play each split hand in turn?
    - if split hand was pair of Aces, only give one additional card for each hand before ending player's turn

- Insurance?

- ~~correct dealer behavior when player hits 21 but not a natural 21 (as of now, dealer does not draw cards if under 17. acting like player has natural 21)~~

- Correct dealer behavior after player busts
    - if one hand, show dealer cards, don't draw any more dealer cards, and count it as dealer's win
    - if split hand, dealer draws and compares against both hands?

- Score board

- Way to keep track of card count & re-shuffle deck when remaining cards hits a certain limit
