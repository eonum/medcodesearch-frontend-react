import {Component} from "react";
import './SearchResult.css';

class SearchResult extends Component {
    constructor(props) {
        super(props);
    }

    handleClick = () => {
        window.location.href = this.props.result.url;
    }

    render() {
        let synonyms;
        if(this.props.result.highlight.synonyms === undefined || this.props.result.highlight.text !== undefined) {
            synonyms = <></>
        } else {
             synonyms = <div className="small">Synonyme<ul>
                {this.props.result.highlight.synonyms.map(function(synonym, i) {
                    return <li key={i} dangerouslySetInnerHTML={{__html: synonym}}/>
                })}
            </ul></div>
        }
        let inclusions;
        if(this.props.result.highlight.inclusions === undefined || this.props.result.highlight.text !== undefined) {
            inclusions = <></>
        } else {
            inclusions = <div className="small">Inklusionen<ul>
                {this.props.result.highlight.inclusions.map(function(inclusion, i) {
                    return <li key={i} dangerouslySetInnerHTML={{__html: inclusion}}/>
                })}
            </ul></div>
        }

        return (
            <div className="searchResult" onClick={this.handleClick}>
                <dl>
                    <dt><span className="link">{this.props.result.code}</span></dt>
                    <dd id="noMargin" dangerouslySetInnerHTML={{__html: this.props.result.highlight.text === undefined ? this.props.result.text : this.props.result.highlight.text}}/>
                </dl>
                {inclusions}
                {synonyms}
            </div>
        )
    }
}

export default SearchResult;
