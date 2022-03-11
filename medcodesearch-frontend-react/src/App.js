import './App.css';
import Searchbar from './Components/Searchbar.js'
import ButtonGroup from "./Components/ButtonGroup";
import logo from "./assets/medcodesearch_big.png";

function App() {
  return (
    <div className="App">
        <img id="logo" src={logo}/>
        <Searchbar />
        <ButtonGroup
            buttons={["ICD", "CHOP", "SwissDRG", "TARMED"]}
        />
    </div>
  );
}

export default App;
