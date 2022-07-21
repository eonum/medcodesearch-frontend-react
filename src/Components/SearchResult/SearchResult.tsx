import React, {Component} from "react";
import './SearchResult.css';
import {useNavigate, useLocation} from "react-router-dom";
import RouterService from "../../Services/router.service";
import {ILocation, INavigationHook} from "../../interfaces";

interface Props {
    navigation: INavigationHook,
    location: ILocation,
    key: string,
    result: ISearchResult
}

interface ISearchResult {
    code: string
    highlight: IHighlight,
    text: string
}

interface IHighlight {
    text: string,
    synonyms: string[],
    inclusions: string[]
}

/**
 * Handle the search result and check the text for any flags
 */
class SearchResult extends Component<Props, ISearchResult> {

    /**
     * looks for change in the button selection and update the fetchresult
     */
    handleClick = () => {
        let navigate = this.props.navigation
        let location = this.props.location
        let path = location.pathname.split("/")
        
        if (path[2] === "MIGEL" || path[2] === "AL" || path[2] === "DRUG"){
            navigate({
                pathname: "/" + path[1] + "/" + path[2] + "/" + path[3] + "/" + this.props.result.code,
                search: RouterService.getQueryVariable('query') === "" ? "" : "?query=" + RouterService.getQueryVariable('query')
            })
        }
        else if(path[2] === "SwissDRG") {
            navigate({
                pathname: "/" + path[1] + "/" + path[2] + "/" + path[3] + "/drgs/" + this.props.result.code,
                search: RouterService.getQueryVariable('query') === "" ? "" : "?query=" + RouterService.getQueryVariable('query')
            })
        } else {
            navigate({
                pathname: "/" + path[1] + "/" + path[2] + "/" + path[3] + "/" + path[2].toLowerCase() + "s/" + this.props.result.code,
                search: RouterService.getQueryVariable('query') === "" ? "" : "?query=" + RouterService.getQueryVariable('query')
            })
        }
    }

    /**
     * takes a string and sends it to the backend to get all the synonyms of it
     * @returns synonyms a list of synonyms
     */
    getSynonyms() {
        let synonyms;
        if(this.props.result.highlight.synonyms === undefined || this.props.result.highlight.text !== undefined) {
            synonyms = <></>
        } else {
            synonyms = <div className="small">Synonyme<ul>
                {this.props.result.highlight.synonyms.map(function(synonym, i) {
                    return <li key={"synonym_" + i} dangerouslySetInnerHTML={{__html: synonym.replace(/(<em>)/g, "<strong>").replace(/(<\/em>)/g, "</strong>")}}/>
                })}
            </ul></div>
        }
        return synonyms
    }

    /**
     * takes a string and sends it to the backend to get all the inclusions
     * @returns inclusions a list of inclusions
     */
    getInclusions() {
        let inclusions;
        if(this.props.result.highlight.inclusions === undefined || this.props.result.highlight.text !== undefined) {
            inclusions = <></>
        } else {
            inclusions = <div className="small">Inklusionen<ul>
                {this.props.result.highlight.inclusions.map(function(inclusion, i) {
                    return <li key={"inclusion_" + i} dangerouslySetInnerHTML={{__html: inclusion.replace(/(<em>)/g, "<strong>").replace(/(<\/em>)/g, "</strong>")}}/>
                })}
            </ul></div>
        }
        return inclusions
    }

    /**
     * render the search results
     * @returns {JSX.Element}
     */
    render() {
        return (
            <div key={"searchresults"} className="searchResult" onClick={this.handleClick}>
                <dl>
                    <dt><span className="link">{this.props.result.code}</span></dt>
                    <dd id="noMargin" dangerouslySetInnerHTML={{__html: this.props.result.highlight.text === undefined ? this.props.result.text : this.props.result.highlight.text[0].replace(/(<em>)/g, "<strong>").replace(/(<\/em>)/g, "</strong>")}}/>
                </dl>
                {this.getInclusions()}
                {this.getSynonyms()}
            </div>
        )
    }
}

function addProps(Component) {
    return props => <Component {...props} navigation={useNavigate()} location={useLocation()} key={"searchresults_default"}/>;
}

export default addProps(SearchResult);
