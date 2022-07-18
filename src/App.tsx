import './App.css';
import './index.css';
import Footer from './Components/Footer/footer';
import Header from './Components/Header/header';
import Searchbar from './Components/Searchbar/Searchbar'
import SearchResult from "./Components/SearchResult/SearchResult";
import logo from "./assets/medcodesearch_big.png";
import { ReactComponent as Arrow } from './assets/arrow-up.svg';
import {Outlet, useNavigate} from "react-router-dom";
import CatalogButtons from "./Components/Buttons/CatalogButtons";
import RouterService from "./Services/router.service";
import React, {Component} from "react";
import convertDate from "./Services/convert-date.service";
import {Collapse} from "react-bootstrap";
import {getVersionsByLanguage} from "./Services/category-version.service";
import findJsonService from "./Services/find-json.service";
import {INavigationHook, IVersions} from "./interfaces";

/**
 * App.js calls all the component to combine them and render the website
 * @component
 */

interface Props {
    navigation: INavigationHook
}

interface IApp {
    language: string,
    selectedButton: string,
    selectedVersion: string,
    selectedDate: string,
    searchResults: string[],
    clickedOnLogo: boolean,
    reSetPath: boolean,
    collapseMenu: boolean,
    initialVersions: IVersions,
    currentVersions: IVersions
}

class App extends Component<Props, IApp>{
    /**
     * gets the language, selected button, selected list, selected date and search results and bind them
     * @param props
     */
    constructor(props) {
        super(props);
        this.state = {
            language: RouterService.getLanguageFromURL(),
            selectedButton: RouterService.getCategoryFromURL(),
            selectedVersion: RouterService.getVersionFromURL(),
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
        this.updateVersion = this.updateVersion.bind(this);
        this.reRenderButton = this.reRenderButton.bind(this);
        this.reNavigateToHome = this.reNavigateToHome.bind(this)
        this.reSetClickedOnLogo = this.reSetClickedOnLogo.bind(this)
        this.showHide = this.showHide.bind(this);
        this.showSearchResults = this.showSearchResults.bind(this);
    }

    /**
     * Updates state of selectedVersion.
     * @param version
     */
    updateVersion = (version) => {
        this.setState({selectedVersion: version})
    }

    /**
     * Updates state of selectedButton.
     * @param btn
     */
    updateButton = (btn) => {
        this.setState({selectedButton: btn})
    }

    /**
     * Updates state of selectedDate.
     * @param date
     */
    updateDate = (date) => {
        this.setState({selectedDate: date})
    }

    /**
     * Updates state of searchResults. If input === 'reset', searchResults are cleared, otherwise input is
     * added to current searchResults.
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
     * Returns true if selected button has a valid version, false otherwise.
     * @param button
     * @param version
     * @param lang
     * @returns {boolean|*}
     */
    isValidVersion(button, version, lang) {
        if(button.toUpperCase() === 'MIGEL' || button === 'AL' || button === 'DRUG') {
            return lang !== "en"
        } else {
            return this.state.currentVersions[button].includes(version)
        }
    }

    /**
     * Updates state of language.
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
    async componentDidUpdate(prevProps, prevState, snapshot) {
        let navigate = this.props.navigation;
        if(prevState.language !== this.state.language) {
            let list = this.state.selectedVersion;
            let button = this.state.selectedButton;
            let code = RouterService.getCodeFromURL();
            let chapters = RouterService.getChapterFromURL();
            let i = this.state.selectedVersion === '' ? '' : '/';
            this.setState({currentVersions: await getVersionsByLanguage(this.state.language)})
            if(this.isValidVersion(button, list, this.state.language)) {
                navigate({
                    // falls liste leer --> de/button/chapters
                    // sonst --> de/button/list/chapters/list
                    pathname: this.state.language + "/" + button + '/' + list + i + chapters + '/' + code,
                    search: RouterService.getQueryVariable('query') === "" ? "" : "?query=" + RouterService.getQueryVariable('query')
                })
            } else {
                this.updateButton("ICD")
                this.updateVersion("ICD10-GM-2022")
                navigate({
                    pathname: this.state.language + "/ICD/ICD10-GM-2022/icd_chapters/ICD10-GM-2022",
                    search: RouterService.getQueryVariable('query') === "" ? "" : "?query=" + RouterService.getQueryVariable('query')
                })
            }
            this.setState({reSetPath: false})
        }

        if(prevState.selectedButton !== this.state.selectedButton ||
            prevState.selectedVersion !== this.state.selectedVersion ||
            prevState.selectedDate !== this.state.selectedDate ||
            this.state.reSetPath) {
            let list = this.state.selectedVersion;
            let button = this.state.selectedButton;
            let i = this.state.selectedVersion === '' ? '' : '/';
            let chapters;
            if (button === 'MiGeL' || button === 'AL' || button === 'DRUG' ){
                button = button.toUpperCase();
                chapters = this.state.selectedButton.toLowerCase() + 's/all'
            }
            else if (button === 'SwissDRG') {
                chapters = 'mdcs';
            }else {
                chapters =button.toLowerCase() + '_chapters';
            }
            if(this.isValidVersion(button, list, this.state.language)) {
                navigate({
                    // falls liste leer --> de/button/chapters
                    // sonst --> de/button/list/chapters/list
                    pathname: this.state.language + "/" + button + '/' + list + i + chapters + i + list,
                    search: RouterService.getQueryVariable('query') === "" ? "" : "?query=" + RouterService.getQueryVariable('query')
                })
            } else {
                this.updateButton("ICD")
                this.updateVersion("ICD10-GM-2022")
                navigate({
                    pathname: this.state.language + "/ICD/ICD10-GM-2022/icd_chapters/ICD10-GM-2022",
                    search: RouterService.getQueryVariable('query') === "" ? "" : "?query=" + RouterService.getQueryVariable('query')
                })
            }
            this.setState({reSetPath: false})
        }
    }

    /**
     * If component mount set the states
     * @returns {Promise<void>}
     */
    async componentDidMount() {
        this.setState({initialVersions: await getVersionsByLanguage('de')})
        this.setState({currentVersions: await getVersionsByLanguage(this.state.language)})
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
            return['LiMA', 'LA', 'Med']
        }
        else if(language === "it"){
            return ['EMAp', 'EA', 'Med']
        }
        else{
            return ['MiGeL', 'AL', 'Med']
        }
    }

    /**
     * change the full labels language
     * @param language
     * @returns {string[]}
     */
    getFullLabels(language){
        if(language === "fr"){
            return['Liste des moyens et appareils', 'Liste des analyses', 'médicaments']
        }
        else if(language === "it"){
           return ['Elenco dei mezzi e degli apparecchi', 'Insieme elenco delle analisi', 'droga']
        }
        else{
            return ['Mittel und Gegenständeliste', 'Analysenliste', 'Medikamente']
        }
    }

    /**
     * render the search result from the backend
     * @returns {JSX.Element}
     */
    searchResults() {
        let searchResults
        let translateJson = findJsonService(this.state.language)
        if(this.state.searchResults[0] === "empty") {
            searchResults = <div key={"search_results_div"} className="searchResult"><p key={"search_results_p"}>{translateJson["LBL_NO_RESULTS"]}</p></div>
        } else {
            searchResults =
                <div key={"search_results_div"}>
                    {this.state.searchResults.map(function(searchResult, i){
                        return <SearchResult result = {searchResult} key={"search_results_" + i}/>
                    })}
                </div>
        }
        // TODO: using onClick in Collapse causes error: Property 'onClick' does not exist on type 'IntrinsicAttributes & CollapseProps & RefAttributes<Transition<any>>'
        //  Removed it but not sure if correct.
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
                <Collapse in={!this.state.collapseMenu}>
                    <div>
                        {searchResults}
                    </div>
                </Collapse>
            </div>
        )
    }

    /**
     * hide the object if the window is too small
     * @param e
     */
    showHide(e) {
        if (window.innerWidth <= 991) {
            e.preventDefault();
            this.setState({
                collapseMenu: !this.state.collapseMenu
            });
        }
    }

    /**
     * set the collapseMenu state to false and open it
     */
    showSearchResults() {
        this.setState({
            collapseMenu: false
        })
    }

    /**
     * Reset everything back to the default
     */
    reNavigateToHome(){
        this.setState({clickedOnLogo: true});
        this.props.navigation({search: ''});
        this.updateButton('ICD')
        if (this.state.language === 'de' || this.state.language === 'en') {
            this.updateVersion('ICD10-GM-2022')
        }
        else {
            this.updateVersion('ICD10-GM-2020')
        }
    }

    /**
     * change the clickedOnLogo state
     */
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

              <div key={"app"}>
                  <div key={"app_container_0"} className="container">
                      <div key={"app_header"} className="row">
                          <div key={"app_header_0"} className="col-sm-12">
                              <Header language={this.updateLanguage} activeLanguage={this.state.language}/>
                          </div>
                      </div>
                      <div key={"app_img"} className="row">
                          <div key={"app_img_0"} className="col-sm-12">
                              <img onClick={this.reNavigateToHome} alt="logo" id="logo" src={logo}/>
                          </div>
                      </div>
                  </div>

                  <div key={"app_container_1"} className="container">
                      <div key={"app_searchbar"} className="row" onClick={this.showSearchResults}>
                          <Searchbar
                              language={this.state.language}
                              selectedButton={this.state.selectedButton}
                              version={this.state.selectedVersion}
                              date={this.state.selectedDate}
                              searchResults={this.updateSearchResults}/>
                      </div>
                      <div key={"app_catalog_buttons"} className="row">
                          <CatalogButtons
                              initialVersions={this.state.initialVersions}
                              currentVersions={this.state.currentVersions}
                              clickedOnLogo={this.state.clickedOnLogo}
                              category={this.state.selectedButton}
                              version={this.state.selectedVersion}
                              reSetClickOnLogo={this.reSetClickedOnLogo}
                              reSetButton={this.reRenderButton}
                              selectedLanguage={this.updateLanguage}
                              language={this.state.language}
                              selectedButton={this.updateButton}
                              updateVersion={this.updateVersion}
                              updateDate={this.updateDate}
                              labels={this.getLabels(this.state.language)}
                              fullLabels={this.getFullLabels(this.state.language)}
                              buttons={[['ICD', 'CHOP', 'SwissDRG', 'TARMED'],['MiGeL', 'AL', 'DRUG']]}
                          />
                      </div>
                         <div key={"app_main"} className="row">
                          {this.state.searchResults.length > 0 &&
                          <div key={"app_searchresults"} className="col-12 col-lg">
                              {searchResults}
                          </div>}

                          <div key={"app_outlet"} className="col" id="main">
                              <Outlet />
                          </div>
                      </div>

                      <div key={"app_footer"}className="navbar row">
                          <div key={"app_footer_0"} className="col">
                              <Footer/>
                          </div>
                      </div>
                  </div>
              </div>
          )
      }

}

function addProps(Component) {
    return props => <Component {...props} navigation={useNavigate()}/>;
}

export default addProps(App);
