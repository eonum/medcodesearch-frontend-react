import React from "react";
import {useNavigate} from "react-router-dom";
import {getNavParams} from "../../Utils";
import {useTranslation} from "react-i18next";

interface Props {
    codesArray: any,
    codesType: string,
    language: string,
    catalog: string,
    resourceType?: string,
    id?: string,
}

/**
 * Returns an unordered list of clickable codes (used for children or sibling, i.e. similar codes).
 * */
const ClickableCodesArray: React.FC<Props> = ({
                                                  codesArray,
                                                  codesType,
                                                  language,
                                                  catalog,
                                                  resourceType,
                                                  id
                                              }) => {
    const navigate = useNavigate();
    const { t } = useTranslation();

    const getTriggeringCodes = (shortEntries: any[])=> {
        if (shortEntries && catalog == 'Supplements') {
            return shortEntries[0].triggering_code ? shortEntries.map((c) => c.triggering_code) : undefined
        } else {
            return undefined
        }
    }

    const triggeringCodes = getTriggeringCodes(codesArray);

    return (
        <div key={codesType} id={id}>
            <h5>{t("LBL_" + codesType.toUpperCase())}</h5>
            <ul>
                {codesArray.map((currElement: any, j: number) => (
                    <li key={j}>
                        <a
                            key={codesType + "_" + j}
                            className="link"
                            onClick={() => {
                                const {pathname, searchString} = getNavParams(currElement, language, catalog, resourceType);
                                if (catalog !== 'DRUG') {
                                    navigate({pathname: pathname, search: searchString});
                                }
                            }}
                        >
                            {currElement.code + (triggeringCodes ? " (" + triggeringCodes[j] + ")" : "") + ": "}
                        </a>
                        <span
                            key={"code_text"}
                            dangerouslySetInnerHTML={{__html: currElement.text}}
                        />
                    </li>
                ))}
            </ul>
        </div>
    );
};


export default ClickableCodesArray;

