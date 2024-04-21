
// Any cards with a value 'ACE' should come last in the card list
function sortCardsByValue(card1, card2) {
    if (card1.value === 'ACE') {
        return 1
    } else {
        return -1
    }
}

export function totalHandValue(cards) {
    if (cards) {
        let sortedCards = cards.toSorted(sortCardsByValue)
        let values = 0
        for (const card of sortedCards) {
            if (["JACK", "QUEEN", "KING"].includes(card.value)) {
                values = values + 10
            } else if (card.value === "ACE") {
                if (values <= 10) {
                    values = values + 11
                } else {
                    values = values + 1
                }
            } else {
                values = values + parseInt(card.value, 10)
            }
        }
        return values
    } else {
        return 0
    }
}