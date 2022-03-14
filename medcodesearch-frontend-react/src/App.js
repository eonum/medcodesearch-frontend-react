import './App.css';
import './index.css';
import Footer from './Components/Footer/footer';
import Header from './Components/Header/header';
import Main from './Components/Main/Main';
import Searchbar from './Components/Searchbar.js'
import ButtonGroup from "./Components/ButtonGroup";
import logo from "./assets/medcodesearch_big.png";
import {Component} from "react";

class App extends Component{
    constructor(props) {
        super(props);
        this.state = {
            list: 'drgs'
        };
    }
      render() {
          return (
              <div className="App">
                  <Header/>
                  <img id="logo" src={logo}/>
                  <Searchbar list={this.state.list}/>
                  <ButtonGroup
                      buttons={["ICD", "CHOP", "SwissDRG", "TARMED"]}/>
                  <Main/>
                  <Footer/>
              </div>
          )
      }
}

export default App;