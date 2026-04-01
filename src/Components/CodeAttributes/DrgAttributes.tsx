import './Attributes.css';
import React from "react";
import {IDrgAttributes} from "../../interfaces";
import {useParams} from "react-router-dom";
import {useTranslation} from "react-i18next";

interface Props {
    attributes: IDrgAttributes
}

/**
 * Returns a unordered list of clickable codes (used for children or sibling, i.e. similar codes).
 * */
function DrgAttributes({ attributes }: Props) {
    const { language } = useParams();
    const { t } = useTranslation();

    function onlineManualLink(code, version) {
        const baseLink = 'https://manual.swissdrg.org/'
        return baseLink + language + '/' + version.replace("V","").replace("0", "3") + '/' + 'drgs/' + code
    }

    function drgDynamicsLink(code, version) {
        return "https://drgdynamics.eonum.ch/drgs/name?code=" + code + '&version=' + version + '&locale=' + language;
    }

    const {code, version} = attributes
    const versionToNumber = version ? Number(version.replace("V","")) : 0
    const manualLink = version ? onlineManualLink(code, version) : '';
    const dynamicsLink = version ? drgDynamicsLink(code, version) : '';

    return (
        <>
            <div className="row">
                <div className="col-lg-12">
                    {versionToNumber >= 10 &&
                        <a href={manualLink} target='online_manual'
                           className="btn btn-outline-secondary me-1 external-link-button" id={"drgOnlineManualLink"}>
                            {t('LBL_LINK_TO_SWISSDRG_MANUAL')}
                        </a>
                    }
                </div>
                <div className="col-lg-12">
                    <a href={dynamicsLink} target='drgdynamics' className="btn btn-outline-secondary external-link-button"
                       id={"drgDynamicsLink"}>
                        {t('LBL_LINK_TO_DRGDYNAMICS')}
                    </a>
                </div>
            </div>
            <div className="row vertical-spacer">
                { (attributes.cost_weight === 0 || attributes.cost_weight === null) ?
                    <div className="col-lg-12">
                        {t('LBL_NO_COST_WEIGHT')}
                    </div> :
                    <div className="col-lg-6">
                        <div className="table-responsive">
                            <table className="table table-striped table-hover" id={'attributesTable'}>
                                <thead>
                                <tr>
                                    <th colSpan={2}>{t('LBL_DRG_CATALOGUE')}</th>
                                </tr>
                                </thead>
                                <tbody>
                                <tr>
                                    <td><b>{t('LBL_PARTITION_LETTER')}</b></td>
                                    <td>{attributes.partition_letter}</td>
                                </tr>
                                <tr>
                                    <td><b>{t('LBL_COST_WEIGHT')}</b></td>
                                    <td>{attributes.cost_weight?.toFixed(3)}</td>
                                </tr>
                                <tr>
                                    <td><b>{t('LBL_AVERAGE_STAY_DURATION')}</b></td>
                                    <td>{attributes.average_stay_duration?.toFixed(1)}</td>
                                </tr>
                                <tr>
                                    <td><b>{t('LBL_FIRST_DAY_DISCOUNT')}</b></td>
                                    <td>{attributes.first_day_discount}</td>
                                </tr>
                                <tr>
                                    <td><b>{t('LBL_DISCOUNT_PER_DAY')}</b></td>
                                    <td>{attributes.discount_per_day?.toFixed(3)}</td>
                                </tr>
                                <tr>
                                    <td><b>{t('LBL_FIRST_DAY_SURCHARGE')}</b></td>
                                    <td>{attributes.first_day_surcharge}</td>
                                </tr>
                                <tr>
                                    <td><b>{t('LBL_SURCHARGE_PER_DAY')}</b></td>
                                    <td>{attributes.surcharge_per_day?.toFixed(3)}</td>
                                </tr>
                                <tr>
                                    <td><b>{t('LBL_TRANSFER_DISCOUNT')}</b></td>
                                    <td>{(attributes.transfer_discount == null || attributes.transfer_discount === 0) ? 0 : attributes.transfer_discount.toFixed(3)}</td>
                                </tr>
                                <tr>
                                    <td><b>{t('LBL_EXCEPTION_FROM_REUPTAKE')}</b></td>
                                    <td>{attributes.exception_from_reuptake ? t('LBL_TRUE') : t('LBL_FALSE')}</td>
                                </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                }
            </div>
        </>
    )
}

export default DrgAttributes;
