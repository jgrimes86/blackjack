import { Box, ChakraProvider, extendTheme } from '@chakra-ui/react'
import './App.css';
import { ContextProvider } from './context/BlackJackContext';
import Table from './components/Table';

const theme = extendTheme({
  colors: {
    green: {
      100: '#C6F6D5',
      500: '#38A169',
      900: '#1C4532',
    }
  }
})

function App() {
  return (
    <ChakraProvider theme={theme}>
      <Box className="App" bg="green.500">
          <ContextProvider>
            <Table />
        </ContextProvider>
      </Box>
    </ChakraProvider>
  );
}

export default App;
