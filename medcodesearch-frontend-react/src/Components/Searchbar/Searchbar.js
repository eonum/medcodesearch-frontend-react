import {Component} from "react";
import {Button, Form, FormControl} from "react-bootstrap";
import './Searchbar.css';
import {BsSearch} from "react-icons/bs";
import Calendar from 'react-calendar';
import SearchResult from "../SearchResult/SearchResult";

class Searchbar extends Component {

    constructor(props) {
        super(props);
        this.state = {
            text: [],
            code: [],
        }
    }

    updateSearch = (e) => {
        this.fetchForCode(e.target.value);
    }

    convertCategory(chosenBtn) { //versions are currently harcoded!!
        if(chosenBtn === "SwissDRG") {
            return "drgs/V3.0"
        } else if(chosenBtn === "ICD") {
            return "icds/ICD10-GM-2014"
        } else if(chosenBtn === "CHOP") {
            return "chops/CHOP_2014"
        } else if(chosenBtn === "TARMED") {
            return "tarmeds/TARMED_01.09"
        }
    }

    render() {
        return (
            <div>
                <Form className="d-flex search-center">
                    <FormControl
                        onChange={this.updateSearch}
                        type="search"
                        placeholder="Suchbegriff oder Code eingeben..."
                        className="me-2"
                        aria-label="Search"
                    />
                    <Button id="btn-go">
                        <BsSearch/>
                    </Button>
                </Form>
                {this.state.text.map(function(text, i){
                    return <SearchResult text={text} key={i}/>;
                })}
            </div>
        )
    }

    async fetchForCode(code){
        await fetch('https://search.eonum.ch/de/' + this.convertCategory(this.props.selectedButton) + '/search?search='+ code)
            .then((res) => {
                this.setState({text: [], code: []}) //reset state before fetching again
                if(res.ok) {
                    return res.json()
                }
            })
            .then((json) => {
                for(let i = 0; i < json.length; i++) {
                    let obj = json[i]
                    this.setState({
                        code: [...this.state.code, obj.code],
                        text: [...this.state.text, obj.text],
                    });
                }

            })
            .catch(() => {
                this.setState({
                    text: "Could not find code"
                });
            });
    }
    /*
    componentDidUpdate(prevProps, prevState, snapshot) {
        fetch('https://search.eonum.ch/de/icds/')
<!-- <Calendar/> https://www.npmjs.com/package/react-calendar -->

    }
    */
}



/*
link:
    https://www.emgoto.com/react-search-bar/
        https://github.com/eonum/medcodesearch-frontend-react/
*/
export default Searchbar;
