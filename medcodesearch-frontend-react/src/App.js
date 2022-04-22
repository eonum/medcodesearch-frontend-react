import './App.css';
import './index.css';
import Footer from './Components/Footer/footer';
import Header from './Components/Header/header';
import Searchbar from './Components/Searchbar/Searchbar.js'
import SearchResult from "./Components/SearchResult/SearchResult";
import logo from "./assets/medcodesearch_big.png";
import {Outlet, useNavigate, useParams} from "react-router-dom";
import ButtonGroup from "./Components/ButtonGroup/ButtonGroup";
import RouterService from "./Services/router.service";
import deJson from "./assets/translations/de.json";
import frJson from "./assets/translations/fr.json";
import enJson from "./assets/translations/en.json";
import itJson from "./assets/translations/it.json";
import {Component} from "react";
import convertDate from "./Services/ConvertDate";


class App extends Component{

    constructor(props) {
        super(props);
        this.state = {
            language: RouterService.getLanguageFromURL(),
            selectedButton: RouterService.getCategoryFromURL(),
            selectedList: RouterService.getVersionFromURL(),
            selectedDate: convertDate(new Date().toISOString()),
            searchResults: [],
            reSetPath: false
        };
        this.updateButton = this.updateButton.bind(this);
        this.updateDate = this.updateDate.bind(this);
        this.updateList = this.updateList.bind(this);
        this.reRenderButton = this.reRenderButton.bind(this);
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
        let navigate = this.props.navigation;
        let list = this.state.selectedList;
        let button = this.state.selectedButton;
        let i = this.state.selectedList === '' ? '' : '/';
        let chapters;
        if(prevState.language !== this.state.language ||
            prevState.selectedButton !== this.state.selectedButton ||
            prevState.selectedList !== this.state.selectedList ||
            prevState.selectedDate !== this.state.selectedDate ||
            this.state.reSetPath) {
            if (button === 'MiGeL' || button === 'AL' || button === 'DRUG' ){
                button = button.toUpperCase();
                chapters = this.state.selectedButton.toLowerCase() + 's/all'
            }
            else if (button === 'SwissDRG') {
                chapters = 'mdcs';
            }else {
                chapters =button.toLowerCase() + '_chapters';
            }
            navigate({
                // falls liste leer --> de/button/chapters
                // sonst --> de/button/list/chapters/list
                pathname: this.state.language + "/" + button +'/' + list + i + chapters + i + list,
                search: RouterService.getQueryVariable('query') === "" ? "" : "?query=" + RouterService.getQueryVariable('query')
            })
            this.setState({reSetPath: false})
        }
    }
    reRenderButton(){
        this.setState({reSetPath: true});
    }

    findJson(language) {
        switch (language) {
            case "de":
                return deJson
            case "fr":
                return frJson
            case "it":
                return itJson
            case "en":
                return enJson
        }
    }


    render() {
        let searchResults;
        let translateJson = this.findJson(this.state.language)
        if(this.state.searchResults[0] === "empty") {
            searchResults = <div key={"searchResults array 0"} className="searchResult"><p key={"searchResults array 0 p"}>{translateJson["LBL_NO_RESULTS"]}</p></div>
        } else {
            searchResults =
                <div key={"searchResults array 1"}>
                {this.state.searchResults.map(function(searchResult, i){
                    return <SearchResult result = {searchResult} key={"searchResults " + i}/>
                })}
                </div>
        }
          return (

              <div key={"app div 0"}>
                  <div key={"app div 1"} className="container">
                      <div key={"app header div 0"}className="row">
                          <div key={"app header div 1"} className="col-sm-12">
                              <Header language={this.updateLanguage} activeLanguage={this.state.language}/>
                          </div>
                      </div>
                      <div key={"app img div 0"} className="row">
                          <div key={"app img div 1"} className="col-sm-12">
                              <img onClick={this.reRenderButton} alt="logo" id="logo" src={logo}/>
                          </div>
                      </div>
                  </div>

                  <div key={"app div 2"} className="container">
                      <div key={"app searchbar div 0"} className="row">
                          <Searchbar
                              language={this.state.language}
                              selectedButton={this.state.selectedButton}
                              version={this.state.selectedList}
                              date={this.state.selectedDate}
                              searchResults={this.updateSearchResults}/>
                      </div>
                      <div key={"app buttongroup div 0"} className="row">
                          <ButtonGroup
                              category={this.state.selectedButton}
                              version={this.state.selectedList}
                              reSetButton={this.reRenderButton}
                              selectedLanguage={this.updateLanguage}
                              language={this.state.language}
                              selectedButton={this.updateButton}
                              selectedList={this.updateList}
                              selectedDate={this.updateDate}
                              buttons={[['ICD', 'CHOP', 'SwissDRG', 'TARMED'],['MiGeL', 'AL', 'DRUG']]}
                          />
                      </div>
                      <div key={"app main div 0"} className="row">
                          <div key={"app searchresults div 0"} className={this.state.searchResults.length === 0 ? "":"col"}>
                              {searchResults}
                          </div>
                          <div key={"app outlet div 0"} className="col">
                              <Outlet />
                          </div>
                      </div>

                      <div key={"app footer div 0"}className="navbar row">
                          <div key={"app footer div 1"} className="col">
                              <Footer/>
                          </div>
                      </div>
                  </div>
              </div>
          )
      }

}

export default function(props) {
    const navigation = useNavigate();
    return <App {...props} params={useParams} navigation={navigation}/>;
}
