import {Component} from "react";
import './SearchResult.css';
import {useNavigate} from "react-router-dom";
import RouterService from "../../Services/router.service";

class SearchResult extends Component {
    constructor(props) {
        super(props);
    }

    handleClick = () => {
        let navigate = this.props.navigation
        navigate({pathname: "/de/ICD/ICD10-GM-2022/icds/" + this.props.result.code,
            search: RouterService.getQueryVariable('query') === "" ? "" : "?query=" + RouterService.getQueryVariable('query')})
    }

    render() {
        let synonyms;
        if(this.props.result.highlight.synonyms === undefined || this.props.result.highlight.text !== undefined) {
            synonyms = <></>
        } else {
             synonyms = <div className="small">Synonyme<ul>
                {this.props.result.highlight.synonyms.map(function(synonym, i) {
                    return <li key={i} dangerouslySetInnerHTML={{__html: synonym.replace(/(<em>)/g, "<strong>").replace(/(<\/em>)/g, "</strong>")}}/>
                })}
            </ul></div>
        }
        let inclusions;
        if(this.props.result.highlight.inclusions === undefined || this.props.result.highlight.text !== undefined) {
            inclusions = <></>
        } else {
            inclusions = <div className="small">Inklusionen<ul>
                {this.props.result.highlight.inclusions.map(function(inclusion, i) {
                    return <li key={i} dangerouslySetInnerHTML={{__html: inclusion.replace(/(<em>)/g, "<strong>").replace(/(<\/em>)/g, "</strong>")}}/>
                })}
            </ul></div>
        }
        return (
            <div className="searchResult" onClick={this.handleClick}>
                <dl>
                    <dt><span className="link">{this.props.result.code}</span></dt>
                    <dd id="noMargin" dangerouslySetInnerHTML={{__html: this.props.result.highlight.text === undefined ? this.props.result.text : this.props.result.highlight.text[0].replace(/(<em>)/g, "<strong>").replace(/(<\/em>)/g, "</strong>")}}/>
                </dl>
                {inclusions}
                {synonyms}
            </div>
        )
    }
}

export default function(props) {
    const navigation = useNavigate();
    return <SearchResult {...props} navigation={navigation}/>;
}
