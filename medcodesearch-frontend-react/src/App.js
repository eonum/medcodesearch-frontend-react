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
            selectedLanguage: 'de',
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
        this.setState({selectedDate: date});
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
                  <img alt="logo" id="logo" src={logo}/>
                  <Searchbar selectedButton={this.state.selectedButton} searchResults={this.updateSearchResults}/>
                  <ButtonGroup
                      language={this.state.selectedLanguage}
                      selectedButton={this.updateButton}
                      selectedList={this.updateList}
                      selectedDate={this.updateDate}
                      buttons={[['ICD', 'CHOP', 'DRG', 'TARMED'],['MiGeL', 'AL', 'Medikamente']]}
                  />
                  <Routes>
                      <Route path="/ICD" element={<Main/>} />
                  </Routes>
                  <div className="searchResults">
                      {this.state.searchResults.map(function(searchResult, i){
                          return <SearchResult result = {searchResult} text={searchResult.highlight.text === undefined ? searchResult.text : searchResult.highlight.text} code={searchResult.code} key={i}/>;
                      })}
                  <div className="container">
                      <div className="row">
                          <div className={this.state.searchResults.length === 0 ? "":"col"}>
                              {this.state.searchResults.map(function(searchResult, i){
                                  return <SearchResult result = {searchResult} key={i}/>
                              })}
                          </div>
                          <div className="col">
                              <Routes>
                                  <Route path="/ICD" element={<Main/>} />
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
