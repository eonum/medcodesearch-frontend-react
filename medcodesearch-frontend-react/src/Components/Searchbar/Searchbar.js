import {Component, useState} from "react";
import {Button, Form, FormControl} from "react-bootstrap";
import './Searchbar.css';
import {BsSearch} from "react-icons/bs";
import calendarLogo from "../../assets/calendar.png";
import Calendar from "react-calendar";
import {Route} from "react-router-dom";
import Popup from 'reactjs-popup';

class Searchbar extends Component {

    constructor(props) {
        super(props);
        this.state = {
            date: new Date(),
            searchTerm: ""
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
                    />
                    <Popup trigger={
                        <Button id="cal" onClick={(e) => {
                            e.preventDefault()
                        }}>
                            <img id="calendarLogo" src={calendarLogo}/>
                        </Button>
                            }position="bottom left">
                        <div>
                        <Calendar onChange={(selectedDate) =>{
                            this.setState({date: selectedDate})}}
                        />
                        </div>
                    </Popup>
                    <Button id="btn-go">
                        <BsSearch/>
                    </Button>
                </Form>
            </div>
        )
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if(prevProps.language !== this.props.language || prevProps.selectedButton !== this.props.selectedButton) {
            this.fetchForSearchTerm(this.state.searchTerm)
        }
    }


    async fetchForSearchTerm(searchTerm){
        this.setState({searchTerm: searchTerm})
        await fetch('https://search.eonum.ch/' + this.props.language + '/' + this.convertCategory(this.props.selectedButton) + '/search?highlight=1&search='+ searchTerm)
            .then((res) => {
                if(res.ok) {
                    return res.json()
                }
            })
            .then((json) => {
                this.props.searchResults("reset") //reset parent array
                if(json.length == 0 && searchTerm !== "") {
                    this.props.searchResults("empty")
                }
                for(let i = 0; i < json.length; i++) {
                    let obj = json[i];
                    this.props.searchResults(obj);
                }
            })
    }
    /*
<Calendar/> https://www.npmjs.com/package/react-calendar
    */
}
export default Searchbar;
