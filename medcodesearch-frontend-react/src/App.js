import './App.css';
import Button from 'react-bootstrap/Button';
import Footer from './Components/Footer/footer';
import Header from './Components/Header/header';
import Main from './Components/Main/Main';
import Searchbar from './Components/Searchbar.js'
import ButtonGroup from "./Components/ButtonGroup";
import logo from "./assets/medcodesearch_big.png";

function App() {
  return (
    <div className="App">
        <Header/>
        <img id="logo" src={logo}/>
        <Searchbar />
        <ButtonGroup
            buttons={["ICD", "CHOP", "SwissDRG", "TARMED"]}
        />
        <Main />
        <Footer/>
    </div>
  );
}

export default App;
