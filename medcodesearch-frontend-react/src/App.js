import './App.css';
import './index.css';
import Footer from './Components/Footer/footer';
import Header from './Components/Header/header';
import Searchbar from './Components/Searchbar/Searchbar.js'
import SearchResult from "./Components/SearchResult/SearchResult";
import logo from "./assets/medcodesearch_big.png";
import { ReactComponent as Arrow } from './assets/arrow-up.svg';
import {Outlet, useNavigate, useParams} from "react-router-dom";
import ButtonGroup from "./Components/ButtonGroup/ButtonGroup";
import RouterService from "./Services/router.service";
import {Component} from "react";
import convertDate from "./Services/ConvertDate";
import {Collapse} from "react-bootstrap";
import {
    getVersionsByLanguage
} from "./Services/category-version.service";
import findJson from "./Services/findJson";

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
            selectedDate: convertDate(new Date().toDateString()),
            searchResults: [],
            clickedOnLogo: false,
            reSetPath: false,
            collapseMenu: false,
            initialVersions: {'ICD': [], 'CHOP:': [], 'TARMED': [], 'SwissDRG': []},
            currentVersions: {'ICD': [], 'CHOP:': [], 'TARMED': [], 'SwissDRG': []}
        };
        this.updateButton = this.updateButton.bind(this);
        this.updateDate = this.updateDate.bind(this);
        this.updateList = this.updateList.bind(this);
        this.reRenderButton = this.reRenderButton.bind(this);
        this.reNavigateToHome = this.reNavigateToHome.bind(this)
        this.reSetClickedOnLogo = this.reSetClickedOnLogo.bind(this)
        this.showHide = this.showHide.bind(this);
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
     * sets the correct url
     * @param prevProps
     * @param prevState
     * @param snapshot
     */
    async componentDidUpdate(prevProps: Readonly<P>, prevState: Readonly<S>, snapshot: SS) {
        let navigate = this.props.navigation;
        let list = this.state.selectedList;
        let button = this.state.selectedButton;
        let i = this.state.selectedList === '' ? '' : '/';
        let chapters;

        if(prevState.language !== this.state.language) {
            this.setState({currentVersions: await getVersionsByLanguage(this.state.language)})
        }

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
            if((button === 'MIGEL' || button === 'AL' || button === 'DRUG') || this.state.currentVersions[button].includes(list)) {
                navigate({
                    // falls liste leer --> de/button/chapters
                    // sonst --> de/button/list/chapters/list
                    pathname: this.state.language + "/" + button + '/' + list + i + chapters + i + list,
                    search: RouterService.getQueryVariable('query') === "" ? "" : "?query=" + RouterService.getQueryVariable('query')
                })
            } else {
                this.updateButton("ICD")
                this.updateList("ICD10-GM-2022")
                navigate({
                    pathname: this.state.language + "/ICD/ICD10-GM-2022/icd_chapters/ICD10-GM-2022",
                    search: RouterService.getQueryVariable('query') === "" ? "" : "?query=" + RouterService.getQueryVariable('query')
                })
            }
            this.setState({reSetPath: false})
        }
    }

    async componentDidMount() {
        this.setState({initialVersions: await getVersionsByLanguage('de')})
        this.setState({currentVersions: await getVersionsByLanguage(this.state.language)})
        console.log(this.state.currentVersions)
    }

    /**
     * change the reSetPath state to true
     */
    reRenderButton(){
        this.setState({reSetPath: true});
    }


    /**
     * returns the labels for the buttons depending on the chosen language
     * @returns labels
     */
    getLabels(language){
        if(language === "fr"){
            return['LiMA', 'LA', 'meds']
        }
        else if(language === "it"){
            return ['EMAp', 'EA', 'meds']
        }
        else{
            return ['MiGeL', 'AL', 'DRUG']
        }
    }

    getFullLabels(language){
        if(language === "fr"){
            return['Liste des moyens et appareils', 'Liste des analyses', 'médicaments']
        }
        else if(language === "it"){
           return ['Elenco dei mezzi e degli apparecchi', 'Elenco delle analisi', 'droga']
        }
        else{
            return ['Mittel und Gegenständeliste', 'Analysenliste', 'Medikamente']
        }
    }

    searchResults() {
        let searchResults
        let translateJson = findJson(this.state.language)
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
        return(
            <div className="container" id="searchResults">
                <p className="text-center mt-3">
                    <button
                        onClick={this.showHide}
                        className="btn d-lg-none"
                        id={this.state.collapseMenu ? 'arrow-rotate': null}
                        type="button"
                        data-target="#collapseExample"
                        aria-expanded="false"
                        aria-controls="collapseExample"
                    >
                        <Arrow />
                    </button>
                </p>
                
                <Collapse in={!this.state.collapseMenu} onClick={this.showHide}>
                    <div>
                        {searchResults}
                    </div>
                </Collapse>
            </div>
        )
    }

    showHide(e) {
        if (window.innerWidth <= 991) {
            e.preventDefault();

            this.setState({
                collapseMenu: !this.state.collapseMenu
            });
        }
    }

    reNavigateToHome(){
        this.setState({clickedOnLogo: true});
        this.props.navigation({search: ''});
        this.updateButton('ICD')
        if (this.state.language === 'de' || this.state.language === 'en') {
            this.updateList('ICD10-GM-2022')
        }
        else {
            this.updateList('ICD10-GM-2020')
        }
    }
    reSetClickedOnLogo(){
        this.setState({clickedOnLogo: false})
    }

    /**
     * renders the whole website
     * @returns {JSX.Element}
     */
    render() {
        let searchResults = this.searchResults()

          return (

              <div key={"app div 0"}>
                  <div key={"app div 1"} className="container">
                      <div key={"app header div 0"} className="row">
                          <div key={"app header div 1"} className="col-sm-12">
                              <Header language={this.updateLanguage} activeLanguage={this.state.language}/>
                          </div>
                      </div>
                      <div key={"app img div 0"} className="row">
                          <div key={"app img div 1"} className="col-sm-12">
                              <img onClick={this.reNavigateToHome} alt="logo" id="logo" src={logo}/>
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
                              initialVersions={this.state.initialVersions}
                              currentVersions={this.state.currentVersions}
                              clickedOnLogo={this.state.clickedOnLogo}
                              category={this.state.selectedButton}
                              version={this.state.selectedList}
                              reSetClickOnLogo={this.reSetClickedOnLogo}
                              reSetButton={this.reRenderButton}
                              selectedLanguage={this.updateLanguage}
                              language={this.state.language}
                              selectedButton={this.updateButton}
                              selectedList={this.updateList}
                              selectedDate={this.updateDate}
                              labels={this.getLabels(this.state.language)}
                              fullLabels={this.getFullLabels(this.state.language)}
                              buttons={[['ICD', 'CHOP', 'SwissDRG', 'TARMED'],['MiGeL', 'AL', 'DRUG']]}
                          />
                      </div>
                         <div key={"app main div 0"} className="row">
                          {this.state.searchResults.length > 0 &&
                          <div key={"app searchresults div 0"} className="col-12 col-lg">
                              {searchResults}
                          </div>}

                          <div key={"app outlet div 0"} className="col" id="main">
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
