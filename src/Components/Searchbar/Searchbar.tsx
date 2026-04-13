import React, {useState, useEffect, useRef} from "react";
import {Button, Form, FormControl} from "react-bootstrap";
import './Searchbar.css';
import {BsSearch} from "react-icons/bs";
import {createSearchParams, useNavigate, useLocation} from "react-router-dom";
import {getQueryVariable} from "../../Services/router.service";
import {fetchURL} from "../../Utils";
import dateFormat from "dateformat"
import {useTranslation} from "react-i18next";
import {toast} from "react-toastify";

const resourceTypeByBtn = {
    "SwissDRG": 'drgs',
    "ICD": 'icds',
    "CHOP": 'chops',
    "TARMED": 'tarmeds',
    "TARDOC": 'tardocs',
    "MIGEL": 'migels',
    "AL": 'laboratory_analyses',
    "DRUG": 'drugs',
    'AmbGroup': 'amb_groups',
    'Reha': 'rcgs',
    'Supplements': 'supplements',
    'LKAAT': 'service_catalogs'
}

interface Props {
    language: string,
    selectedButton: string,
    version: string,
    selectedDate: string,
    updateSearchResults: { (searchResult: object): void },
    maxResults: number
    updateDisplayNoSearchResultsMessage: { (displayMessage: boolean): void }
    updateMaximumResultsReached: { (maxResultsReached: boolean): void }
    setIsSearching: { (isSearching: boolean): void }
}

/**
 * is the searchbar of the website, which is responsible to take a string and and hand it off to the correct component
 * @component
 */
function Searchbar(props: Props) {
    const navigate = useNavigate();
    const location = useLocation();
    const { t } = useTranslation();

    const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const searchTermRef = useRef('');

    // Refs to track previous prop values (mirrors componentDidUpdate prevProps)
    const prevSelectedButtonRef = useRef(props.selectedButton);
    const prevVersionRef = useRef(props.version);
    const prevLanguageRef = useRef(props.language);
    const prevSelectedDateRef = useRef(props.selectedDate);
    const prevMaxResultsRef = useRef(props.maxResults);
    const isFirstUpdateRef = useRef(true);

    function updateSearchTermState(term: string) {
        searchTermRef.current = term;
        setSearchTerm(term);
    }

    function debouncedSearch(term: string) {
        if (searchTimeoutRef.current) {
            clearTimeout(searchTimeoutRef.current);
        }
        props.setIsSearching(true);
        searchTimeoutRef.current = setTimeout(() => {
            fetchForSearchTerm(term);
        }, 300);
    }

    /**
     * Mount: initialize from URL and fetch
     */
    useEffect(() => {
        const query = getQueryVariable('query');
        updateSearchTermState(query);
        fetchForSearchTerm(query);
        return () => {
            if (searchTimeoutRef.current) {
                clearTimeout(searchTimeoutRef.current);
            }
        };
    }, []); // eslint-disable-line

    /**
     * Mirrors componentDidUpdate logic using refs to track prev values
     */
    useEffect(() => {
        if (isFirstUpdateRef.current) {
            isFirstUpdateRef.current = false;
            return;
        }

        const query = getQueryVariable('query');

        const prevSelectedButton = prevSelectedButtonRef.current;
        const prevVersion = prevVersionRef.current;
        const prevLanguage = prevLanguageRef.current;
        const prevSelectedDate = prevSelectedDateRef.current;
        const prevMaxResults = prevMaxResultsRef.current;

        // Update refs to current values
        prevSelectedButtonRef.current = props.selectedButton;
        prevVersionRef.current = props.version;
        prevLanguageRef.current = props.language;
        prevSelectedDateRef.current = props.selectedDate;
        prevMaxResultsRef.current = props.maxResults;

        if (prevSelectedButton !== props.selectedButton
            || prevVersion !== props.version
            || prevLanguage !== props.language
            || prevSelectedDate !== props.selectedDate) {
            props.updateSearchResults([]);
            debouncedSearch(searchTermRef.current);
            return;
        }

        if (searchTermRef.current !== query || prevMaxResults !== props.maxResults) {
            updateSearchTermState(query);
            debouncedSearch(query);
        }
    }, [props.selectedButton, props.version, props.language, props.selectedDate, location.search, props.maxResults]); // eslint-disable-line

    /**
     * changes the url to the search
     * @param e
     */
    function updateSearch(e) {
        let date = '';
        const value = e.target.value;

        if (value === "") {
            navigate({search: ""});
        } else {
            if (['MIGEL', 'AL', 'DRUG'].includes(props.selectedButton) &&
                props.selectedDate !== dateFormat(new Date(), "dd.mm.yyyy")) {
                date = 'date=' + props.selectedDate + '&';
            }
            navigate({
                search: date + createSearchParams({query: value.replace(/\+/g, ' ')}).toString()
            });
        }
    }

    /**
     * takes the chosen button name and returns the corresponding resource_type and version joined by "/".
     * @param chosenBtn
     * @returns {string}
     */
    function convertButtonToBackendVersion(chosenBtn) {
        let versionized = ['MIGEL', 'AL', 'DRUG'].includes(chosenBtn) ? false : true
        return versionized ? props.version : chosenBtn
    }

    /**
     * looks for the current button and manipulate the search results
     * @param term
     * @returns {Promise<void>}
     */
    async function fetchForSearchTerm(term: string) {
        const maxResults = props.maxResults;
        updateSearchTermState(term);
        let date = '';
        if (props.selectedButton === 'MIGEL' || props.selectedButton === 'AL'){
            if(props.selectedDate !== dateFormat(new Date(), "dd.mm.yyyy")){
                date = 'date=' + props.selectedDate + '&'
            }
        }
        let searchURL = [fetchURL, props.language,
            resourceTypeByBtn[props.selectedButton],
            convertButtonToBackendVersion(props.selectedButton),
            'search?' + date + 'highlight=1&skip_sort_by_code=1&max_results=' + maxResults +  '&search='+ term]
            .join("/")
        await fetch(searchURL)
            .then((res) => {
                if(res.ok) {
                    return res.json()
                }
                throw new Error(`HTTP ${res.status}`)
            })
            .then((json) => {
                props.setIsSearching(false);
                if(json.length === 0 && term !== "") {
                    props.updateDisplayNoSearchResultsMessage(true)
                } else {
                    props.updateSearchResults(json)
                    props.updateDisplayNoSearchResultsMessage(false)
                    // True when all results are exhausted (fewer returned than requested) or the API
                    // hard cap of 100 is hit — in either case the "load more" button should be hidden.
                    props.updateMaximumResultsReached(json.length < maxResults || json.length === 100)
                }
            })
            .catch(() => {
                props.setIsSearching(false);
                toast.error(t('LBL_FETCH_ERROR'))
            })
    }

    /**
     * renders the searchbar
     * @returns {JSX.Element}
     */
    return (
        <Form className="d-flex">
            <FormControl
                onKeyDown={(e) =>{
                    if (e.key === 'Enter'){
                        e.preventDefault()
                    }
                }}
                onChange={updateSearch}
                type="search"
                placeholder={t("LBL_SEARCH_PLACEHOLDER")}
                defaultValue={searchTerm}
                className="me-2"
                aria-label="Search"
                id={"searchbarInput"}
            />
            <Button id="btn-go">
                <BsSearch/>
            </Button>
        </Form>
    )
}

export default Searchbar;
