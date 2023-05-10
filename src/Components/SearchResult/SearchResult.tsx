import React from "react";
import './SearchResult.css';
import {useNavigate, useLocation} from "react-router-dom";
import RouterService from "../../Services/router.service";
import {useTranslation} from "react-i18next";

interface Props {
    result: ISearchResult,
    language: string,
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
const SearchResult: React.FunctionComponent<Props> = props =>  {
    const navigate = useNavigate();
    const location = useLocation();
    const {t} = useTranslation();
    /**
     * looks for change in the button selection and updates the fetchresult.
     */
    function handleClick() {
        let path = location.pathname.split("/")
        let pathname;
        if (path[2] === "MIGEL" || path[2] === "AL" || path[2] === "DRUG") {
            pathname = "/" + path[1] + "/" + path[2] + "/" + path[3] + "/" + props.result.code
        } else if (path[2] === "SwissDRG") {
            pathname = "/" + path[1] + "/" + path[2] + "/" + path[3] + "/drgs/" + props.result.code
        } else if (path[2] === "AmbGroup") {
            pathname = "/" + path[1] + "/" + path[2] + "/" + path[3] + "/amb_groups/" + props.result.code
        } else {
            pathname = "/" + path[1] + "/" + path[2] + "/" + path[3] + "/" + path[2].toLowerCase() + "s/" + props.result.code
        }
        navigate({
            pathname: pathname,
            search: RouterService.getQueryVariable('query') === "" ? "" : "?query=" + RouterService.getQueryVariable('query')
        })
    }

    function collectSearchHighlights() {
        let text = props.result.text;
        let highlight = props.result.highlight;
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

    // Return the search results JSX.
    return (
        <div className="searchResult" onClick={handleClick}>
            <dl>
                <dt><span className="link">{props.result.code}</span></dt>
                <dd id="noMargin" dangerouslySetInnerHTML={{__html: collectSearchHighlights()}}/>
            </dl>
        </div>
    )
}
export default SearchResult;
