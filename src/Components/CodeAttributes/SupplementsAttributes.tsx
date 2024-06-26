import React, {Component} from "react";
import {ISupplementsAttributes, IParamTypes, INavigationHook} from "../../interfaces";
import {useParams, useNavigate} from "react-router-dom";
import {useTranslation} from "react-i18next";
import ClickableCodesArray from "./ClickableCodesArray";

interface Props {
    attributes: ISupplementsAttributes
    translation: any
    params: IParamTypes
    navigation: INavigationHook
}

/**
 * Returns a unordered list of clickable codes (used for children or sibling, i.e. similar codes).
 * */
class SupplementsAttributes extends Component<Props> {
    /**
     * Render the Supplements code attributes.
     * @returns {JSX.Element}
     */

    renderRelevantCodes(codes) {
        const zeType = this.props.attributes.ze_type;
        return (zeType == "C" ?
            <ClickableCodesArray
                codesArray={codes}
                codesType={'REL_CODES_SUPPLEMENTS'}
                language={this.props.params.language}
                catalog={'CHOP'}
                id={'relevantChopCodes'}
            /> : this.renderCodesArray(codes, "LBL_REL_CODES_SUPPLEMENTS", "C", 'relevantCodes')
        )
    }

    renderClickableCodesArray(codes, catalog, codesType) {
        return <ClickableCodesArray
            codesArray={codes}
            codesType={codesType}
            language={this.props.params.language}
            catalog={catalog}
            id={codesType}
        />
    };

    transformRelevantCodesTitle(title, zeType) {
        let transformedTitle = title
        if (zeType == 'C') {
            return (transformedTitle += " (CHOP)")
        }
        if (zeType == 'A') {
            return (transformedTitle += " (ATC)")
        } else {
            return transformedTitle
        }
    }

    renderCodesArray(codes, title, codeType, id) {
        const {t} = this.props.translation;
        return (
            <div id={id}>
                <h5>{this.transformRelevantCodesTitle(t(title), codeType)}</h5>
                <ul>
                    {codes.map((c) => (
                        <li>{c.code + (c.text ? ": " + c.text : "")}</li>
                    ))}
                </ul>
            </div>
        )}


    tableRow(key, value) {
        const {t} = this.props.translation;
        return (<tr key={key + "_" + value}>
            <td><b>{t('LBL_' + key.toUpperCase())}</b></td>
            <td>{value}</td>
        </tr>)
    }

    dosageInfo(attributes) {
        const {t} = this.props.translation;
        return (
            <>
                <tr>
                    <td><b>{t('LBL_DOSE_MIN')}</b></td>
                    <td>{attributes.dose_min + attributes.dose_unit}</td>
                </tr>
                {attributes.dose_max > 0 &&
                    <tr>
                        <td><b>{t('LBL_DOSE_MAX')}</b></td>
                        <td>{attributes.dose_max + attributes.dose_unit}</td>
                    </tr>}
            </>

        )
    }

    // TODO: Render clickable codes array as soon as linking into codes from different catalogs is properly implemented.
    render() {
        const attributes = this.props.attributes;
        const {t} = this.props.translation;
        const {terminal} = attributes
        return (
            // If not terminal, there is only text info which is rendered in parent component.
            terminal &&
            <div className="row vertical-spacer">
                <div className="col-lg-6">
                    <div className="table-responsive">
                        <table className="table table-striped table-hover" id={'attributesTable'}>
                            <thead>
                            <tr>
                                <th colSpan={2}>{t('LBL_SUPPLEMENTS_CATALOG')}</th>
                            </tr>
                            </thead>
                            <tbody>
                            {(() => {
                                return Object.keys(attributes).map((key) => {
                                    let value = attributes[key];
                                    switch (key) {
                                        case "age_higher_than":
                                        case "age_lower_than":
                                            return value > 0 ? this.tableRow(key, value) : null;
                                        case 'dosage':
                                            return value != 0.0 ? this.dosageInfo(attributes) : null;
                                        case 'za':
                                        case 'va':
                                            return value ? this.tableRow(key, value) : null;
                                        case "amount":
                                            return this.tableRow(key, value)
                                    }
                                })
                            })()}
                            </tbody>
                        </table>
                    </div>
                </div>
                {attributes.relevant_codes && attributes.relevant_codes.length > 0 && attributes.relevant_codes[0].code &&
                    this.renderCodesArray(
                        attributes.relevant_codes,
                        'LBL_REL_CODES_SUPPLEMENTS',
                        this.props.attributes.ze_type,
                        "RELEVANT_CODES")}
                {attributes.excluded_drgs && attributes.excluded_drgs.length > 0 &&
                    this.renderCodesArray(
                        attributes.excluded_drgs,
                        'LBL_EXCLUDED_DRGS',
                        null,
                        'EXCLUDED_DRGS')}
                {attributes.constraint_icds && attributes.constraint_icds.length > 0 &&
                    this.renderCodesArray(
                        attributes.constraint_icds,
                        'LBL_CONSTRAINT_ICDS',
                        null,
                        'CONSTRAINT_ICDS')}
                {attributes.constraint_chops && attributes.constraint_chops.length > 0 &&
                    this.renderCodesArray(
                        attributes.constraint_chops,
                        'LBL_CONSTRAINT_CHOPS',
                        null,
                        'CONSTRAINT_CHOPS')}
            </div>
        )
    }
}

function addProps(Component) {
    return props => <Component {...props} params={useParams()} translation={useTranslation()} navigation={useNavigate()} />;
}

export default addProps(SupplementsAttributes);

