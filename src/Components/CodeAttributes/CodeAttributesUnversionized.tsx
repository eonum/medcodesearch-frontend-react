import React, {Component} from "react";
import {IAttributes, INavigationHook, IShortEntry} from "../../interfaces";
import {collectAttributesSl, commonCodeInfos} from "../../Utils";
import {useNavigate} from "react-router-dom";
import dateFormat from "dateformat";
import ClickableCodesArray from "./ClickableCodesArray";
import {useTranslation} from "react-i18next";

interface Props {
    attributes: IAttributes,
    catalog: string,
    siblings: IShortEntry[],
    language: string,
    resource_type: string,
    code: string,
    navigation: INavigationHook
    translation: any
}

/**
 * Responsible for the attributes of a code, for catalogs without versions (i.e. MiGeL, AL, Drugs).
 */
class CodeAttributesUnversionized extends Component<Props>{
    /**
     * Render the CodeAttributesUnversionized component
     * @returns {JSX.Element}
     */
    render() {
        const {t} = this.props.translation
        let attributes = this.props.attributes;
        let children = attributes.children;
        let siblings = this.props.siblings;
        let terminal = attributes.terminal;
        let slAttributes = collectAttributesSl(attributes, t)
        const { noCodeError, codeInfos } = commonCodeInfos(attributes, t, false, undefined)
        return (
            noCodeError ?
                <div>{t("LBL_NO_CODE")}</div> :
                <>
                    {// Render enabled attributes (they can be lists, date and strings.
                        codeInfos
                    }
                    {// Add last seeding date and valid from if terminal
                        terminal &&
                        ['updated_at', 'valid_from', 'valid_to'].map( attribute => (
                            <div key={attribute}>
                                <h5>{t("LBL_" + attribute.toUpperCase())}</h5>
                                <p> {dateFormat(new Date(attributes[attribute]), "dd.mm.yyyy")}</p>
                            </div>
                        ))
                    }
                    {// Add swissmedic number for drugs.
                        this.props.catalog === "DRUG" && this.props.code != 'all' &&
                        <div key={"swissmedic_nr"}>
                            <h5>{t("LBL_SWISSMEDIC_NR")}</h5>
                            <p> {attributes.auth_number + attributes.package_code} </p>
                        </div>
                    }
                    {this.props.catalog === "DRUG" && this.props.code != 'all' &&
                        <>
                            <h5>{t("LBL_SL_INFOS")}</h5>
                            {!attributes["is_currently_in_sl"] ?
                                    // Add SL deprecation warning.
                                    <div className="vertical-spacer alert alert-warning" key={"is_currently_in_sl"}>
                                        {t("LBL_REMOVED_FROM_SL")}
                                    </div> :
                                    // Add SL infos.
                                    <ul id={"SL_infos"}>
                                        {Object.keys(slAttributes).map(attributeName => (
                                            <li key={attributeName} id={"SL_" + attributeName}>
                                                {attributeName.match(/date/i) ?
                                                    <p>{t("LBL_" + attributeName.toUpperCase()) + ": "
                                                        + dateFormat(new Date(slAttributes[attributeName]), "dd.mm.yyyy")}
                                                    </p> :
                                                    <p>{t("LBL_" + attributeName.toUpperCase()) + ": "
                                                        + (typeof slAttributes[attributeName] === 'boolean' ?
                                                            t("LBL_" + slAttributes[attributeName]
                                                                .toString().toUpperCase()) :
                                                            slAttributes[attributeName])}
                                                    </p>
                                                }
                                            </li>
                                        ))}
                                    </ul>}
                        </>
                    }
                    {children &&
                        <ClickableCodesArray
                            codesArray={children}
                            codesType={'children'}
                            language={this.props.language}
                            catalog={this.props.catalog}
                            resource_type={this.props.resource_type}
                        />}
                    {siblings.length > 0 && !children &&
                        <ClickableCodesArray
                            codesArray={siblings}
                            codesType={'siblings'}
                            language={this.props.language}
                            catalog={this.props.catalog}
                            resource_type={this.props.resource_type}
                        />}
                </>
        );
    }
}

function addProps(Component) {
    return props => <Component {...props} navigation={useNavigate()} translation={useTranslation()}/>;
}

export default addProps(CodeAttributesUnversionized);

