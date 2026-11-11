import React from "react";
import {useNavigate} from "react-router-dom";
import {getNavParams} from "../../Utils";
import {useTranslation} from "react-i18next";

interface Props {
    codesArray: any,
    codesType: string,
    language: string,
    catalog: string,
    resource_type?: string,
    id?: string,
}

/**
 * Returns a unordered list of clickable codes (used for children or sibling, i.e. similar codes).
 * */
function ClickableCodesArray({ codesArray, codesType, language, catalog, resource_type, id }: Props) {
    const navigate = useNavigate();
    const { t } = useTranslation();

    function triggeringCodes(shortEntries) {
        if (shortEntries && catalog === 'Supplements') {
            return shortEntries[0].triggering_code ? shortEntries.map((c) => c.triggering_code) : undefined
        } else {
            return undefined
        }
    }

    const trigCodes = triggeringCodes(codesArray)

    return (
        <div key={codesType} id={id}>
            <h5>{t("LBL_" + codesType.toUpperCase())}</h5>
            <ul>
                {codesArray.map((currElement, j) => (
                    <li key={j}>
                        <a key={codesType + "_" + j} className="link" onClick={() => {
                            let {pathname, searchString} = getNavParams(currElement, language, catalog, resource_type)
                            if (catalog != 'DRUG') {
                                navigate({pathname: pathname, search: searchString})
                            }
                        }}>
                            {currElement.code + (trigCodes ? " (" + trigCodes[j] + ")" : "") + ": "}
                        </a>
                        <span key={"code_text"} dangerouslySetInnerHTML={{__html: currElement.text}}/>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default ClickableCodesArray;
