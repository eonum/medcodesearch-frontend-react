import './App.css';
import './index.css';
import Footer from './Components/Footer/footer';
import Header from './Components/Header/header';
import Main from './Components/Main/Main';
import Searchbar from './Components/Searchbar/Searchbar.js'
import SearchResult from "./Components/SearchResult/SearchResult";
import logo from "./assets/medcodesearch_big.png";
import {Component} from "react";
import {Outlet, Route, Routes, useLocation, useNavigate, useSearchParams} from "react-router-dom";
import ButtonGroup from "./Components/ButtonGroup/ButtonGroup";
import TranslatorService from "./Services/translator.service";
import RouterService from "./Services/router.service";


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

    componentDidUpdate(prevProps: Readonly<P>, prevState: Readonly<S>, snapshot: SS) {
        let navigate = this.props.navigation
        if(prevState.language !== this.state.language ||
            prevState.selectedButton !== this.state.selectedButton ||
            prevState.selectedList !== this.state.selectedList ||
            prevState.selectedDate !== this.state.selectedDate) {
            navigate({pathname: this.state.language + "/" + this.state.selectedButton + "/" + this.state.selectedList + "/" + this.state.selectedButton.toLowerCase() + "_chapters",
                search: RouterService.getQueryVariable('query') === "" ? "" : "?query=" + RouterService.getQueryVariable('query')})
        }
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
                      buttons={[['ICD', 'CHOP', 'SwissDRG', 'TARMED'],['MiGeL', 'AL', 'Medikamente']]}
                  />
                  <div className="searchResults">
                  <div className="container">
                      <div className="row">
                          <div className={this.state.searchResults.length === 0 ? "":"col"}>
                              {searchResults}
                          </div>
                          <div className="col">
                              <Outlet>
                              </Outlet>
                          </div>
                      </div>
                  </div>
                  <Footer/>
              </div>
              </div>
          )
      }

}

export default function(props) {
    const navigation = useNavigate();
    return <App {...props} navigation={navigation}/>;
}
