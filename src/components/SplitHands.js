import { Box } from "@chakra-ui/react"

import { BlackJackContext } from "../context/BlackJackContext"
import PlayerSplitHand from "./PlayerSplitHand";

function SplitHands() {

    const { playerSplit } = BlackJackContext();

    const splitHands = playerSplit.hands ? playerSplit.hands.map((hand, index) => {
        return <PlayerSplitHand key={index} hand={hand} index={index} />
    }) : null;

    return (
        <Box>
            {splitHands}
        </Box>
    )
}

export default SplitHands