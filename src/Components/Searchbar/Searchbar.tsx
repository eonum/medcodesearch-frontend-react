import React, {Component} from "react";
import {Button, Form, FormControl} from "react-bootstrap";
import './Searchbar.css';
import {BsSearch} from "react-icons/bs";
import {createSearchParams, useNavigate} from "react-router-dom";
import RouterService from "../../Services/router.service";
import {fetchURL} from "../../Utils";
import {INavigationHook} from "../../interfaces";
import dateFormat from "dateformat"
import {useTranslation} from "react-i18next";

const resourceTypeByBtn = {
    "SwissDRG": 'drgs',
    "ICD": 'icds',
    "CHOP": 'chops',
    "TARMED": 'tarmeds',
    "MIGEL": 'migels',
    "AL": 'laboratory_analyses',
    "DRUG": 'drugs',
    'Reha': 'rcgs',
    'Supplements': 'supplements'
}

interface Props {
    language: string,
    selectedButton: string,
    version: string,
    selectedDate: string,
    updateSearchResults: { (searchResult: object): void },
    navigation: INavigationHook
    translation: any
    maxResults: number
    updateDisplayNoSearchResultsMessage: { (displayMessage: boolean): void }
    updateMaximumResultsReached: { (maxResultsReached: boolean): void }
    setIsSearching: { (isSearching: boolean): void }
}

interface ISearchbar  {
    searchTerm: string,
    reSearch: boolean
}

/**
 * is the searchbar of the website, which is responsible to take a string and and hand it off to the correct component
 * @component
 */
class Searchbar extends Component<Props,ISearchbar> {
    searchTimeout: NodeJS.Timeout | null = null;

    /**
     * set the state searchTerm to null
     * @param props
     */
    constructor(props) {
        super(props);
        this.state = {
            searchTerm: "",
            reSearch: false
        }
    }

    debouncedSearch = (searchTerm: string) => {
        if(this.searchTimeout) {
            clearTimeout(this.searchTimeout);
        }
        this.props.setIsSearching(true);

        this.searchTimeout = setTimeout(() => {
            this.fetchForSearchTerm(searchTerm);
        }, 300);
    }

    /**
     * set the state for searchTerm and calls the fetch
     */
    async componentDidMount() {
        const query = RouterService.getQueryVariable('query');
        this.setState({ searchTerm: query });
        await this.fetchForSearchTerm(query);
    }

    /**
     * changes the url to the search
     * @param e
     */
    updateSearch = (e) => {
        let date = '';
        const value = e.target.value;

        if (value === "") {
            this.props.navigation({search: ""});
        } else {
            if (['MIGEL', 'AL', 'DRUG'].includes(this.props.selectedButton) &&
                this.props.selectedDate !== dateFormat(new Date(), "dd.mm.yyyy")) {
                date = 'date=' + this.props.selectedDate + '&';
            }
            this.props.navigation({
                search: date + createSearchParams({query: value.replace(/\+/g, ' ')}).toString()
            });
        }
    }

    /**
     * sets the correct url
     * @param prevProps
     * @param prevState
     * @param snapshot
     */
    async componentDidUpdate(prevProps, prevState, snapshot) {
        const query = RouterService.getQueryVariable('query');

        if(prevProps.selectedButton !== this.props.selectedButton
            || prevProps.version !== this.props.version
            || prevProps.language !== this.props.language
            || prevProps.selectedDate !== this.props.selectedDate) {
            this.props.updateSearchResults([]);
            this.debouncedSearch(this.state.searchTerm);
            return;
        }

        if(this.state.searchTerm !== query || prevProps.maxResults !== this.props.maxResults) {
            this.setState({ searchTerm: query });
            this.debouncedSearch(query);
        }
    }

    componentWillUnmount() {
        if(this.searchTimeout) {
            clearTimeout(this.searchTimeout);
        }
    }

    /**
     * takes the chosen button name and returns the corresponding resource_type and version joined by "/".
     * @param chosenBtn
     * @returns {string}
     */
    convertButtonToBackendVersion(chosenBtn) {
        let versionized = ['MIGEL', 'AL', 'DRUG'].includes(chosenBtn) ? false : true
        return versionized ? this.props.version : chosenBtn
    }

    /**
     * looks for the current button and manipulate the search results
     * @param searchTerm
     * @returns {Promise<void>}
     */
    async fetchForSearchTerm(searchTerm){
        const maxResults = this.props.maxResults;
        this.setState({searchTerm: searchTerm})
        let date = '';
        if (this.props.selectedButton === 'MIGEL' || this.props.selectedButton === 'AL'){
            if(this.props.selectedDate !== dateFormat(new Date(), "dd.mm.yyyy")){
                date = 'date=' + this.props.selectedDate + '&'
            }
        }
        let searchURL = [fetchURL, this.props.language,
            resourceTypeByBtn[this.props.selectedButton],
            this.convertButtonToBackendVersion(this.props.selectedButton),
            'search?' + date + 'highlight=1&skip_sort_by_code=1&max_results=' + maxResults +  '&search='+ searchTerm]
            .join("/")
        await fetch(searchURL)
            .then((res) => {
                if(res.ok) {
                    return res.json()
                }
            })
            .then((json) => {
                this.props.setIsSearching(false);
                if(json.length === 0 && searchTerm !== "") {
                    this.props.updateDisplayNoSearchResultsMessage(true)
                } else {
                    this.props.updateSearchResults(json)
                    this.props.updateDisplayNoSearchResultsMessage(false)
                    this.props.updateMaximumResultsReached(json.length < maxResults || json.length == 100 ? true : false)
                }
            })
    }
    /**
     * renders the searchbar
     * @returns {JSX.Element}
     */
    render() {
        const {t} = this.props.translation
        return (
                <Form className="d-flex">
                    <FormControl
                        onKeyDown={(e) =>{
                            if (e.key === 'Enter'){
                                e.preventDefault()
                            }
                        }}
                        onChange={this.updateSearch}
                        type="search"
                        placeholder={t("LBL_SEARCH_PLACEHOLDER")}
                        defaultValue={this.state.searchTerm}
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
}

function addProps(Component) {
    return props => <Component {...props} navigation={useNavigate()} translation={useTranslation()}/>;
}

export default addProps(Searchbar);
