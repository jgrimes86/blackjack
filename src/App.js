import './App.css';
import { ContextProvider } from './context/BlackJackContext';
import Table from './components/Table';

function App() {
  return (
    <div className="App">
      <ContextProvider>
        <Table />
      </ContextProvider>
    </div>
  );
}

export default App;
