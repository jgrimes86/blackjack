import { Box, Button, Stack, Text } from '@chakra-ui/react';

import { BlackJackContext } from "../context/BlackJackContext";

function Scoreboard() {
    const { wins } = BlackJackContext();

    // const titles = ['Player', 'Dealer', 'Draw']

    const scores = () => {
        const tallies = []
        for (const category in wins) {
            tallies.push(<Stack key={category}>
                <Text>{category}</Text>
                <Text>{wins[category]}</Text>
            </Stack>)
        }
        return tallies
    }

    return (
        <Box>
            <Text>Scoreboard</Text>
            <Stack direction='row'>
                {scores()}
            </Stack>
        </Box>
    )

}

export default Scoreboard