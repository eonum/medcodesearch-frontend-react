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
import TranslatorService from "./services/translator.service";


class App extends Component{

    constructor(props) {
        super(props);
        this.state = {
            language: 'de',
            selectedButton: 'ICD',
            selectedList: 'ICD10-GM-2022',
            selectedDate: new Date(),
            searchResults: [],
        };
        this.updateButton = this.updateButton.bind(this);
        this.updateDate = this.updateDate.bind(this);
        this.updateList = this.updateList.bind(this);
    }
    updateList = (list) => {
        this.setState({selectedList: list})
    }
    updateButton = (btn) => {
        this.setState({selectedButton: btn})
    }
    updateDate = (date) => {
        this.setState({selectedDate: date})
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
                  <Searchbar
                      language={this.state.language}
                      selectedButton={this.state.selectedButton}
                      version={this.state.selectedList}
                      date={this.state.selectedDate}
                      searchResults={this.updateSearchResults}/>
                  <ButtonGroup
                      language={this.state.language}
                      selectedButton={this.updateButton}
                      selectedList={this.updateList}
                      selectedDate={this.updateDate}
                      buttons={[['ICD', 'CHOP', 'DRG', 'TARMED'],['MiGeL', 'AL', 'Medikamente']]}
                  />
                  <div className="searchResults">
                      {this.state.searchResults.map(function(searchResult, i){
                          return <SearchResult result = {searchResult} text={searchResult.highlight.text === undefined ? searchResult.text : searchResult.highlight.text} code={searchResult.code} key={i}/>;
                      })}
                  <div className="container">
                      <div className="row">
                          <div className={this.state.searchResults.length === 0 ? "":"col"}>
                              {searchResults}
                          </div>
                          <div className="col">
                              <Routes>
                                  <Route path="/ICD" element={<Main version="ICD10-GM-2022" catalog="icd_chapters" language={this.state.language}/>} />
                                  <Route path="/CHOP" element={<Main version="CHOP_2014" catalog="chop_chapters" language={this.state.language}/>} />
                                  <Route path="/TARMED" element={<Main version="TARMED_01.09" catalog="tarmed_chapters" language={this.state.language}/>} />
                              </Routes>
                          </div>
                      </div>
                  </div>
                  <Footer/>
              </div>
              </div>
          )
      }

}

export default App;
