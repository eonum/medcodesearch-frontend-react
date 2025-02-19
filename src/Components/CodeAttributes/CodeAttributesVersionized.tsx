import React, {useEffect} from "react";
import { useNavigate } from "react-router-dom";
import {useTranslation} from "react-i18next";
import {
    IAttributes,
    ISupplementsAttributes,
    IRcgAttributes,
    INavigationHook,
    IShortEntry,
    IDrgAttributes
} from "../../interfaces";
import {commonCodeInfos, versionsWithoutMappingInfos} from "../../Utils";
import ClickableCodesArray from "./ClickableCodesArray";
import DrgAttributes from "./DrgAttributes"
import RcgAttributes from "./RcgAttributes";
import SupplementsAttributes from "./SupplementsAttributes";

interface Props {
    attributes: IAttributes,
    catalog: string,
    version: string,
    siblings: IShortEntry[],
    language: string,
    resourceType: string
}

/**
 * Renders the attributes of a code for catalogs with versions (i.e. ICD, CHOP, DRG, TARMED, TARDOC, ...).
 */
const CodeAttributesVersionized: React.FC<Props> = ({
                                                        attributes,
                                                        catalog,
                                                        version,
                                                        siblings,
                                                        language,
                                                        resourceType
                                                    }) => {
    const navigate = useNavigate();
    const { t, i18n } = useTranslation();
    // Make translation language aware.
    useEffect(() => {
        i18n.changeLanguage(language);
    }, [language]);

    const renderSwitch = (resourceType: string, codeInfos: any) => {
        switch (resourceType) {
            case 'drgs':
                return <DrgAttributes attributes={attributes as IDrgAttributes}/>
            case 'supplements':
                return <SupplementsAttributes attributes={attributes as ISupplementsAttributes}/>
            case 'rcgs':
                return <RcgAttributes attributes={attributes as IRcgAttributes}/>
            default:
                return codeInfos;
        }
    };

    const { noCodeError, codeInfos } = commonCodeInfos(attributes, t, true, navigate);

    if (noCodeError) {
        return <div>{t("LBL_NO_CODE_VERSIONIZED")}</div>;
    }

    // Define mapping fields for predecessor & new code code info.
    const mappingFields = ['predecessors', 'successors'];
    const showNewCodeInfo = ['CHOP', 'ICD'].includes(catalog) &&
        !versionsWithoutMappingInfos.includes(version) &&
        attributes.predecessors &&
        attributes.predecessors.length == 0 &&
        !attributes['children'];

    return (
            <>
                {// Render enabled attributes (can be lists, date and strings, ...).
                    renderSwitch(resourceType, codeInfos)
                }
                {// Add mapping information (predecessor / successor information.
                    mappingFields.map((field, j) => (
                        attributes[field] != null &&
                        (attributes[field].length > 1 ||
                            attributes[field].length == 1 && (
                                (attributes[field][0]['code'] != attributes['code'] ||
                                    attributes[field][0]['text'] != attributes['text']))) &&
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
                {attributes.children &&
                    <ClickableCodesArray
                        codesArray={attributes.children}
                        codesType={'children'}
                        language={language}
                        catalog={catalog}
                    />}
                {siblings.length > 0 && !attributes.children && (
                    <ClickableCodesArray
                        codesArray={siblings}
                        codesType={'siblings'}
                        language={language}
                        catalog={catalog}
                        id={"siblings"}
                    />
                )}
            </>
    );
};

export default CodeAttributesVersionized;