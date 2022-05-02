import {Component, useState} from "react";
import {Button, Form, FormControl} from "react-bootstrap";
import './Searchbar.css';
import {BsSearch} from "react-icons/bs";
import {createSearchParams, useLocation, useNavigate} from "react-router-dom";
import RouterService from "../../Services/router.service";
import ConvertDate from "../../Services/ConvertDate";
import deJson from "../../assets/translations/de.json";
import frJson from "../../assets/translations/fr.json";
import itJson from "../../assets/translations/it.json";
import enJson from "../../assets/translations/en.json";

/**
 * is the searchbar of the website, which is responsible to take a string and and hand it off to the correct component
 * @component
 */
class Searchbar extends Component {

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
        this.reSearch = this.reSearch.bind(this);
    }

    /**
     * set the state for searchTerm and calls the fetch
     */
    componentDidMount() {
        this.setState({
            searchTerm: RouterService.getQueryVariable('query')
        })
        this.fetchForSearchTerm(RouterService.getQueryVariable('query'));
    }

    /**
     * changes the url to the search
     * @param e
     */
    updateSearch = (e) => {
        let date = '';
        let navigate = this.props.navigation
        this.fetchForSearchTerm(e.target.value);
        if(e.target.value === "") {
            navigate({search: ""});
        } else {
            if (this.props.selectedButton === 'MiGeL' || this.props.selectedButton === 'AL'
                || this.props.selectedButton === 'DRUG') {
                if(this.props.date !== ConvertDate(new Date().toDateString())){
                    date = 'date=' + this.props.date + '&'
                }
            }
            navigate({search: date + createSearchParams({query: e.target.value}).toString()});
        }
    }

    /**
     * looks for the correct language file
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
     * takes the chosen button name and returns the name with the version
     * @param chosenBtn
     * @returns {string}
     */
    convertCategory(chosenBtn) {
        if(chosenBtn === "SwissDRG") {
            return "drgs/" + this.props.version;
        } else if(chosenBtn === "ICD") {
            return "icds/" + this.props.version;
        } else if(chosenBtn === "CHOP") {
            return "chops/" + this.props.version;
        } else if(chosenBtn === "TARMED") {
            return "tarmeds/" + this.props.version;
        } else if (chosenBtn.toUpperCase() === "MIGEL"){
            return "migels/" + chosenBtn.toUpperCase();
        } else if (chosenBtn === "AL"){
            return "laboratory_analyses/" + chosenBtn.toUpperCase();
        } else if (chosenBtn === "DRUG"){
            return "drugs/" + chosenBtn.toUpperCase();
        }
    }

    /**
     * sets the correct url
     * @param prevProps
     * @param prevState
     * @param snapshot
     */
    componentDidUpdate(prevProps, prevState, snapshot) {
        if(prevProps.language !== this.props.language
            || prevProps.selectedButton !== this.props.selectedButton
            || prevProps.version !== this.props.version
            || prevProps.date !== this.props.date
            || prevState.searchTerm !== RouterService.getQueryVariable('query')
            || this.state.reSearch) {
            this.fetchForSearchTerm(RouterService.getQueryVariable('query'))
            this.setState({reSearch: false})
        }
    }

    /**
     * looks for the current button and manipulate the search results
     * @param searchTerm
     * @returns {Promise<void>}
     */
    async fetchForSearchTerm(searchTerm){
        let date = '';
        if (this.props.selectedButton === 'MiGeL' || this.props.selectedButton === 'AL'){
            if(this.props.date !== ConvertDate(new Date().toDateString())){
                date = 'date=' + this.props.date + '&'
            }
        }
        this.setState({searchTerm: searchTerm})
        await fetch('https://search.eonum.ch/' + this.props.language + '/' + this.convertCategory(this.props.selectedButton) + '/search?' + date + 'highlight=1&search='+ searchTerm)
            .then((res) => {
                if(res.ok) {
                    return res.json()
                }
            })
            .then((json) => {
                this.props.searchResults("reset") //reset parent array
                if(json.length === 0 && searchTerm !== "") {
                    this.props.searchResults("empty")
                }
                for(let i = 0; i < json.length; i++) {
                    let obj = json[i];
                    this.props.searchResults(obj);
                }
            })
    }

    reSearch(){
        this.setState({reSearch: true});
    }
    /**
     * renders the searchbar
     * @returns {JSX.Element}
     */
    render() {
        let translateJson = this.findJson(this.props.language)
        return (
            <div>
                <Form className="d-flex search-center">
                    <FormControl
                        onKeyDown={(e) =>{
                            if (e.key === 'Enter'){
                                e.preventDefault()
                                this.reSearch();
                            }
                        }}
                        onChange={this.updateSearch}
                        type="search"
                        placeholder={translateJson["LBL_SEARCH_PLACEHOLDER"]}
                        value={this.state.searchTerm === "" ? "" : this.state.searchTerm}
                        className="me-2"
                        aria-label="Search"
                    /><Button id="btn-go" onClick={this.reSearch}>
                        <BsSearch/>
                    </Button>
                </Form>
            </div>
        )
    }


}
export default function(props) {
    const navigation = useNavigate();
    return <Searchbar {...props} navigation={navigation}/>;
}
