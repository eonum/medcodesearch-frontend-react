import {Component} from "react";
import {Button, Form, FormControl} from "react-bootstrap";
import './Searchbar.css';
import {BsSearch} from "react-icons/bs";
import {createSearchParams, useNavigate} from "react-router-dom";
import RouterService from "../../Services/router.service";
import ConvertDate from "../../Services/ConvertDate";
import findJson from "../../Services/findJson";

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
                if (this.props.date !== ConvertDate(new Date().toDateString())) {
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
            || prevProps.date !== this.props.date
            || this.state.reSearch) {
            await this.fetchForSearchTerm(RouterService.getQueryVariable('query'))
            this.setState({reSearch: false})
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
            if(this.props.date !== ConvertDate(new Date().toDateString())){
                date = 'date=' + this.props.date + '&'
            }
        }
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
        let translateJson = findJson(this.props.language)
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
                        value={this.state.searchTerm === "" ? "" : this.state.searchTerm.replaceAll("+", " ")}
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
