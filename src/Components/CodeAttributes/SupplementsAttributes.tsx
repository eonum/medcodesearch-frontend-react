import React, {Component} from "react";
import {ISupplementsAttributes, IParamTypes, INavigationHook} from "../../interfaces";
import {useParams, useNavigate} from "react-router-dom";
import {useTranslation} from "react-i18next";
import {getNavParams} from "../../Utils";
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
                    catalog={'Chop'}
                /> :
                relevantCodes.map((el) =>
                    (<>        <h5>{t("LBL_REL_CODES_SUPPLEMENTS")}</h5>
                            <p>{el.code}</p>
                        </>
                    )))
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
                        <table className="table table-striped table-hover table-bordered">
                            <thead>
                            <tr>
                                <th colSpan={2}>{t('LBL_SUPPLEMENTS')}</th>
                            </tr>
                            </thead>
                            <tbody>
                            {Object.keys(attributes).map((key) => (
                                (typeof attributes[key] != 'object' &&
                                    (attributes[key] && attributes[key].length > 0 ||
                                    typeof attributes[key] == 'number' && !isNaN(attributes[key]) ||
                                    typeof attributes[key] == 'boolean')) &&
                                <tr>
                                    <td><b>{t('LBL_' + key.toUpperCase())}</b></td>
                                    <td>{attributes[key]}</td>
                                </tr>
                            ))
                            }
                            </tbody>
                        </table>
                    </div>
                </div>
                {attributes.relevant_codes.length > 0 && attributes.relevant_codes[0].code &&
                    this.renderRelevantCodes(attributes.relevant_codes, this.props.attributes.ze_type)}
            </div>
        )
    }
}

function addProps(Component) {
    return props => <Component {...props} params={useParams()} translation={useTranslation()} navigation={useNavigate()} />;
}

export default addProps(SupplementsAttributes);

