import {Component} from "react";
import {Button, Form, FormControl} from "react-bootstrap";
import './Searchbar.css';
import {BsSearch} from "react-icons/bs";
import Calendar from 'react-calendar';

class Searchbar extends Component {

    constructor(props) {
        super(props);

    }
    render() {
        return (
            <Form className="d-flex search-center">
                <FormControl
                    type="search"
                    placeholder="Suchbegriff oder Code eingeben..."
                    className="me-2"
                    aria-label="Search"
                />
                <Button id="btn-go">
                    <BsSearch/>
                </Button>
            </Form>
        )
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