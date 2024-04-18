import { useEffect, useState } from "react"

function Table() {
    const [deck, setDeck] = useState({deck_id: "", remaining: 0})

    console.log(deck)

    useEffect(() => {
        fetch('https://www.deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1')
        .then(resp => {
            if (resp.ok) {
                resp.json()
                .then(data => setDeck(data))
            }
        })
    }, [])

    return (
        <div>The Table</div>
    )
}

export default Table

