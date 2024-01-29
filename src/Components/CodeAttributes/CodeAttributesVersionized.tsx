import React, {Component} from "react";
import {IAttributes, INavigationHook, IShortEntry} from "../../interfaces";
import {commonCodeInfos, versionsWithoutMappingInfos} from "../../Utils";
import {useNavigate} from "react-router-dom";
import ClickableCodesArray from "./ClickableCodesArray";
import DrgAttributes from "./DrgAttributes"
import RcgAttributes from "./RcgAttributes";
import {useTranslation} from "react-i18next";
import SupplementsAttributes from "./SupplementsAttributes";

interface Props {
    attributes: IAttributes,
    catalog: string,
    version: string,
    siblings: IShortEntry[],
    language: string,
    navigation: INavigationHook,
    translation: any,
    resourceType: string
}

/**
 * Responsible for the attributes of a code, for catalogs with versions (i.e. ICD, CHOP, DRG, TARMED).
 */
class CodeAttributesVersionized extends Component<Props>{
    /**
     * Render the CodeAttributesVersionized component
     * @returns {JSX.Element}
     */

    renderSwitch(resourceType, codeInfos, terminal) {
        switch(resourceType) {
            case 'drgs':
                return <DrgAttributes
                    attributes={this.props.attributes}
                />
            case 'supplements':
                return <SupplementsAttributes
                    attributes={this.props.attributes}
                />
            case 'rcgs':
                return <RcgAttributes
                    attributes={this.props.attributes}
                />
            default:
                return codeInfos;
        }
    }

    render() {
        let attributes = this.props.attributes;
        let children = attributes.children;
        let siblings = this.props.siblings;
        const {t} = this.props.translation
        const { noCodeError, codeInfos } = commonCodeInfos(attributes, t, true,
            this.props.navigation)
        // Define mapping fields for predecessor & new code code info.
        let mappingFields = ['predecessors', 'successors'];
        let showNewCodeInfo = ['CHOP', 'ICD'].includes(this.props.catalog) &&
            !versionsWithoutMappingInfos.includes(this.props.version) &&
            attributes.predecessors &&
            attributes.predecessors.length == 0 &&
            !attributes['children']
        return (
            noCodeError ?
                <div>{t("LBL_NO_CODE_VERSIONIZED")}</div> :
                <>
                    {// Render enabled attributes (they can be lists, date and strings.
                        this.renderSwitch(this.props.resourceType, codeInfos)
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
                    {children &&
                        <ClickableCodesArray
                            codesArray={children}
                            codesType={'children'}
                            language={this.props.language}
                            catalog={this.props.catalog}
                        />}
                    {siblings.length > 0 && !children &&
                        <ClickableCodesArray
                            codesArray={siblings}
                            codesType={'siblings'}
                            language={this.props.language}
                            catalog={this.props.catalog}
                        />}
                </>
        );
    }
}

function addProps(Component) {
    return props => <Component {...props} navigation={useNavigate()} translation={useTranslation()} />;
}

export default addProps(CodeAttributesVersionized);

