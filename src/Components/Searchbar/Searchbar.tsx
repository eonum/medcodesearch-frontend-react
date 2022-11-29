import React, {Component} from "react";
import {Button, Form, FormControl} from "react-bootstrap";
import './Searchbar.css';
import {BsSearch} from "react-icons/bs";
import {createSearchParams, useNavigate} from "react-router-dom";
import RouterService from "../../Services/router.service";
import getTranslationHash from "../../Services/translation.service";
import {fetchURL} from "../../Utils";
import {INavigationHook} from "../../interfaces";
import dateFormat from "dateformat"

const resourceTypeByBtn = {
    "SwissDRG": 'drgs',
    "ICD": 'icds',
    "CHOP": 'chops',
    "TARMED": 'tarmeds',
    "MiGeL": 'migels',
    "AL": 'laboratory_analyses',
    "DRUG": 'drugs'
}

interface Props {
    language: string,
    selectedButton: string,
    version: string,
    selectedDate: string,
    updateSearchResults: { (searchResult: string | object): void },
    navigation: INavigationHook
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
            if (this.props.selectedButton === 'MiGeL' || this.props.selectedButton === 'AL'
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
        let versionized = ['MiGeL', 'AL', 'DRUG'].includes(chosenBtn) ? false : true
        return versionized ? this.props.version : chosenBtn.toUpperCase()
    }

    /**
     * sets the correct url
     * @param prevProps
     * @param prevState
     * @param snapshot
     */
    async componentDidUpdate(prevProps, prevState, snapshot) {
        if(this.state.searchTerm !== RouterService.getQueryVariable('query')) {
            await this.fetchForSearchTerm(RouterService.getQueryVariable('query'))
        }
        if(prevProps.language !== this.props.language
            || prevProps.selectedButton !== this.props.selectedButton
            || prevProps.version !== this.props.version
            || prevProps.selectedDate !== this.props.selectedDate) {
            await this.fetchForSearchTerm(RouterService.getQueryVariable('query'))
        }
    }

    /**
     * looks for the current button and manipulate the search results
     * @param searchTerm
     * @returns {Promise<void>}
     */
    async fetchForSearchTerm(searchTerm){
        this.setState({searchTerm: searchTerm})
        let date = '';
        if (this.props.selectedButton === 'MiGeL' || this.props.selectedButton === 'AL'){
            if(this.props.selectedDate !== dateFormat(new Date(), "dd.mm.yyyy")){
                date = 'date=' + this.props.selectedDate + '&'
            }
        }
        let searchURL = [fetchURL, this.props.language,
            resourceTypeByBtn[this.props.selectedButton],
            this.convertButtonToBackendVersion(this.props.selectedButton),
        'search?' + date + 'highlight=1&search='+ searchTerm].join("/")
        await fetch(searchURL)
            .then((res) => {
                if(res.ok) {
                    return res.json()
                }
            })
            .then((json) => {
                this.props.updateSearchResults("reset") //reset parent array
                if(json.length === 0 && searchTerm !== "") {
                    this.props.updateSearchResults("empty")
                }
                for(let i = 0; i < json.length; i++) {
                    let obj = json[i];
                    this.props.updateSearchResults(obj);
                }
            })
    }
    /**
     * renders the searchbar
     * @returns {JSX.Element}
     */
    render() {
        let translateJson = getTranslationHash(this.props.language)
        return (
            <div>
                <Form className="d-flex search-center">
                    <FormControl
                        onKeyDown={(e) =>{
                            if (e.key === 'Enter'){
                                e.preventDefault()
                            }
                        }}
                        onChange={this.updateSearch}
                        type="search"
                        placeholder={translateJson["LBL_SEARCH_PLACEHOLDER"]}
                        defaultValue={this.state.searchTerm}
                        className="me-2"
                        aria-label="Search"
                    /><Button id="btn-go">
                        <BsSearch/>
                    </Button>
                </Form>
            </div>
        )
    }
}

function addProps(Component) {
    return props => <Component {...props} navigation={useNavigate()}/>;
}

export default addProps(Searchbar);
