import './App.css';
import './index.css';
import Footer from './Components/Footer/footer';
import Header from './Components/Header/header';
import Main from './Components/Main/Main';
import Searchbar from './Components/Searchbar/Searchbar.js'
import ButtonGroup from "./Components/ButtonGroup/ButtonGroup";
import SearchResult from "./Components/SearchResult/SearchResult";
import {SearchResultModel} from "./models/SearchResult.model";
import logo from "./assets/medcodesearch_big.png";
import {Component, useState} from "react";

class App extends Component{
    constructor(props) {
        super(props);
        this.state = {
            selectedButton: 'ICD',
            searchResults: []
        };
    }

    updateButton = (btn) => {
        this.setState({selectedButton: btn})
    }
    updateSearchResults = (searchResult) => {
        if(searchResult === "reset") {
            this.setState({searchResults: []})
        } else {
            this.setState({
                searchResults: [...this.state.searchResults, searchResult]
            });
        }
    }

      render() {
          return (
              <div className="App">
                  <Header/>
                  <img id="logo" src={logo}/>
                  <Searchbar selectedButton={this.state.selectedButton} searchResults={this.updateSearchResults}/>
                  <ButtonGroup chosenBtn={this.updateButton}
                      buttons={["ICD", "CHOP", "SwissDRG", "TARMED"]}/>
                  <Main/>
                  {this.state.searchResults.map(function(searchResult, i){
                      return <SearchResult text={searchResult.text} code={searchResult.code} key={i}/>;
                  })}
                  <Footer/>
              </div>
          )
      }
}

export default App;
