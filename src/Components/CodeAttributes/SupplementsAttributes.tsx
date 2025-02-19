import React, {useEffect} from "react";
import {ISupplementsAttributes} from "../../interfaces";
import {useParams, useNavigate} from "react-router-dom";
import {useTranslation} from "react-i18next";
import ClickableCodesArray from "./ClickableCodesArray";

interface Props {
    attributes: ISupplementsAttributes
}

/**
 * Returns the supplement specific attributes.
 * */
const SupplementsAttributes: React.FC<Props> = ({ attributes }) => {
    const params = useParams();
    const { t, i18n } = useTranslation();
    // Make translation language aware.
    useEffect(() => {
        i18n.changeLanguage(params.language);
    }, [params.language]);

    const { terminal } = attributes;
    // If not terminal, there is only text info which is rendered in parent component.
    if (!terminal) {
        return null;
    }

    const renderRelevantCodes = (codes: any[]) => {
        const zeType = attributes.ze_type;
        return (zeType === "C" ?
                <ClickableCodesArray
                    codesArray={codes}
                    codesType={'REL_CODES_SUPPLEMENTS'}
                    language={params.language}
                    catalog={'CHOP'}
                    id={'relevantChopCodes'}
                /> :
                renderCodesArray(codes, "LBL_REL_CODES_SUPPLEMENTS", "C", 'relevantCodes')
        );
    };

    const renderClickableCodesArray = (codes: any[], catalog: string, codesType: string) => {
        return <ClickableCodesArray
            codesArray={codes}
            codesType={codesType}
            language={params.language}
            catalog={catalog}
            id={codesType}
        />
    };

    const transformRelevantCodesTitle = (title: string, zeType: string) => {
        if (zeType === 'C') {
            return `${title} (CHOP)`;
        }
        if (zeType === 'A') {
            return `${title} (ATC)`;
        }
        return title;
    }

    const renderCodesArray = (codes: any[], title: string, codeType: string | null, id: string) => {
        return (
            <div id={id}>
                <h5>{transformRelevantCodesTitle(t(title), codeType || '')}</h5>
                <ul>
                    {codes.map((c) => (
                        <li key={c.code}>{c.code + (c.text ? ": " + c.text : "")}</li>
                    ))}
                </ul>
            </div>
        );
    };

    const tableRow = (key: string, value: any) => (
        <tr key={key + "_" + value}>
            <td><b>{t('LBL_' + key.toUpperCase())}</b></td>
            <td>{value}</td>
        </tr>
    );

    const dosageInfo = (attrs: ISupplementsAttributes) => (
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
        );



    // TODO: Render clickable codes array as soon as linking into codes from different catalogs is properly implemented.
        return (
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
                            {Object.keys(attributes).map((key) => {
                                    let value = attributes[key];
                                    switch (key) {
                                        case "age_higher_than":
                                        case "age_lower_than":
                                            return value > 0 ? tableRow(key, value) : null;
                                        case 'dosage':
                                            return value != 0.0 ? dosageInfo(attributes) : null;
                                        case 'za':
                                        case 'va':
                                            return value ? tableRow(key, value) : null;
                                        case "amount":
                                            return tableRow(key, value)
                                    }
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
                {attributes.relevant_codes && attributes.relevant_codes.length > 0 && attributes.relevant_codes[0].code &&
                    renderCodesArray(
                        attributes.relevant_codes,
                        'LBL_REL_CODES_SUPPLEMENTS',
                        attributes.ze_type,
                        "RELEVANT_CODES"
                    )}
                {attributes.excluded_drgs && attributes.excluded_drgs.length > 0 &&
                    renderCodesArray(
                        attributes.excluded_drgs,
                        'LBL_EXCLUDED_DRGS',
                        null,
                        'EXCLUDED_DRGS'
                    )}
                {attributes.constraint_icds && attributes.constraint_icds.length > 0 &&
                    renderCodesArray(
                        attributes.constraint_icds,
                        'LBL_CONSTRAINT_ICDS',
                        null,
                        'CONSTRAINT_ICDS'
                    )}
                {attributes.constraint_chops && attributes.constraint_chops.length > 0 &&
                    renderCodesArray(
                        attributes.constraint_chops,
                        'LBL_CONSTRAINT_CHOPS',
                        null,
                        'CONSTRAINT_CHOPS'
                    )}
            </div>
        );
};

export default SupplementsAttributes;

