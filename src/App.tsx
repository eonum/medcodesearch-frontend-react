import './App.css';
import './index.css';
import Footer from './Components/Footer/footer';
import Header from './Components/Header/header';
import {Navigate, Routes, Route, Outlet} from "react-router-dom";
import Searchbar from './Components/Searchbar/Searchbar'
import SearchResult from "./Components/SearchResult/SearchResult";
import logo from "./assets/medcodesearch_big.png";
import {useNavigate} from "react-router-dom";
import ButtonGroup from "./Components/Buttons/ButtonGroup";
import {RouterService} from "./Services/router.service";
import React, {Component} from "react";
import {Collapse} from "react-bootstrap";
import {getVersionsByLanguage} from "./Services/catalog-version.service";
import {INavigationHook, IParamTypes, IVersions} from "./interfaces";
import loadingSpinner from "./Components/Spinner/spinner";
import CodeBodyUnversionized from "./Components/Bodies/CodeBodyUnversionized";
import CodeBodyVersionized from "./Components/Bodies/CodeBodyVersionized";
import dateFormat from "dateformat";
import {toast} from "react-toastify";
import { useTranslation } from 'react-i18next';

/**
 * App.js calls all the component to combine them and render the website
 * @component
 */

interface Props {
    navigation: INavigationHook
    params: IParamTypes
    translation: any
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
    hasCollapsedBefore: boolean,
    initialVersions: IVersions,
    currentVersions: IVersions,
    isFetching: boolean,
    maxResults: number,
    displayNoSearchResultsMessage: boolean
    maxResultsReached: boolean
}

class App extends Component<Props, IApp>{
    /**
     * gets the language, selected button, selected list, selected date and search results and bind them
     * @param props
     */
    constructor(props) {
        super(props);
        this.state = {
            language: RouterService.getLanguage(),
            selectedButton: RouterService.getCatalog(),
            selectedVersion: this.initializeVersionFromURL(),
            selectedDate: dateFormat(new Date(), "dd.mm.yyyy"),
            searchResults: [],
            clickedOnLogo: false,
            reSetPath: false,
            collapseMenu: window.innerWidth <= 991,
            hasCollapsedBefore: false,
            initialVersions: {
                'ICD': [], 'CHOP:': [], 'TARMED': [], 'TARDOC': [], 'SwissDRG': [], 'AmbGroup': [], 'Reha': [], 'Supplements': []
            },
            currentVersions: {
                'ICD': [], 'CHOP:': [], 'TARMED': [], 'TARDOC': [], 'SwissDRG': [], 'AmbGroup': [], 'Reha': [],  'Supplements': []
            },
            isFetching: true,
            maxResults: 10,
            displayNoSearchResultsMessage: false,
            maxResultsReached: false
        };
        this.changeSelectedButton = this.changeSelectedButton.bind(this);
        this.changeSelectedDate = this.changeSelectedDate.bind(this);
        this.changeSelectedVersion = this.changeSelectedVersion.bind(this);
        this.reRenderButton = this.reRenderButton.bind(this);
        this.reNavigateToHome = this.reNavigateToHome.bind(this)
        this.reSetClickedOnLogo = this.reSetClickedOnLogo.bind(this)
        this.toggleCollapse = this.toggleCollapse.bind(this);
        this.showSearchResults = this.showSearchResults.bind(this);
        this.toggleLoadMoreResults = this.toggleLoadMoreResults.bind(this);
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
     * Updates searchResults (search results array), displayNoResults (boolean) and maxReached (boolean).
     */
    updateSearchResultsState = (searchResults: any[], displayNoResults: boolean, maxReached: boolean) => {
        this.setState({
            searchResults: searchResults,
            displayNoSearchResultsMessage: displayNoResults,
            maxResultsReached: maxReached
        });
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

    /**
     * Toggles the state of the `loadMoreResults` flag.
     *
     * Triggered by button click and triggers 10 more search results to show.
     */
    toggleLoadMoreResults = () => {
        this.setState((prevState) => ({
            maxResults: prevState.maxResults + 10,
        }));
    };

    async notAvailableToast(lang) {
        const {t} = this.props.translation;
        // Adding toastId avoids toast getting rendered multiple times (since we're firing this in component did mount
        // and update. This want be necessary if we rewrite everything into functional components and use effect hook.
        toast.warning(t("LBL_VERSION_NOT_AVAILABLE"), {
            position: toast.POSITION.TOP_RIGHT,
            toastId: 'no_version_toast',
        });
        await this.changeLanguage(lang);
    }

    /**
     * Navigates to the correct path.
     * @param prevProps
     * @param prevState
     * @param snapshot
     */
    async componentDidUpdate(prevProps, prevState, snapshot) {
        // version is empty for non versionized catalogs.
        let version = this.state.selectedVersion;
        let button = this.state.selectedButton;
        let searchString = RouterService.getParamValue('query') === "" ? "" : "?query=" +
            RouterService.getParamValue('query');
        let resource_type = RouterService.getResourceType();
        let code = RouterService.getCode();

        // Check for navigation other than language change.
        let navigationWithoutLanguageChange = false;
        if (prevState.selectedButton !== this.state.selectedButton ||
            prevState.selectedVersion !== this.state.selectedVersion ||
            prevState.selectedDate !== this.state.selectedDate ||
            this.state.reSetPath) {
            navigationWithoutLanguageChange = true;
            switch(button) {
                case 'MIGEL':
                case 'AL':
                case 'DRUG':
                    code = 'all';
                    resource_type = button.toLowerCase() + 's';
                    break;
                case 'SwissDRG':
                    code = version;
                    resource_type = 'mdcs';
                    break;
                case 'Supplements':
                    code = version;
                    resource_type = 'supplements';
                    break;
                case 'AmbGroup':
                    code = version;
                    resource_type = 'capitula';
                    break;
                case 'Reha':
                    code = version;
                    resource_type = 'arcgs';
                    break;
                default:
                    code = version;
                    resource_type = button.toLowerCase() + '_chapters';
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
                await this.notAvailableToast(prevState.language);
            }
            this.setState({reSetPath: false})
        }
    }

    /**
     * If component mount set the states
     * @returns {Promise<void>}
     */
    async componentDidMount() {
        window.addEventListener('resize', this.handleResize);
        this.handleResize(); // Call the handleResize method initially
        await this.setState({initialVersions: await getVersionsByLanguage('de')})
        await this.setState({currentVersions: await getVersionsByLanguage(this.state.language)})
        // If medcodesearch is accessed via root url, i.e. medcodesearch.ch, there is no version from url, i.e. the
        // placeholder ICD10-GM-XXXX set in initializeVersionFromURL has to be transformed to latest ICD.
        if (this.state.selectedVersion === "ICD10-GM-XXXX") {
            await this.setState({selectedVersion:  this.state.initialVersions['ICD'].at(-1)})
        }
        if (!this.isValidVersion(this.state.selectedButton, this.state.selectedVersion, this.state.language)) {
            await this.reNavigateToHome();
        }
        await this.setState({isFetching: false})
    }

    componentWillUnmount() {
        window.removeEventListener("resize", this.handleResize);
    }

    /**
     * change the reSetPath state to true
     */
    reRenderButton(){
        this.setState({reSetPath: true});
    }

    /**
     * Returns the labels for the catalog buttons depending on the chosen language.
     * @returns labels
     */
    labelHash() {
        const {t} = this.props.translation;
        return {
            'ICD': t("LBL_ICD_LABEL"),
            'CHOP': 'CHOP',
            'SwissDRG': 'SwissDRG',
            'TARMED': 'TARMED',
            'TARDOC': 'TARDOC',
            'AmbGroup': t("LBL_AMB_GROUP"),
            'MIGEL': t("LBL_MIGEL_LABEL"),
            'AL': t("LBL_AL"),
            'DRUG': t("LBL_DRUG"),
            'Reha': 'ST Reha',
            'Supplements': t("LBL_SUPPLEMENTS")
        }
    }

    /**
     * Render search results from the backend.
     * @returns {JSX.Element}
     */
    searchResults = (showButtons) => {
        const {t} = this.props.translation;
        const searchResults =
            this.state.displayNoSearchResultsMessage ?
                <div className="searchResult">{t("LBL_NO_RESULTS")}</div> :
                this.state.searchResults.map((searchResult) => (
                    <SearchResult
                        result={searchResult}
                        language={this.state.language}
                        toggleCollapse={this.toggleCollapse}/>
                    ));

        return (
            this.state.searchResults.length > 0  || this.state.displayNoSearchResultsMessage ?
            <div key={"search_results"} className="col-12 col-lg">
                <div className="container" id="searchResults">
                    <p className="text-center mt-3">
                        <button
                            onClick={this.toggleCollapse}
                            className={"btn d-lg-none"}
                            type="button"
                            id={"collapse-button"}
                            data-target="#collapseExample"
                            aria-expanded="false"
                            aria-controls="collapseExample"
                        >
                            {this.state.collapseMenu ? t("LBL_SHOW_SEARCH_RESULTS") : t("LBL_HIDE_SEARCH_RESULTS")}
                        </button>
                    </p>
                    <Collapse in={!this.state.collapseMenu}>
                        <div>
                            {searchResults}
                        </div>
                    </Collapse>
                </div>
                {showButtons &&
                    <div className="d-flex justify-content-between">
                        <div className="d-flex">
                            {!this.state.maxResultsReached &&
                                <button
                                    className={"btn ml-0"}
                                    id={"load-more-button"}
                                    onClick={this.toggleLoadMoreResults}
                                    style={{marginRight: '10px'}} // Add a right margin
                                >
                                    {t("LBL_LOAD_MORE_RESULTS")}
                                </button>
                            }
                        </div>
                        <div className="d-flex">
                            {this.state.maxResults > 10 &&
                                <button
                                    className={"btn mr-0"}
                                    id={"reset-button"}
                                    onClick={() => this.setState({maxResults: 10})}
                                    style={{marginLeft: '10px'}} // Add a left margin
                                >
                                    {t("LBL_RESET_RESULTS")}
                                </button>
                            }
                        </div>
                    </div>
                }
            </div> : null
        )
    }

    /**
     * Hide the catalog div if the window is too small.
     * @param e
     */
    toggleCollapse = () => {
        if (window.innerWidth <= 991) {
            this.setState({
                collapseMenu: !this.state.collapseMenu
            });
        }
    }

    /**
     * Handles the collapseMenu state attribute according to the screen size.
     * If the screen is mobile-sized, the `collapseMenu` state is set to `false`. Otherwise, the `collapseMenu` state
     * is left unchanged.
     */
    handleResize = () => {
        if (window.innerWidth >= 1200) {
            this.setState({
                    collapseMenu: false,
                    hasCollapsedBefore: false
                }
            )
        } else if (window.innerWidth > 991 && window.innerWidth < 1200) {
            this.setState({
                    collapseMenu: false,
                    hasCollapsedBefore: false
                }
            )
        } else {
            this.setState((prevState) => ({
                collapseMenu: prevState.hasCollapsedBefore ? prevState.collapseMenu : true,
                hasCollapsedBefore: prevState.hasCollapsedBefore ? prevState.hasCollapsedBefore : true
            }));
        }
    };

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
        // Clear current searchbar input.
        const searchbarInput = document.getElementById('searchbarInput') as HTMLInputElement;
        if (searchbarInput) {
            searchbarInput.value = "";
        }
        this.setState({clickedOnLogo: true});
        let latestICD = this.state.initialVersions['ICD'].at(-1);
        this.changeSelectedButton('ICD')
        this.changeSelectedVersion(latestICD)
        this.props.navigation(
            {pathname: "/" + this.state.language + "/ICD/" + latestICD + "/icd_chapters/" + latestICD,search: ''});
    }

    /**
     * Change the clickedOnLogo state.
     */
    reSetClickedOnLogo(){
        this.setState({clickedOnLogo: false})
    }

    renderAfterFetch() {
        const isDesktop = window.innerWidth >= 1200;
        const showSearchResultButtons = (isDesktop || !this.state.collapseMenu) && this.state.searchResults.length != 0;
        return(
            <div key={"app_content"}>
                {isDesktop ?
                    <div className={"catalogAndSearchbarContainer"}>
                        <ButtonGroup
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
                            labels={this.labelHash()}
                            buttons={['ICD', 'CHOP', 'SwissDRG', 'Supplements', 'Reha', 'TARMED', 'TARDOC',
                                'AmbGroup', 'MIGEL', 'AL', 'DRUG']}
                        />
                        <div className={"searchbarItem"} onClick={this.showSearchResults}>
                            <Searchbar
                                language={this.state.language}
                                selectedButton={this.state.selectedButton}
                                version={this.state.selectedVersion}
                                selectedDate={this.state.selectedDate}
                                updateSearchResultsState={this.updateSearchResultsState}
                                maxResults={this.state.maxResults}
                            />
                        </div>
                    </div> :
                    <>
                        <div key={"app_searchbar"} className="row">
                            <div className={"search-mobile"} onClick={this.showSearchResults}>
                                <Searchbar
                                    language={this.state.language}
                                    selectedButton={this.state.selectedButton}
                                    version={this.state.selectedVersion}
                                    selectedDate={this.state.selectedDate}
                                    updateSearchResultsState={this.updateSearchResultsState}
                                    maxResults={this.state.maxResults}
                                />
                            </div>
                        </div>
                        <div key={"app_buttons"} className="row">
                            <div className={"centerMobileButtons"}>
                                <ButtonGroup
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
                                    labels={this.labelHash()}
                                    buttons={['ICD', 'CHOP', 'SwissDRG', 'Supplements', 'Reha', 'TARMED', 'TARDOC',
                                        'AmbGroup', 'MIGEL', 'AL', 'DRUG']}
                                />
                            </div>
                        </div>
                    </>
                }
                <div key={"app_body"} className="row">
                    <div className="Wrapper">
                        <div className="row">
                            {this.searchResults(showSearchResultButtons)}
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
                    <div key={"app_header"} className="row col">
                            <Header
                                changeLanguage={this.changeLanguage}
                                activeLanguage={this.state.language}
                            />
                    </div>
                    <div key={"app_logo"} className="row col">
                            <img onClick={this.reNavigateToHome} alt="logo" id="logo" src={logo}/>
                    </div>
                    {this.state.isFetching ? loadingSpinner() : this.renderAfterFetch()}
                    <div key={"app_footer"} className="navbar row col">
                        <div key={"app_footer_0"}>
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
    return props => <Component {...props} navigation={useNavigate()} translation={useTranslation()}/>;
}

export default addProps(App);
