import './App.css';
import './index.css';
import Footer from './Components/Footer/footer';
import Header from './Components/Header/header';
import {Navigate, Routes, Route, Outlet, useNavigate} from "react-router-dom";
import Searchbar from './Components/Searchbar/Searchbar'
import SearchResult from "./Components/SearchResult/SearchResult";
import logo from "./assets/medcodesearch_big.png";
import ButtonGroup from "./Components/Buttons/ButtonGroup";
import RouterService from "./Services/router.service";
import React, {useState, useEffect, useRef, useCallback} from "react";
import {Collapse} from "react-bootstrap";
import {getVersionsByLanguage} from "./Services/catalog-version.service";
import {IVersions} from "./interfaces";
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

interface ISearchResult {
    code: string,
    text: string,
    terminal: boolean,
    url: string,
    highlight: object
}

const emptyVersions: IVersions = {
    'ICD': [], 'CHOP': [], 'TARMED': [], 'TARDOC': [], 'SwissDRG': [], 'AmbGroup': [], 'Reha': [], 'Supplements': []
}

/**
 * get the version defined in the url and if it isn't defined set it to latest icd version.
 */
function initializeVersionFromURL() {
    if(window.location.pathname !== '/') {
        let arr = window.location.pathname.split("/")
        if(arr.length === 6) {
            return arr[3]
        } else {
            return ''
        }
    }
    // Base version placeholder for ICD when visiting medcodesearch.ch.
    // Will be set in mount effect to latestICD.
    return 'ICD10-GM-XXXX'
}

function App() {
    const navigate = useNavigate();
    const { t } = useTranslation();

    const [language, setLanguage] = useState(RouterService.initializeLanguageFromURL());
    const [selectedButton, setSelectedButton] = useState(RouterService.initializeCatalogFromURL());
    const [selectedVersion, setSelectedVersion] = useState(initializeVersionFromURL());
    const [selectedDate, setSelectedDate] = useState(dateFormat(new Date(), "dd.mm.yyyy"));
    const [searchResults, setSearchResults] = useState<string[] | ISearchResult[]>([]);
    const [clickedOnLogo, setClickedOnLogo] = useState(false);
    const [reSetPath, setReSetPath] = useState(false);
    const [collapseMenu, setCollapseMenu] = useState(window.innerWidth <= 991);
    const [initialVersions, setInitialVersions] = useState<IVersions>({...emptyVersions});
    const [currentVersions, setCurrentVersions] = useState<IVersions>({...emptyVersions});
    const [isFetching, setIsFetching] = useState(true);
    const [isSearching, setIsSearching] = useState(false);
    const [maxResults, setMaxResults] = useState(10);
    const [displayNoSearchResultsMessage, setDisplayNoSearchResultsMessage] = useState(false);
    const [maxResultsReached, setMaxResultsReached] = useState(false);

    // Track hasCollapsedBefore in a ref since it's not rendered
    const hasCollapsedBeforeRef = useRef(false);

    // Track whether initial mount effects have completed
    const isInitialNavRef = useRef(true);
    const isInitialLangRef = useRef(true);

    // Track previous language for reverting on invalid version
    const prevLanguageRef = useRef(language);
    const skipLangEffectRef = useRef(false);

    /**
     * Handles the collapseMenu state attribute according to the screen size.
     */
    const handleResize = useCallback(() => {
        if (window.innerWidth >= 1200 || (window.innerWidth > 991 && window.innerWidth < 1200)) {
            setCollapseMenu(false);
            hasCollapsedBeforeRef.current = false;
        } else {
            if (!hasCollapsedBeforeRef.current) {
                setCollapseMenu(true);
                hasCollapsedBeforeRef.current = true;
            }
        }
    }, []); // eslint-disable-line

    /**
     * Returns true if selected button has a valid version, false otherwise.
     */
    function isValidVersion(button: string, version: string, lang: string, currentVers: IVersions): boolean {
        if(button === 'MIGEL' || button === 'AL' || button === 'DRUG') {
            return lang !== "en"
        } else {
            return currentVers[button]?.includes(version) ?? false
        }
    }

    /**
     * Builds the navigation path from current state.
     */
    function buildPath(btn = selectedButton, ver = selectedVersion): string {
        let resource_type: string;
        let code: string;

        switch(btn) {
            case 'MIGEL':
            case 'AL':
            case 'DRUG':
                code = 'all';
                resource_type = btn.toLowerCase() + 's';
                break;
            case 'SwissDRG':
                code = ver;
                resource_type = 'mdcs';
                break;
            case 'Supplements':
                code = ver;
                resource_type = 'supplements';
                break;
            case 'AmbGroup':
                code = ver;
                resource_type = 'capitula';
                break;
            case 'Reha':
                code = ver;
                resource_type = 'arcgs';
                break;
            default:
                code = ver;
                resource_type = btn.toLowerCase() + '_chapters';
        }

        return language + "/" + btn + '/' + ver + (ver.length === 0 ? "" : '/') + resource_type + '/' + code;
    }

    /**
     * Reset everything back to the default but stay in current language.
     */
    function reNavigateToHome(initVers?: IVersions) {
        // Clear current searchbar input.
        const searchbarInput = document.getElementById('searchbarInput') as HTMLInputElement;
        if (searchbarInput) {
            searchbarInput.value = "";
        }
        setClickedOnLogo(true);
        const vers = initVers || initialVersions;
        let latestICD = vers['ICD'].at(-1);
        setSelectedButton('ICD')
        setSelectedVersion(latestICD)
        navigate({pathname: "/" + language + "/ICD/" + latestICD + "/icd_chapters/" + latestICD, search: ''});
    }

    /**
     * Mount effect: setup resize listener, fetch versions, validate.
     */
    useEffect(() => {
        window.addEventListener('resize', handleResize);
        handleResize();

        async function init() {
            const initVers = await getVersionsByLanguage('de');
            setInitialVersions(initVers);
            const currVers = await getVersionsByLanguage(language);
            setCurrentVersions(currVers);

            let resolvedVersion = selectedVersion;
            if (resolvedVersion === 'ICD10-GM-XXXX') {
                resolvedVersion = initVers['ICD'].at(-1);
                setSelectedVersion(resolvedVersion);
            }

            if (!isValidVersion(selectedButton, resolvedVersion, language, currVers)) {
                reNavigateToHome(initVers);
            }
            setIsFetching(false);
        }
        init();

        return () => window.removeEventListener('resize', handleResize);
    }, []); // eslint-disable-line

    /**
     * Navigation effect: when button/version/date/reSetPath changes, navigate to new path.
     */
    useEffect(() => {
        if (isInitialNavRef.current) {
            isInitialNavRef.current = false;
            return;
        }
        if (isFetching) return;

        const searchString = RouterService.getQueryVariable('query') === "" ? "" :
            "?query=" + RouterService.getQueryVariable('query');

        if (isValidVersion(selectedButton, selectedVersion, language, currentVersions)) {
            navigate({
                pathname: buildPath(),
                search: searchString
            })
        } else {
            toast.warning(t("LBL_VERSION_NOT_AVAILABLE"), { position: "top-right" });
        }
        setReSetPath(false);
    }, [selectedButton, selectedVersion, selectedDate, reSetPath]); // eslint-disable-line

    /**
     * Language change effect: fetch new versions and navigate or show toast.
     */
    useEffect(() => {
        if (isInitialLangRef.current) {
            isInitialLangRef.current = false;
            return;
        }

        if (skipLangEffectRef.current) {
            skipLangEffectRef.current = false;
            return;
        }

        const prevLang = prevLanguageRef.current;
        prevLanguageRef.current = language;

        const searchString = RouterService.getQueryVariable('query') === "" ? "" :
            "?query=" + RouterService.getQueryVariable('query');

        async function handleLanguageChange() {
            const currVers = await getVersionsByLanguage(language);
            setCurrentVersions(currVers);

            // If version is the initial placeholder, defer navigation to the mount effect.
            if (selectedVersion === 'ICD10-GM-XXXX') return;

            if (isValidVersion(selectedButton, selectedVersion, language, currVers)) {
                navigate({
                    pathname: buildPath(),
                    search: searchString
                })
            } else {
                toast.warning(t("LBL_VERSION_NOT_AVAILABLE"), {
                    position: "top-right",
                    toastId: 'no_version_toast',
                });
                // Revert language
                skipLangEffectRef.current = true;
                setLanguage(prevLang);
            }
        }
        handleLanguageChange();
    }, [language]); // eslint-disable-line

    /**
     * @param searchResult
     */
    const updateSearchResults = (results) => {
        setSearchResults(results);
        setIsSearching(false);
    }

    /**
     * Toggles the state of the `loadMoreResults` flag.
     */
    function toggleLoadMoreResults() {
        setMaxResults(prev => prev + 10);
    }

    /**
     * Returns the labels for the catalog buttons depending on the chosen language.
     */
    function labelHash() {
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
     * Hide the catalog div if the window is too small.
     */
    function showHide() {
        if (window.innerWidth <= 991) {
            setCollapseMenu(prev => !prev);
        }
    }

    /**
     * set the collapseMenu state to false and open it
     */
    function showSearchResults() {
        setCollapseMenu(false);
    }

    /**
     * change the reSetPath state to true
     */
    function reRenderButton() {
        setReSetPath(true);
    }

    /**
     * Change the clickedOnLogo state.
     */
    function reSetClickedOnLogo() {
        setClickedOnLogo(false);
    }

    /**
     * Render search results from the backend.
     */
    function renderSearchResults(showButtons) {
        const results =
            displayNoSearchResultsMessage ?
                <div className="searchResult">{t("LBL_NO_RESULTS")}</div> :
                (searchResults as any[]).map((searchResult) => {
                    return <SearchResult result={searchResult} key={searchResult.code} showHide={showHide}/>
                })

        return (
            (searchResults.length > 0 || displayNoSearchResultsMessage || isSearching) &&
            <div key={"search_results"} className="col-12 col-lg">
                <div className="container" id="searchResults">
                    <p className="text-center mt-3">
                        <button
                            onClick={showHide}
                            className={"btn d-lg-none"}
                            type="button"
                            id={"collapse-button"}
                            data-target="#collapseExample"
                            aria-expanded="false"
                            aria-controls="collapseExample"
                        >
                            {collapseMenu ? t("LBL_SHOW_SEARCH_RESULTS") : t("LBL_HIDE_SEARCH_RESULTS")}
                        </button>
                    </p>
                    <Collapse in={!collapseMenu}>
                        <div>
                            {isSearching ?
                                loadingSpinner() :
                                results
                            }
                        </div>
                    </Collapse>
                </div>
                {showButtons && (
                    <div className="d-flex justify-content-between">
                        <div className="d-flex">
                            {!maxResultsReached && (
                                <button
                                    className={"btn ml-0"}
                                    id={"load-more-button"}
                                    onClick={toggleLoadMoreResults}
                                    style={{marginRight: '10px'}}
                                >
                                    {t("LBL_LOAD_MORE_RESULTS")}
                                </button>
                            )}
                        </div>
                        <div className="d-flex">
                            {maxResults > 10 && (
                                <button
                                    className={"btn mr-0"}
                                    id={"reset-button"}
                                    onClick={() => setMaxResults(10)}
                                    style={{marginLeft: '10px'}}
                                >
                                    {t("LBL_RESET_RESULTS")}
                                </button>
                            )}
                        </div>
                    </div>
                )}
            </div>
        )
    }

    function renderAfterFetch() {
        const isDesktop = window.innerWidth >= 1200;
        const showSearchResultButtons = (isDesktop || !collapseMenu) && searchResults.length != 0;
        return(
            <div key={"app_content"}>
                {isDesktop ?
                    <div className={"catalogAndSearchbarContainer"}>
                        <ButtonGroup
                            initialVersions={initialVersions}
                            currentVersions={currentVersions}
                            clickedOnLogo={clickedOnLogo}
                            selectedButton={selectedButton}
                            version={selectedVersion}
                            reSetClickOnLogo={reSetClickedOnLogo}
                            reSetButton={reRenderButton}
                            changeLanguage={setLanguage}
                            language={language}
                            changeSelectedButton={setSelectedButton}
                            changeSelectedVersion={setSelectedVersion}
                            changeSelectedDate={setSelectedDate}
                            labels={labelHash()}
                            buttons={['ICD', 'CHOP', 'SwissDRG', 'Supplements', 'Reha', 'TARMED', 'TARDOC',
                                'AmbGroup', 'MIGEL', 'AL', 'DRUG']}
                        />
                        <div className={"searchbarItem"} onClick={showSearchResults}>
                            <Searchbar
                                language={language}
                                selectedButton={selectedButton}
                                version={selectedVersion}
                                selectedDate={selectedDate}
                                updateSearchResults={updateSearchResults}
                                maxResults={maxResults}
                                updateDisplayNoSearchResultsMessage={setDisplayNoSearchResultsMessage}
                                updateMaximumResultsReached={setMaxResultsReached}
                                setIsSearching={(searching) => setIsSearching(searching)}
                            />
                        </div>
                    </div> :
                    <>
                        <div key={"app_searchbar"} className="row">
                            <div className={"search-mobile"} onClick={showSearchResults}>
                                <Searchbar
                                    language={language}
                                    selectedButton={selectedButton}
                                    version={selectedVersion}
                                    selectedDate={selectedDate}
                                    updateSearchResults={updateSearchResults}
                                    maxResults={maxResults}
                                    updateDisplayNoSearchResultsMessage={setDisplayNoSearchResultsMessage}
                                    updateMaximumResultsReached={setMaxResultsReached}
                                    setIsSearching={(searching) => setIsSearching(searching)}
                                />
                            </div>
                        </div>
                        <div key={"app_buttons"} className="row">
                            <div className={"centerMobileButtons"}>
                                <ButtonGroup
                                    initialVersions={initialVersions}
                                    currentVersions={currentVersions}
                                    clickedOnLogo={clickedOnLogo}
                                    selectedButton={selectedButton}
                                    version={selectedVersion}
                                    reSetClickOnLogo={reSetClickedOnLogo}
                                    reSetButton={reRenderButton}
                                    changeLanguage={setLanguage}
                                    language={language}
                                    changeSelectedButton={setSelectedButton}
                                    changeSelectedVersion={setSelectedVersion}
                                    changeSelectedDate={setSelectedDate}
                                    labels={labelHash()}
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
                            {renderSearchResults(showSearchResultButtons)}
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

    function renderContent() {
        return (
            <div>
                <div className="container">
                    <div key={"app_header"} className="row col">
                        <Header
                            changeLanguage={setLanguage}
                            activeLanguage={language}
                        />
                    </div>
                    <div key={"app_logo"} className="row col">
                        <img onClick={() => reNavigateToHome()} alt="logo" id="logo" src={logo}/>
                    </div>
                    {isFetching ? loadingSpinner() : renderAfterFetch()}
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
    let latestICD = initialVersions['ICD'].at(-1);
    return (
        <>
            <Routes>
                <Route path="/" element={renderContent()}>
                    <Route path="/" element={<Navigate to={language + "/ICD/" + latestICD + "/icd_chapters/" + latestICD}/>}/>
                    <Route path=":language/:catalog/:resource_type/:code" element={<CodeBodyUnversionized selectedDate={selectedDate} />}/>
                    <Route path=":language/:catalog/:version/:resource_type/:code" element={<CodeBodyVersionized/>}/>
                </Route>
            </Routes>
        </>
    )
}

export default App;
