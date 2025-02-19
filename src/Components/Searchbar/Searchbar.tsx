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

    /**
     * set the state for searchTerm and calls the fetch
     */
    async componentDidMount() {
        this.setState({
            searchTerm: RouterService.getQueryVariable('query')
        })
        await this.fetchForSearchTerm(RouterService.getQueryVariable('query'));
    }

    /**
     * changes the url to the search
     * @param e
     */
    updateSearch = async (e) => {
        let date = '';
        let navigate = this.props.navigation
        if (e.target.value === "") {
            navigate({search: ""});
        } else {
            if (this.props.selectedButton === 'MIGEL' || this.props.selectedButton === 'AL'
                || this.props.selectedButton === 'DRUG') {
                if (this.props.selectedDate !==  dateFormat(new Date(), "dd.mm.yyyy")) {
                    date = 'date=' + this.props.selectedDate + '&'
                }
            }
            navigate({search: date + createSearchParams({query: e.target.value.replace(/\+/g, ' ')}).toString()});
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
     * sets the correct url
     * @param prevProps
     * @param prevState
     * @param snapshot
     */
    async componentDidUpdate(prevProps, prevState, snapshot) {
        // If catalog or version changed, prioritize this update
        if(prevProps.selectedButton !== this.props.selectedButton
            || prevProps.version !== this.props.version
            || prevProps.language !== this.props.language
            || prevProps.selectedDate !== this.props.selectedDate) {
            this.props.updateSearchResults([]); // Clear results first
            await this.fetchForSearchTerm(this.state.searchTerm);
            return;
        }

        // Handle search term or max results changes
        if(this.state.searchTerm !== RouterService.getQueryVariable('query') ||
            prevProps.maxResults !== this.props.maxResults) {
            await this.fetchForSearchTerm(RouterService.getQueryVariable('query'));
        }
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
