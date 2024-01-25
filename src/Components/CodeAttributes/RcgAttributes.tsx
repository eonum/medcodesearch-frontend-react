import React, {Component} from "react";
import {IRcgAttributes, IParamTypes} from "../../interfaces";
import {useParams} from "react-router-dom";
import {useTranslation} from "react-i18next";

interface Props {
    attributes: IRcgAttributes
    translation: any
    params: IParamTypes
}

/**
 * Returns a unordered list of clickable codes (used for children or sibling, i.e. similar codes).
 * */
class RcgAttributes extends Component<Props> {
    /**
     * Render the RCG code component
     * @returns {JSX.Element}
     */

    onlineManualLink(code, version) {
        const {language} = this.props.params
        const baseLink = 'https://manual.swissdrg.org/'
        // TODO: add version mapping instead of just usin 'r2.3'
        return baseLink + language + '/r2.3/rcgs/' + code
    }

    render() {
        const attributes = this.props.attributes;
        const {t} = this.props.translation;
        const {code, version} = attributes
        const versionToNumber = version ? Number(version.replace("V", "")) : 0
        const onlineManualLink = version ? this.onlineManualLink(code, version) : '';
        return (
            <>
                <div className="row vertical-spacer">
                    <div className="col-lg-12">
                        {versionToNumber >= 10 &&
                            <a href={onlineManualLink} target='online_manual'
                               className="btn btn-outline-secondary me-1">
                                {t('LBL_LINK_TO_SWISSDRG_MANUAL')}
                            </a>
                        }
                    </div>
                </div>
                {attributes.phases && <div className="row vertical-spacer">
                    {(attributes.phases.length == 0 || attributes.phases == null) ?
                        <div className="col-lg-12">
                            {t('LBL_NO_COST_WEIGHT')}
                        </div> :
                        <div className="col-lg-6">
                            <div className="table-responsive">
                                <table className="table table-striped table-hover table-bordered">
                                    <thead>
                                    <tr>
                                        <th colSpan={2}>{t('LBL_RCG_CATALOGUE')}</th>
                                    </tr>
                                    </thead>
                                    {attributes.phases.length == 1 ?
                                        <tbody>
                                        <tr>
                                            <td><b>{t('LBL_NUM_PHASES')}</b></td>
                                            <td>{1}</td>
                                        </tr>
                                        <tr>
                                            <td><b>{t('LBL_DAILY_PHASE_COSTS') + ' 1'}</b></td>
                                            <td>{attributes.phases[0].cost_weight.toFixed(3)}</td>
                                        </tr>
                                        </tbody> :
                                        <tbody>
                                        <tr>
                                            <td><b>{t('LBL_NUM_PHASES')}</b></td>
                                            <td>{attributes.phases.length}</td>
                                        </tr>
                                        {attributes.phases.map((phase, i) => (
                                            <>
                                            <tr>
                                                <td><b>{t('LBL_DAILY_PHASE_COSTS') + ' ' + (i + 1)}</b></td>
                                                <td>{phase.cost_weight.toFixed(3)}</td>
                                            </tr>
                                            {phase.limit != 0 &&
                                            <tr>
                                            <td><b>{t('LBL_UPPER_PHASE_LIMIT') + ' ' + (i + 1)}</b></td>
                                        <td>{phase.limit}</td>
                                            </tr>}
                                            </>
                            ))}
                        </tbody>
                    }
                </table>
                            </div>
                        </div>
                    }
                </div>}
            </>

        )
    }
}

function addProps(Component) {
    return props => <Component {...props} params={useParams()} translation={useTranslation()}/>;
}

export default addProps(RcgAttributes);

