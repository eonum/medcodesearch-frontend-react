import React, {useEffect} from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { IRcgAttributes } from "../../interfaces";
import './Attributes.css';

interface Props {
    attributes: IRcgAttributes
}

/**
 * Returns the rcg specific attributes.
 * */
const RcgAttributes: React.FC<Props> = ({ attributes }) => {
    const params = useParams();
    const { t, i18n } = useTranslation();
    // Make translation language aware.
    useEffect(() => {
        i18n.changeLanguage(params.language);
    }, [params.language]);
    const {code, version, phases} = attributes;

    const getOnlineManualLink = (code: string, version: string) => {
        const baseLink = 'https://manual.swissdrg.org/'
        // TODO: add version mapping instead of just usin 'r2.3'
        const versionMapping = {
            'REHA_1.0': 's1.4', 'REHA_2.0': 'r2.3', 'REHA_3.0': 'r3.3'
        }
        return `${baseLink}${params.language}/${versionMapping[version]}/rcgs/${code}`;
    }

    const onlineManualLink = version ? getOnlineManualLink(code, version) : '';

    return (
        <>
            <div className="row vertical-spacer">
                <div className="col-lg-12">
                    <a href={onlineManualLink}
                       target='online_manual'
                       className="btn btn-outline-secondary me-1"
                       id={"rcgOnlineManualLink"}>
                        {t('LBL_LINK_TO_SWISSDRG_MANUAL')}
                    </a>
                </div>
            </div>
            {phases && <div className="row vertical-spacer">
                {(phases.length == 0 || phases == null) ?
                    <div className="col-lg-12">
                        {t('LBL_NO_COST_WEIGHT')}
                    </div> :
                    <div className="col-lg-6">
                        <div className="table-responsive">
                            <table className="table table-striped table-hover" id={"attributesTable"}>
                                <thead>
                                <tr>
                                    <th colSpan={2}>{t('LBL_RCG_CATALOGUE')}</th>
                                </tr>
                                </thead>
                                {phases.length == 1 ?
                                    <tbody>
                                    <tr>
                                        <td><b>{t('LBL_NUM_PHASES')}</b></td>
                                        <td>{1}</td>
                                    </tr>
                                    <tr>
                                        <td><b>{t('LBL_DAILY_PHASE_COSTS') + ' 1'}</b></td>
                                        <td>{phases[0].cost_weight.toFixed(3)}</td>
                                    </tr>
                                    </tbody> :
                                    <tbody>
                                    <tr>
                                        <td><b>{t('LBL_NUM_PHASES')}</b></td>
                                        <td>{phases.length}</td>
                                    </tr>
                                    {phases.map((phase, i) => (
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
};

export default RcgAttributes;

