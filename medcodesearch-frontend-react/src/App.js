import './App.css';
import './index.css';
import Footer from './Components/Footer/footer';
import Header from './Components/Header/header';
import Main from './Components/Main/Main';
import Searchbar from './Components/Searchbar/Searchbar.js'
import SearchResult from "./Components/SearchResult/SearchResult";
import logo from "./assets/medcodesearch_big.png";
import {Component} from "react";
import ButtonParentGroup from "./Components/ButtonGroup/ButtonParentGroup";

class App extends Component{
    constructor(props) {
        super(props);
        this.state = {
            selectedButton: 'ICD',
            searchResults: [],
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

      render() {
          return (
              <div className="App">
                  <Header/>
                  <img id="logo" src={logo}/>
                  <Searchbar selectedButton={this.state.selectedButton} searchResults={this.updateSearchResults}/>
                  <ButtonParentGroup chosenBtn={this.updateButton} />
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
