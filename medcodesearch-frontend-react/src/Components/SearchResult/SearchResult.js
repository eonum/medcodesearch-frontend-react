import {Component} from "react";
import './SearchResult.css';

class SearchResult extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <div class="searchResult">
                <p>{this.props.text}</p>
            </div>
        )
    }
}

export default SearchResult;
