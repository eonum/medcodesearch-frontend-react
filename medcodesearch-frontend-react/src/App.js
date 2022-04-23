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

/**
 * App.js calls all the component to combine them and render the website
 * @component
 */
class App extends Component{

    /**
     * gets the language, selected button, selected list, selected date and search results and bind them
     * @param props
     */
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

    /**
     * takes a list and set them as a state
     * @param list
     */
    updateList = (list) => {
        this.setState({selectedList: list})
    }

    /**
     * takes a button and sets it as a state
     * @param btn
     */
    updateButton = (btn) => {
        this.setState({selectedButton: btn})
    }

    /**
     * takes a date and sets it as a state
     * @param date
     */
    updateDate = (date) => {
        this.setState({selectedDate: date})
    }

    /**
     * takes a searchResult and resets is or add it to the current seachResults state
     * @param searchResult
     */
    updateSearchResults = (searchResult) => {
        if(searchResult === "reset") {
            this.setState({searchResults: []})
        } else {
            this.setState({
                searchResults: [...this.state.searchResults, searchResult]
            });
        }
    }

    /**
     * takes a language and sets it as a state
     * @param lang
     */
    updateLanguage = (lang) => {
        this.setState({language: lang})
    }

    /**
     * sets the correct pathname
     * @param prevProps
     * @param prevState
     * @param snapshot
     */
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

    /**
     * change the reSetPath state to true
     */
    reRenderButton(){
        this.setState({reSetPath: true});
    }

    /**
     * takes a language and looks for the correct language json
     * @param language
     * @returns {{LANGUAGE: string, LBL_NO_RESULTS: string, LBL_BACK_SEARCH: string, LBL_CHILDREN: string, LBL_SEARCH_PLACEHOLDER: string, LBL_EXCLUSIONS: string, LBL_INCLUSIONS: string, LBL_DESCRIPTIONS: string, LBL_RELEVANT_CODES: string, LBL_NOTE: string, LBL_NOTES: string, LBL_CODING_HINT: string, LBL_SUPPLEMENT_CODES: string, LBL_USAGE: string, LBL_SYNONYMS: string, LBL_SELECT_LANGUAGE: string, LBL_CATALOG_LANGUAGE_NOT_AVAILABLE: string, LBL_BACK: string, LBL_FAVORITE_TITLE: string, LBL_FAVORITE_NOELEMENTS: string, LBL_ELEMENT_ADDED: string, LBL_ELEMENT_REMOVED: string, LBL_FAVORITE_ELEMENT: string, LBL_IS_FAVORITE: string, LBL_SIBLINGS: string, LBL_REDIRECT_CASEMATCH: string, LBL_REDIRECT_SWISSDRG: string, LBL_ANALOGOUS_CODE_TEXT: string, LBL_PREDECESSORS: string, LBL_SUCCESSORS: string, LBL_NEW_CODE: string, LBL_REG_op: string, LBL_REG: string, LBL_MED_INTERPRET: string, LBL_TECH_INTERPRET: string, LBL_SUBSTANCE_NAME: string, LBL_FIELD_OF_APP: string, LBL_LIMITATION: string, LBL_FACULTY: string, LBL_ACTIVE_SUBSTANCES: string, LBL_ATC_CODE: string, LBL_UNIT: string, LBL_COMMENT: string, LBL_GROUPS: string, LBL_BLOCKS: string}}
     */
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


    /**
     * renders the whole website
     * @returns {JSX.Element}
     */
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
