import React from "react";
import {IAttributes} from "../../interfaces";
import {commonCodeInfos} from "../../Utils";
import {useNavigate} from "react-router-dom";
import {useTranslation} from "react-i18next";

interface Props {
    attributes: IAttributes
}

/**
 * Renders code attributes for the LKAAT catalog, transforming service_type and procedure_type
 * values into their locale-specific descriptions before display.
 */
function LkaatAttributes({ attributes }: Props) {
    const { t } = useTranslation();
    const navigate = useNavigate();

    function transformAttributes(attrs) {
        const result = { ...attrs }

        if (result.service_type) {
            result.service_type = t('LBL_SERVICE_TYPE_' + result.service_type.toUpperCase())
        }

        if (result.procedure_type === 'time') {
            result.procedure_type = t('LBL_PROCEDURE_TYPE_TIME')
        } else if (result.procedure_type === 'action') {
            result.procedure_type = t('LBL_PROCEDURE_TYPE_ACTION')
        } else {
            result.procedure_type = null
        }

        return result
    }

    const { noCodeError, codeInfos } = commonCodeInfos(transformAttributes(attributes), t, true, navigate)

    return noCodeError ? <div>{t("LBL_NO_CODE_VERSIONIZED")}</div> : <>{codeInfos}</>
}

export default LkaatAttributes;
