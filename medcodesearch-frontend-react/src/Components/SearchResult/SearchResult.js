import {Component} from "react";
import './SearchResult.css';

class SearchResult extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <div>
                <p className="searchResult">
                    <dt><span className="link">{this.props.code}</span></dt>
                    <dd>{this.props.text}</dd>
                </p>
            </div>
        )
    }
}

export default SearchResult;
