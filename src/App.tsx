import './App.css';
import './index.css';
import Footer from './Components/Footer/footer';
import Header from './Components/Header/header';
import {Navigate, Routes, Route, Outlet} from "react-router-dom";
import Searchbar from './Components/Searchbar/Searchbar'
import SearchResult from "./Components/SearchResult/SearchResult";
import logo from "./assets/medcodesearch_big.png";
import { ReactComponent as Arrow } from './assets/arrow-up.svg';
import {useNavigate} from "react-router-dom";
import Buttons from "./Components/Buttons/Buttons";
import RouterService from "./Services/router.service";
import React, {Component, useState} from "react";
import {Collapse} from "react-bootstrap";
import {getVersionsByLanguage} from "./Services/catalog-version.service";
import getTranslationHash from "./Services/translation.service";
import {INavigationHook, IParamTypes, IVersions} from "./interfaces";
import loadingSpinner from "./Components/Spinner/spinner";
import CodeBodyUnversionized from "./Components/Bodies/CodeBodyUnversionized";
import CodeBodyVersionized from "./Components/Bodies/CodeBodyVersionized";
import dateFormat from "dateformat";
import {toast} from "react-toastify";


/**
 * App.js calls all the component to combine them and render the website
 * @component
 */

interface Props {
    navigation: INavigationHook
    params: IParamTypes
}

interface ISearchResult {
    code: string,
    text: string,
    terminal: boolean,
    url: string,
    highlight: object
}
interface IApp {
    language: string,
    selectedButton: string,
    selectedVersion: string,
    selectedDate: string,
    searchResults: string[] | ISearchResult[] ,
    clickedOnLogo: boolean,
    reSetPath: boolean,
    collapseMenu: boolean,
    initialVersions: IVersions,
    currentVersions: IVersions,
    isFetching: boolean
}

class App extends Component<Props, IApp>{
    /**
     * gets the language, selected button, selected list, selected date and search results and bind them
     * @param props
     */
    constructor(props) {
        super(props);
        this.state = {
            language: RouterService.initializeLanguageFromURL(),
            selectedButton: RouterService.initializeCatalogFromURL(),
            selectedVersion: this.initializeVersionFromURL(),
            selectedDate: dateFormat(new Date(), "dd.mm.yyyy"),
            searchResults: [],
            clickedOnLogo: false,
            reSetPath: false,
            collapseMenu: false,
            initialVersions: {'ICD': [], 'CHOP:': [], 'TARMED': [], 'SwissDRG': [], 'AmbGroup': []},
            currentVersions: {'ICD': [], 'CHOP:': [], 'TARMED': [], 'SwissDRG': [], 'AmbGroup': []},
            isFetching: true
        };
        this.changeSelectedButton = this.changeSelectedButton.bind(this);
        this.changeSelectedDate = this.changeSelectedDate.bind(this);
        this.changeSelectedVersion = this.changeSelectedVersion.bind(this);
        this.reRenderButton = this.reRenderButton.bind(this);
        this.reNavigateToHome = this.reNavigateToHome.bind(this)
        this.reSetClickedOnLogo = this.reSetClickedOnLogo.bind(this)
        this.showHide = this.showHide.bind(this);
        this.showSearchResults = this.showSearchResults.bind(this);
    }

    /**
     * get the version defined in the url and if it isn't defined set it to latest icd version.
     * @returns {string|*}
     */
    initializeVersionFromURL() {
        if(window.location.pathname !== '/') {
            let arr = window.location.pathname.split("/")
            if(arr.length === 6) {
                return arr[3]
            } else {
                return ''
            }
        }
        // Base version placeholder for ICD when visiting medcodesearch.ch.
        // Will be set in App componentDidMount to latestICD.
        return 'ICD10-GM-XXXX'
    }

    /**
     * Updates state of selectedVersion.
     * @param version
     */
    changeSelectedVersion = (version) => {
        this.setState({selectedVersion: version})
    }

    /**
     * Changes the selected button.
     * @param btn
     */
    changeSelectedButton = (btn) => {
        this.setState({selectedButton: btn})
    }

    /**
     * Changes language.
     * @param lang
     */
    changeLanguage = (lang) => {
        this.setState({language: lang})
    }

    /**
     * Updates state of selectedDate.
     * @param date string in DD.MM.YYYY format
     */
    changeSelectedDate = (date) => {
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
        if(button === 'MIGEL' || button === 'AL' || button === 'DRUG') {
            return lang !== "en"
        } else {
            return this.state.currentVersions[button].includes(version)
        }
    }

    /**
     * Navigates to root url, i.e. newest ICD catalog.
     * @param lang
     */
    navigateTo = (path, searchString) => {
        let navigate = this.props.navigation;
        navigate({
            pathname: path,
            search: searchString
        })
    }

    async navigateToLatestIcd(translationHash) {
        let searchString = RouterService.getQueryVariable('query') === "" ? "" : "?query=" +
            RouterService.getQueryVariable('query');
        let latestICD = this.state.initialVersions['ICD'].at(-1);
        this.navigateTo(this.state.language + "/ICD/" + latestICD + "/icd_chapters/" + latestICD, searchString)
        this.changeSelectedVersion(latestICD)
        this.changeSelectedButton("ICD")
        // Adding toastId avoids toast getting rendered multiple times (since we're firing this in component did mount
        // and update. This want be necessary if we rewrite everythin into functional components and use effect hook.
        toast.warning(translationHash["LBL_VERSION_NOT_AVAILABLE"], {
            position: toast.POSITION.TOP_RIGHT,
            toastId: 'no_version_toast',
        });
    }

    /**
     * Navigates to the correct path.
     * @param prevProps
     * @param prevState
     * @param snapshot
     */
    async componentDidUpdate(prevProps, prevState, snapshot) {
        let translationHash = getTranslationHash(this.state.language);
        // version is empty for non versionized catalogs.
        let version = this.state.selectedVersion;
        let button = this.state.selectedButton;
        let searchString = RouterService.getQueryVariable('query') === "" ? "" : "?query=" +
            RouterService.getQueryVariable('query');
        let resource_type = RouterService.initializeResourceTypeFromURL();
        let code = RouterService.initializeCodeFromURL();

        // Check for navigation other than language change.
        let navigationWithoutLanguageChange = false;
        if (prevState.selectedButton !== this.state.selectedButton ||
            prevState.selectedVersion !== this.state.selectedVersion ||
            prevState.selectedDate !== this.state.selectedDate ||
            this.state.reSetPath) {
            navigationWithoutLanguageChange = true;
            if (['MIGEL', 'AL', 'DRUG'].includes(button)) {
                code = 'all';
                resource_type = button.toLowerCase() + 's'
            } else {
                code = version;
                if (['SwissDRG', 'AmbGroup'].includes(button)) {
                    resource_type = button === 'SwissDRG' ? 'mdcs' : 'capitula'
                } else {
                    resource_type = button.toLowerCase() + '_chapters'
                }
            }
        }

        // Set current version depending on language.
        if (prevState.language !== this.state.language) {
            this.setState({currentVersions: await getVersionsByLanguage(this.state.language)})
        }


        // Navigate to new path.
        if (navigationWithoutLanguageChange || prevState.language !== this.state.language) {
            if (this.isValidVersion(button, version, this.state.language)) {
                this.navigateTo(this.state.language + "/" + button + '/' + version +
                    (version.length === 0 ? "" : '/') + resource_type + '/' + code, searchString)
            } else {
                await this.navigateToLatestIcd(translationHash);
            }
            this.setState({reSetPath: false})
        }
    }

    /**
     * If component mount set the states
     * @returns {Promise<void>}
     */
    async componentDidMount() {
        let translationHash = getTranslationHash(this.state.language);
        await this.setState({initialVersions: await getVersionsByLanguage('de')})
        await this.setState({currentVersions: await getVersionsByLanguage(this.state.language)})
        // If medcodesearch is accessed via root url, i.e. medcodesearch.ch, there is no version from url, i.e. the
        // placeholder ICD10-GM-XXXX set in initializeVersionFromURL has to be transformed to latest ICD.
        if (this.state.selectedVersion === "ICD10-GM-XXXX") {
            await this.setState({selectedVersion:  this.state.initialVersions['ICD'].at(-1)})
        }
        if (!this.isValidVersion(this.state.selectedButton, this.state.selectedVersion, this.state.language)) {
            await this.navigateToLatestIcd(translationHash);
        }
        await this.setState({isFetching: false})
    }

    /**
     * change the reSetPath state to true
     */
    reRenderButton(){
        this.setState({reSetPath: true});
    }

    /**
     * Returns the labels for the buttons depending on the chosen language.
     * @returns labels
     */
    getLabels() {
        let translationHash = getTranslationHash(this.state.language);
        return {
            'MIGEL': translationHash["LBL_MIGEL_LABEL"],
            'AL': translationHash["LBL_AL_LABEL"],
            'DRUG': 'Med',
            'AmbGroup': translationHash['LBL_AMB_GROUP_LABEL']
        }
    }

    /**
     * Render search results from the backend.
     * @returns {JSX.Element}
     */
    searchResults() {
        let translationHash = getTranslationHash(this.state.language);
        const searchResults =
            this.state.searchResults[0] === "empty" ?
                <div className="searchResult">{translationHash["LBL_NO_RESULTS"]}</div> :
                this.state.searchResults.map(function (searchResult) {
                    return <SearchResult result={searchResult} key={searchResult.code}/>
                })

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
     * Hide the catalog div if the window is too small.
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
     * Reset everything back to the default but stay in current language.
     */
    reNavigateToHome(){
        this.setState({clickedOnLogo: true});
        let latestICD = this.state.initialVersions['ICD'].at(-1);
        this.changeSelectedButton('ICD')
        this.changeSelectedVersion(latestICD)
        this.props.navigation({pathname: "/",search: ''});
    }

    /**
     * Change the clickedOnLogo state.
     */
    reSetClickedOnLogo(){
        this.setState({clickedOnLogo: false})
    }

    renderAfterFetch() {
        return(
            <div key={"app_content"}>
                <div key={"app_searchbar"} className="row" onClick={this.showSearchResults}>
                    <Searchbar
                        language={this.state.language}
                        selectedButton={this.state.selectedButton}
                        version={this.state.selectedVersion}
                        selectedDate={this.state.selectedDate}
                        updateSearchResults={this.updateSearchResults}/>
                </div>
                <div key={"app_buttons"} className="row">
                    <Buttons
                        initialVersions={this.state.initialVersions}
                        currentVersions={this.state.currentVersions}
                        clickedOnLogo={this.state.clickedOnLogo}
                        selectedButton={this.state.selectedButton}
                        version={this.state.selectedVersion}
                        reSetClickOnLogo={this.reSetClickedOnLogo}
                        reSetButton={this.reRenderButton}
                        changeLanguage={this.changeLanguage}
                        language={this.state.language}
                        changeSelectedButton={this.changeSelectedButton}
                        changeSelectedVersion={this.changeSelectedVersion}
                        changeSelectedDate={this.changeSelectedDate}
                        labels={this.getLabels()}
                        buttons={[['ICD', 'CHOP', 'SwissDRG', 'TARMED', 'AmbGroup'], ['MIGEL', 'AL', 'DRUG']]}
                    />
                </div>
                <div key={"app_body"} className="row">
                    <div className="Wrapper">
                        <div className="row">
                            {this.state.searchResults.length > 0 &&
                                <div key={"search_results"} className="col-12 col-lg">
                                    {this.searchResults()}
                                </div>}
                            <div key={"code_body"} className="col">
                                <div id="color" className="whiteBackground border border-5 border-bottom-0 border-top-0 border-right-0 border-end-0 rounded">
                                    <div className="col" id="codeBody">
                                        <div className="text-start ms-3">
                                            <Outlet />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    renderContent() {
        return (
            <div>
                <div className="container">
                    <div key={"app_header"} className="row col-sm-12">
                            <Header changeLanguage={this.changeLanguage} activeLanguage={this.state.language}/>
                    </div>
                    <div key={"app_logo"} className="row col-sm-12">
                            <img onClick={this.reNavigateToHome} alt="logo" id="logo" src={logo}/>
                    </div>
                    {this.state.isFetching ? loadingSpinner() : this.renderAfterFetch()}
                    <div key={"app_footer"} className="navbar row">
                        <div key={"app_footer_0"} className="col">
                            <Footer/>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    /**
     * Renders the whole website.
     * @returns {JSX.Element}
     */
    render() {
        let latestICD = this.state.initialVersions['ICD'].at(-1);
        return (
            <>
                <Routes>
                    <Route path="/" element={this.renderContent()}>
                        <Route path="/" element={<Navigate to={"de/ICD/" + latestICD + "/icd_chapters/" + latestICD}/>}/>
                        <Route path=":language/:catalog/:resource_type/:code" element={<CodeBodyUnversionized selectedDate={this.state.selectedDate} />}/>
                        <Route path=":language/:catalog/:version/:resource_type/:code" element={<CodeBodyVersionized/>}/>
                    </Route>
                </Routes>
            </>
    )
    }
}

function addProps(Component) {
    return props => <Component {...props} navigation={useNavigate()}/>;
}

export default addProps(App);
