import './App.css';
import './index.css';
import Footer from './Components/Footer/footer';
import Header from './Components/Header/header';
import Main from './Components/Main/Main';
import Searchbar from './Components/Searchbar/Searchbar.js'
import ButtonGroup from "./Components/ButtonGroup/ButtonGroup";
import SearchResult from "./Components/SearchResult/SearchResult";
import logo from "./assets/medcodesearch_big.png";
import React, {Component} from "react";
import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import TranslatorService from "./services/translator.service";

class App extends Component{

    constructor(props) {
        super(props);
        this.state = {
            selectedButton: "ICD",
            searchResults: [],
            language: 'de'
        };
    }

    hideComponent() {
        this.setState({ showHideCalender: !this.state.showHideCalender });
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
    updateLanguage = (lang) => {
        this.setState({language: lang})
    }


    render() {
        let searchResults;
        if(this.state.searchResults[0] === "empty") {
            searchResults = <div className="searchResult"><p>{TranslatorService.searchNoMatch(this.state.language)}</p></div>
        } else {
            searchResults =
                <div>
                {this.state.searchResults.map(function(searchResult, i){
                    return <SearchResult result = {searchResult} key={i}/>
                })}
                </div>
        }
          return (
              <div className="App">
                  <Header language={this.updateLanguage}/>
                  <img alt="logo" id="logo" src={logo}/>
                  <Searchbar language={this.state.language} selectedButton={this.state.selectedButton} searchResults={this.updateSearchResults}/>
                  <ButtonGroup chosenBtn={this.updateButton}
                      buttons={["ICD", "CHOP", "SwissDRG", "TARMED"]}/>
                  <div className="container">
                      <div className="row">
                          <div className={this.state.searchResults.length === 0 ? "":"col"}>
                              {searchResults}
                          </div>
                          <div className="col">
                              <Routes>
                                  <Route path="/ICD" element={<Main language={this.state.language}/>} />
                              </Routes>
                          </div>
                      </div>
                  </div>
                  <Footer/>
              </div>
          )
      }
}

export default App;
