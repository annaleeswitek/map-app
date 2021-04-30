import './App.css';
import MainMap from './MainMap/MainMap'
import { ChakraProvider } from "@chakra-ui/react"

const App = () => {
  return (
    <ChakraProvider>
      <div className="center">
        <MainMap />
      </div>
    </ChakraProvider>

  );
}

export default App;
