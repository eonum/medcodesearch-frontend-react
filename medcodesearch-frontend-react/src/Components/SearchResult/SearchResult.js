import {Component} from "react";
import './SearchResult.css';

class SearchResult extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <div className="searchResult">
                <p>{this.props.code}</p>
                <p>{this.props.text}</p>
            </div>
        )
    }
}

export default SearchResult;
