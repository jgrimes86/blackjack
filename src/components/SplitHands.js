import { useEffect } from "react";
import { Box } from "@chakra-ui/react";

import { BlackJackContext } from "../context/BlackJackContext";
import PlayerSplitHand from "./PlayerSplitHand";

function SplitHands() {
    const { splitHand } = BlackJackContext();

    const twoHands = splitHand.hands ? splitHand.hands.map((hand, index) => {
        return <PlayerSplitHand key={index} hand={hand} index={index} />
    }) : null;

    return (
        <Box>
            {twoHands}
        </Box>
    )
}

export default SplitHands