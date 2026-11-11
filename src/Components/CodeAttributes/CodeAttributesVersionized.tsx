import React from "react";
import {IAttributes, IShortEntry} from "../../interfaces";
import {commonCodeInfos, versionsWithoutMappingInfos} from "../../Utils";
import {useNavigate} from "react-router-dom";
import ClickableCodesArray from "./ClickableCodesArray";
import DrgAttributes from "./DrgAttributes"
import RcgAttributes from "./RcgAttributes";
import {useTranslation} from "react-i18next";
import SupplementsAttributes from "./SupplementsAttributes";
import LkaatAttributes from "./LkaatAttributes";

interface Props {
    attributes: IAttributes,
    catalog: string,
    version: string,
    siblings: IShortEntry[],
    language: string,
    resourceType: string
}

/**
 * Responsible for the attributes of a code, for catalogs with versions (i.e. ICD, CHOP, DRG, TARMED, TARDOC).
 */
function CodeAttributesVersionized({ attributes, catalog, version, siblings, language, resourceType }: Props) {
    const navigate = useNavigate();
    const { t } = useTranslation();

    function renderSwitch(rt, codeInfos) {
        switch(rt) {
            case 'drgs':
                return <DrgAttributes attributes={attributes as any} />
            case 'supplements':
                return <SupplementsAttributes attributes={attributes as any} />
            case 'rcgs':
                return <RcgAttributes attributes={attributes as any} />
            case 'service_catalogs':
                return <LkaatAttributes attributes={attributes} />
            default:
                return codeInfos;
        }
    }

    let children = attributes.children;
    const { noCodeError, codeInfos } = commonCodeInfos(attributes, t, true, navigate)
    // Define mapping fields for predecessor & new code code info.
    let mappingFields = ['predecessors', 'successors'];
    let showNewCodeInfo = ['CHOP', 'ICD'].includes(catalog) &&
        !versionsWithoutMappingInfos.includes(version) &&
        attributes.predecessors &&
        attributes.predecessors.length === 0 &&
        !attributes['children']

    return (
        noCodeError ?
            <div>{t("LBL_NO_CODE_VERSIONIZED")}</div> :
            <>
                {// Render enabled attributes (they can be lists, date and strings.
                    renderSwitch(resourceType, codeInfos)
                }
                {// Add mapping information (predecessor / successor information.
                    mappingFields.map((field, j) => (
                        attributes[field] != null &&
                        (attributes[field].length > 1 ||
                            attributes[field].length === 1 && (
                                (attributes[field][0]['code'] !== attributes['code'] ||
                                    attributes[field][0]['text'] !== attributes['text']))) &&
                        <div key={"mapping_pre_succ" + j}>
                            <h5>{t("LBL_" + field.toUpperCase())}</h5>
                            <ul>
                                {attributes[field].map((child, i) => (
                                    <li key={child + "_" + i}><b>{child.code}</b>{" " + child.text}</li>
                                ))}
                            </ul>
                        </div>
                    ))}
                {// Add new code information.
                    showNewCodeInfo &&
                    <div className="vertical-spacer alert alert-warning">
                        <h5>{t("LBL_NEW_CODE")}</h5>
                    </div>
                }
                {children &&
                    <ClickableCodesArray
                        codesArray={children}
                        codesType={'children'}
                        language={language}
                        catalog={catalog}
                    />}
                {siblings.length > 0 && !children &&
                    <ClickableCodesArray
                        codesArray={siblings}
                        codesType={'siblings'}
                        language={language}
                        catalog={catalog}
                        id={"siblings"}
                    />}
            </>
    );
}

export default CodeAttributesVersionized;
