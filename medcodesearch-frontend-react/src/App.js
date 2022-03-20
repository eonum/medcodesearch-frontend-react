import './App.css';
import './index.css';
import Footer from './Components/Footer/footer';
import Header from './Components/Header/header';
import Main from './Components/Main/Main';
import Searchbar from './Components/Searchbar/Searchbar.js'
import SearchResult from "./Components/SearchResult/SearchResult";
import logo from "./assets/medcodesearch_big.png";
import {Component} from "react";
import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import ButtonGroup from "./Components/ButtonGroup/ButtonGroup";

class App extends Component{

    constructor(props) {
        super(props);
        this.state = {
            selectedButton: 'ICD',
            selectedList: 'ICD10-GM-2022',
            searchResults: [],
        };
    }
    updateList = (list) => {
        this.setState({selectedList: list})
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
                  <ButtonGroup
                      buttons={['ICD', 'DRG']}

                  />
                  <Main/>
                  {this.state.searchResults.map(function(searchResult, i){
                      return <SearchResult text={searchResult.text} code={searchResult.code} key={i}/>;
                  })}
                  <Routes>
                      <Route path="/ICD" element={<Main/>} />
                  </Routes>
                  <div className="searchResults">
                      {this.state.searchResults.map(function(searchResult, i){
                          return <SearchResult result = {searchResult} text={searchResult.highlight.text === undefined ? searchResult.text : searchResult.highlight.text} code={searchResult.code} key={i}/>;
                      })}
                  </div>
                  <Footer/>
              </div>
          )
      }
}

export default App;
