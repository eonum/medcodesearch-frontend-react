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
    params: IParamTypes
}

/**
 * Returns a unordered list of clickable codes (used for children or sibling, i.e. similar codes).
 * */
class SupplementsAttributes extends Component<Props> {
    /**
     * Render the Supplements code attributes.
     * @returns {JSX.Element}
     */

    renderRelevantCodes(relevantCodes, zeType) {
        const {t} = this.props.translation
        return (zeType == "C" ?
            <ClickableCodesArray
                codesArray={relevantCodes}
                codesType={'REL_CODES_SUPPLEMENTS'}
                language={this.props.params.language}
                catalog={'CHOP'}
            /> :
            relevantCodes.map((el) =>
                (<>
                        <h5>{t("LBL_REL_CODES_SUPPLEMENTS")}</h5>
                        <p>{el.code}</p>
                    </>
                )))
    }

    renderCodesArray(codes, catalog, codesType) {
        return <ClickableCodesArray
            codesArray={codes}
            codesType={codesType}
            language={this.props.params.language}
            catalog={catalog}
        />
    };


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
                                <th colSpan={2}>{t('LBL_SUPPLEMENTS')}</th>
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
                {attributes.excluded_drgs && attributes.excluded_drgs.length > 0 &&
                    this.renderCodesArray(attributes.excluded_drgs, 'SwissDrg', 'EXCLUDED_DRGS')}
                {attributes.constraint_icds && attributes.constraint_icds.length > 0 &&
                    this.renderCodesArray(attributes.constraint_icds.length, 'ICD', 'CONSTRAINT_ICDS')}
                {attributes.constraint_chops && attributes.constraint_chops.length > 0 &&
                    this.renderCodesArray(attributes.constraint_chops, 'CHOP', 'CONSTRAINT_CHOPS')}
                {attributes.relevant_codes && attributes.relevant_codes.length > 0 && attributes.relevant_codes[0].code &&
                    this.renderRelevantCodes(attributes.relevant_codes, this.props.attributes.ze_type)}
            </div>
        )
    }
}

function addProps(Component) {
    return props => <Component {...props} params={useParams()} translation={useTranslation()} navigation={useNavigate()} />;
}

export default addProps(SupplementsAttributes);

