import {Component, useState} from "react";
import {Button, Form, FormControl} from "react-bootstrap";
import './Searchbar.css';
import {BsSearch} from "react-icons/bs";
import {createSearchParams, useLocation, useNavigate} from "react-router-dom";
import RouterService from "../../Services/router.service";


class Searchbar extends Component {

    constructor(props) {
        super(props);
        this.state = {
            date: new Date(),
            searchTerm: ""
        }
    }

    componentDidMount() {
        this.setState({
            searchTerm: RouterService.getQueryVariable('query')
        })
        this.fetchForSearchTerm(RouterService.getQueryVariable('query'));
    }

    updateSearch = (e) => {
        let navigate = this.props.navigation
        this.fetchForSearchTerm(e.target.value);
        if(e.target.value === "") {
            navigate({search: ""});
        } else {
            navigate({search: createSearchParams({query: e.target.value}).toString()});
        }
    }


    convertCategory(chosenBtn) {
        if(chosenBtn === "SwissDRG") {
            return "drgs/" + this.props.version;
        } else if(chosenBtn === "ICD") {
            return "icds/" + this.props.version;
        } else if(chosenBtn === "CHOP") {
            return "chops/" + this.props.version;
        } else if(chosenBtn === "TARMED") {
            return "tarmeds/" + this.props.version;
        } else if (chosenBtn === "MiGeL"){
            return "migels/" + chosenBtn.toUpperCase();
        } else if (chosenBtn === "AL"){
            return "laboratory_analyses/" + chosenBtn.toUpperCase();
        } else if (chosenBtn === "DRUG"){
            return "drugs/" + chosenBtn.toUpperCase();
        }
    }


    render() {
        return (
            <div>
                <Form className="d-flex search-center">
                    <FormControl
                        onKeyDown={(e) =>{
                            if (e.key === 'Enter'){
                                e.preventDefault();
                            }
                        }}
                        onChange={this.updateSearch}
                        type="search"
                        placeholder="Suchbegriff oder Code eingeben..."
                        value={this.state.searchTerm === "" ? "" : this.state.searchTerm}
                        className="me-2"
                        aria-label="Search"
                    /><Button id="btn-go">
                        <BsSearch/>
                    </Button>
                </Form>
            </div>
        )
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if(prevProps.language !== this.props.language
            || prevProps.selectedButton !== this.props.selectedButton
            || prevProps.version !== this.props.version
            || prevProps.selectedDate !== this.props.selectedDate
            || prevState.searchTerm !== RouterService.getQueryVariable('query')) {
            this.fetchForSearchTerm(RouterService.getQueryVariable('query'))
        }
    }


    async fetchForSearchTerm(searchTerm){
        let date = '';
        if (this.props.selectedButton === 'MiGeL' || this.props.selectedButton === 'AL'
        || this.props.selectedButton === 'DRUG') {
            if (this.convertDate(this.props.date) !== 'undefined.undefined.undefined') {
                date = 'date=' + this.convertDate(this.props.date) + '&';
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

    convertDate(date) {
        let split = date.toString().split(' ');
        let day = split[2];
        let month = this.monthConverter(split[1]);
        let year = split[3];
        let convertedDate = day + '.' + month + '.' + year;
        return convertedDate;
    }

    monthConverter(monthString) {
        switch (monthString){
            case 'Jan':
                return '01';
            case 'Feb':
                return '02';
            case 'Mar':
                return '03';
            case 'Apr':
                return '04';
            case 'May':
                return '05';
            case 'Jun':
                return '06';
            case 'Jul':
                return '07';
            case 'Aug':
                return '08';
            case 'Sep':
                return '09';
            case 'Oct':
                return 10;
            case 'Nov':
                return 11;
            case 'Dec':
                return 12;

        }
    }
}
export default function(props) {
    const navigation = useNavigate();
    return <Searchbar {...props} navigation={navigation}/>;
}
