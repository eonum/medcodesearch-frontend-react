import React, { useState, useEffect, useCallback } from "react";
import "./PopUp.css"
import {Modal} from "react-bootstrap";
import {convertCatalogToResourceType, languages} from "../../Services/catalog-version.service";
import {fetchURL} from "../../Utils";
import {IUpdateStateByArg} from "../../interfaces";
import {useTranslation} from "react-i18next";

interface Props {
    language: string,
    changeLanguage: IUpdateStateByArg,
    selectedVersion: IUpdateStateByArg,
    changeSelectedButton: IUpdateStateByArg,
    show: boolean
    updatePopUpState: { (show: boolean): void },
    version: string,
    catalog: string
}

/**
 * Pop Up appearing if a non available version selected.
 * Points you out to go back or switch language where the version is available.
 */
const PopUp: React.FC<Props> = ({
                                    language,
                                    changeLanguage,
                                    selectedVersion,
                                    changeSelectedButton,
                                    show,
                                    updatePopUpState,
                                    version,
                                    catalog
                                }) => {
    const [isVisible, setIsVisible] = useState(false);
    const [availableLanguages, setAvailableLanguages] = useState(['de']);
    const { t } = useTranslation();

    // Find all available languages for current catalog and version.
    // Function is recreated if language, version or catalog changes.
    const findAvailableLanguages = useCallback(async () => {
        if (catalog === "AL" || catalog === "DRUG" || catalog === "MIGEL") {
            setAvailableLanguages(["de", "fr", "it"]);
        } else {
            const resourceType = convertCatalogToResourceType(catalog);
            const newLanguages = ['de'];

            for (const lang of languages) {
                if (lang !== language && lang !== 'de') {
                    try {
                        const response = await fetch([fetchURL, lang, resourceType, 'versions'].join("/"));
                        const json = await response.json();
                        if (json.includes(version)) {
                            newLanguages.push(lang);
                        }
                    } catch (error) {
                        console.error('Error fetching available lang:', error);
                    }
                }
            }
            setAvailableLanguages(newLanguages);
        }
    }, [catalog, version, language]);

    useEffect(() => {
        setIsVisible(show);
    }, [show]);

    useEffect(() => {
        setAvailableLanguages(['de']);
        findAvailableLanguages();
    }, [version, catalog, findAvailableLanguages]);

    const handleClose = () => {
        setIsVisible(false);
        updatePopUpState(false);
    };

    const handleLanguageClick = (selectedLanguage: string) => {
        handleClose();
        changeLanguage(selectedLanguage);
        selectedVersion(version);
        changeSelectedButton(catalog);
    };

    return (
        <Modal size="sm" show={isVisible} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title className="pull-left">{t('LBL_SELECT_LANGUAGE')}</Modal.Title>
            </Modal.Header>
            <Modal.Body>{t('LBL_CATALOG_LANGUAGE_NOT_AVAILABLE')}</Modal.Body>
            <Modal.Footer>
                <button className="PopUpBtn" onClick={handleClose}>
                    {t('LBL_BACK')}
                </button>
                <div className="float-end">
                    {availableLanguages.map((language, i) => (
                        <button
                            key={i}
                            className="PopUpBtn"
                            onClick={() => handleLanguageClick(language)}
                        >
                            {language}
                        </button>
                    ))}
                </div>
            </Modal.Footer>
        </Modal>
    );
};

export default PopUp;
