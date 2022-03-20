import {Component, useState} from "react";
import {Button, Form, FormControl} from "react-bootstrap";
import './Searchbar.css';
import {BsSearch} from "react-icons/bs";


class Searchbar extends Component {

    constructor(props) {
        super(props);
        this.state = {
            date: new Date(),
        }
    }

    updateSearch = (e) => {
        this.fetchForSearchTerm(e.target.value);
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
                    /><Button id="btn-go">
                        <BsSearch/>
                    </Button>
                </Form>
            </div>
        )
    }


    async fetchForSearchTerm(searchTerm){
        await fetch('https://search.eonum.ch/de/' + this.convertCategory(this.props.selectedButton) + '/search?highlight=1&search='+ searchTerm)
            .then((res) => {
                if(res.ok) {
                    return res.json()
                }
            })
            .then((json) => {
                console.log(json)
                this.props.searchResults("reset") //reset parent array
                for(let i = 0; i < json.length; i++) {
                    let obj = json[i];
                    this.props.searchResults(obj);
                }
            })
    }
}
export default Searchbar;
