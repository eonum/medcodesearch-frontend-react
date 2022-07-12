import React, {Component} from "react";
import {Button, Form, FormControl} from "react-bootstrap";
import './Searchbar.css';
import {BsSearch} from "react-icons/bs";
import {createSearchParams, useNavigate} from "react-router-dom";
import RouterService from "../../Services/router.service";
import ConvertDateService from "../../Services/convert-date.service";
import findJsonService from "../../Services/find-json.service";
import {fetchURL} from "../../Utils";

interface Props {
    language: string,
    selectedButton: string,
    version: string,
    date: string,
    searchResults: any,
    navigation: any
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
                if (this.props.date !== ConvertDateService(new Date().toDateString())) {
                    date = 'date=' + this.props.date + '&'
                }
            }
            navigate({search: date + createSearchParams({query: e.target.value}).toString()});
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
    async componentDidUpdate(prevProps, prevState, snapshot) {
        if(this.state.searchTerm !== RouterService.getQueryVariable('query')) {
            await this.fetchForSearchTerm(RouterService.getQueryVariable('query'))
        }
        if(prevProps.language !== this.props.language
            || prevProps.selectedButton !== this.props.selectedButton
            || prevProps.version !== this.props.version
            || prevProps.date !== this.props.date) {
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
            if(this.props.date !== ConvertDateService(new Date().toDateString())){
                date = 'date=' + this.props.date + '&'
            }
        }
        await fetch([fetchURL, this.props.language, this.convertCategory(this.props.selectedButton), 'search?' + date + 'highlight=1&search='+ searchTerm].join("/"))
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
    /**
     * renders the searchbar
     * @returns {JSX.Element}
     */
    render() {
        let translateJson = findJsonService(this.props.language)
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
                        value={this.state.searchTerm === "" ? "" : this.state.searchTerm.replace(/\+/g, ' ')}
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
export default function(props) {
    const NAVIGATION = useNavigate();
    return <Searchbar {...props} navigation={NAVIGATION}/>;
}
