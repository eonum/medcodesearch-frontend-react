import React, {useEffect} from "react";
import './SearchResult.css';
import {useNavigate, useLocation} from "react-router-dom";
import {RouterService} from "../../Services/router.service";
import {useTranslation} from "react-i18next";

interface ISearchResult {
    code: string
    highlight: IHighlight,
    text: string
}

interface IHighlight {
    text: string[],
    synonyms: string[],
    inclusions: string[]
}

interface Props {
    result: ISearchResult,
    language: string,
    toggleCollapse: () => void;
}

/**
 * Handle the search result and check the text for any flags
 */
const SearchResult: React.FC<Props> = ({ result, language, toggleCollapse }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const { t, i18n } = useTranslation();
    // Make translation language aware.
    useEffect(() => {
        i18n.changeLanguage(language);
    }, [language]);

    /**
     * Handles change in the button selection and updates the fetchresult.
     */
    const handleClick = () => {
        const path = location.pathname.split("/")

        let pathname;
        if (path[2] === "MIGEL" || path[2] === "AL" || path[2] === "DRUG") {
            pathname = `/${path[1]}/${path[2]}/${path[3]}/${result.code}`;
        } else if (path[2] === "SwissDRG") {
            pathname = `/${path[1]}/${path[2]}/${path[3]}/drgs/${result.code}`;
        } else if (path[2] === "Reha") {
            pathname = `/${path[1]}/${path[2]}/${path[3]}/rcgs/${result.code}`;
        } else if (path[2] === "AmbGroup") {
            pathname = `/${path[1]}/${path[2]}/${path[3]}/amb_groups/${result.code}`;
        } else if (path[2] === "Supplements") {
            pathname = `/${path[1]}/${path[2]}/${path[3]}/supplements/${result.code}`;
        } else {
            pathname = `/${path[1]}/${path[2]}/${path[3]}/${path[2].toLowerCase()}s/${result.code}`;
        }

        navigate({
            pathname: pathname,
            search: RouterService.getParamValue('query') === "" ? "" : "?query=" + RouterService.getParamValue('query')
        })
        // Call the showHide function.
        toggleCollapse();
    }

    const collectSearchHighlights = () => {
        let text = result.text;
        const highlight = result.highlight;

        if (highlight != null) {
            const highlightText = highlight['text'];
            if (highlightText) {
                highlightText.forEach(textItem => {
                    const text_original = textItem.replace(/<em>/g, '').replace(/<\/em>/g, '');
                    text = text.replace(text_original, textItem);
                });
            } else {
                const alternative_fields = Object.keys(highlight);
                alternative_fields.forEach(field => {
                    if (field === 'code') return;

                    if (highlight[field]) {
                        text += `<div class="alternative_search_highlight"><strong>${t("LBL_" + field.toUpperCase())}: </strong>`;
                        highlight[field].forEach(item => {
                            text += `${item}<br/>`;
                        });
                        text += '</div>';
                    }
                });
            }
        }
        return text
    }

    return (
        <div className="searchResult" onClick={handleClick}>
            <dl>
                <dt><span className="link">{result.code}</span></dt>
                <dd id="noMargin" dangerouslySetInnerHTML={{__html: collectSearchHighlights()}}/>
            </dl>
        </div>
    );
}

export default SearchResult;
