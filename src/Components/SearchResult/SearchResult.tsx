import React, {Component} from "react";
import './SearchResult.css';
import {useNavigate, useLocation} from "react-router-dom";
import RouterService from "../../Services/router.service";
import {ILocation, INavigationHook} from "../../interfaces";
import {useTranslation} from "react-i18next";

interface Props {
    navigation: INavigationHook,
    location: ILocation,
    result: ISearchResult,
    language: string,
    translation: any
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
     * looks for change in the button selection and updates the fetchresult.
     */
    handleClick = () => {
        let navigate = this.props.navigation
        let location = this.props.location
        let path = location.pathname.split("/")

        let pathname;
        if (path[2] === "MIGEL" || path[2] === "AL" || path[2] === "DRUG") {
            pathname = "/" + path[1] + "/" + path[2] + "/" + path[3] + "/" + this.props.result.code
        } else if (path[2] === "SwissDRG") {
            pathname = "/" + path[1] + "/" + path[2] + "/" + path[3] + "/drgs/" + this.props.result.code
        } else if (path[2] === "STReha") {
            pathname = "/" + path[1] + "/" + path[2] + "/" + path[3] + "/rcgs/" + this.props.result.code
        } else if (path[2] === "AmbGroup") {
            pathname = "/" + path[1] + "/" + path[2] + "/" + path[3] + "/amb_groups/" + this.props.result.code
        } else {
            pathname = "/" + path[1] + "/" + path[2] + "/" + path[3] + "/" + path[2].toLowerCase() + "s/" + this.props.result.code
        }
        navigate({
            pathname: pathname,
            search: RouterService.getQueryVariable('query') === "" ? "" : "?query=" + RouterService.getQueryVariable('query')
        })
    }

    collectSearchHighlights() {
        const {t} = this.props.translation
        let text = this.props.result.text;
        let highlight = this.props.result.highlight;
        if (highlight != null) {
            let highlight_text = highlight['text'];
            if (highlight_text) {
                for (var i = 0; i < highlight_text.length; i++) {
                    let text_original = highlight_text[i].replace(/<em>/g, '').replace(/<\/em>/g, '');
                    text = text.replace(text_original, highlight_text[i]);
                }
            } else {
                let alternative_fields = Object.keys(highlight);
                for (var i = 0; i < alternative_fields.length; i++) {
                    var field = alternative_fields[i];
                    if (field == 'code') { continue; }
                    if (highlight[field]) {
                        text += '<div class="alternative_search_highlight"><strong>' + t("LBL_" + field.toUpperCase()) + ': </strong>';
                        for (var j = 0; j < highlight[field].length; j++) {
                            text += highlight[field][j] + '<br/>';
                        }
                        text += '</div>';
                    }
                }
            }
        }
        return text
    }

    /**
     * render the search results
     * @returns {JSX.Element}
     */
    render() {
        return (
            <div className="searchResult" onClick={this.handleClick}>
                <dl>
                    <dt><span className="link">{this.props.result.code}</span></dt>
                    <dd id="noMargin" dangerouslySetInnerHTML={{__html: this.collectSearchHighlights()}}/>
                </dl>
            </div>
        )
    }
}

function addProps(Component) {
    return props => <Component {...props} navigation={useNavigate()} location={useLocation()} translation={useTranslation()}/>;
}
export default addProps(SearchResult);
