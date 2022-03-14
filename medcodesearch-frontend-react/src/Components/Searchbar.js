import {Component} from "react";
import {Button, Form, FormControl} from "react-bootstrap";
import './Searchbar.css';
import {BsSearch} from "react-icons/bs";
import Calendar from 'react-calendar';

class Searchbar extends Component {

    constructor(props) {
        super(props);
        this.state = {
            text: [],
            code: []
        }
    }
    render() {
        this.fetchForCode("P67A");
        return (
            <div>
                <h1 key={this.state.code}>{this.state.text}</h1>
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
            </div>
        )
    }

    async fetchForCode(code){
        await fetch('https://search.eonum.ch/de/' + this.props.list + '/V3.0/'+ code)
            .then((res) => res.json())
            .then((json) => {
                console.log(JSON.stringify(json.text));
                this.setState({
                    text: [...this.state.text, json.text],
                    code: [...this.state.code, json.code]
                });
            })
            .catch(() => {
                this.setState({
                    text: [...this.state.text, "Could not find code"],
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