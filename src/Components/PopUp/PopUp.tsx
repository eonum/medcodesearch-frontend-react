import React, {useState, useEffect} from "react";
import "./PopUp.css"
import {Modal} from "react-bootstrap";
import {convertCatalogToResourceType, languages} from "../../Services/catalog-version.service";
import {fetchURL} from "../../Utils";
import {IUpdateStateByArg} from "../../interfaces";
import {useTranslation} from "react-i18next";
import {toast} from "react-toastify";

interface Props {
    language: string,
    changeLanguage: IUpdateStateByArg,
    selectedVersion: IUpdateStateByArg,
    changeSelectedButton: IUpdateStateByArg,
    show: boolean
    updatePopUpState: { (boolean_value: boolean): void },
    version: string,
    catalog: string
}

/**
 * Pop Up appearing if a non available version selected.
 * Points you out to go back or switch language where the version is available.
 */
function PopUp({ language, changeLanguage, selectedVersion, changeSelectedButton, show, updatePopUpState, version, catalog }: Props) {
    const { t } = useTranslation();
    const [showModal, setShowModal] = useState(false);
    const [availableLanguages, setAvailableLanguages] = useState<string[]>(['de']);

    /**
     * updates the show state and notifies parent
     * @param value
     */
    function handleShow(value) {
        setShowModal(value)
        updatePopUpState(value)
    }

    /**
     * Sync show state with props
     */
    useEffect(() => {
        setShowModal(show)
    }, [show]);

    /**
     * Fetch available languages when version or catalog changes
     */
    useEffect(() => {
        if (!catalog) return;
        setAvailableLanguages(['de'])
        findAvailableLanguages()
    }, [version, catalog]); // eslint-disable-line

    /**
     * Fetch the catalog and looks if there are languages for the selected version
     * @returns {Promise<void>}
     */
    async function findAvailableLanguages() {
        if(catalog === "AL" || catalog === "DRUG" || catalog === "MIGEL") {
            setAvailableLanguages(["de", "fr", "it"])
        } else {
            let ressource_type = convertCatalogToResourceType(catalog)
            for(let lang of languages) {
                if(lang !== language && lang !== 'de') {
                    await fetch([fetchURL, lang, ressource_type, 'versions'].join("/"))
                        .then((res) => {
                            if (!res.ok) throw new Error(`HTTP ${res.status}`)
                            return res.json()
                        })
                        .then((json) => {
                            if(json.includes(version)) {
                                setAvailableLanguages(prev => [...prev, lang])
                            }
                        })
                        .catch(() => {
                            toast.error(t('LBL_FETCH_ERROR'))
                        })
                }
            }
        }
    }

    /**
     * Handles the action after click on a disabled language.
     * @param lang
     */
    function handleLanguageClick(lang) {
        handleShow(false)
        changeLanguage(lang)
        selectedVersion(version)
        changeSelectedButton(catalog)
    }

    /**
     * Render the PopUp component
     * @returns {JSX.Element}
     */
    return (
        <>
            <Modal size="sm" show={showModal} onHide={() => handleShow(false)}>
                <Modal.Header closeButton>
                    <Modal.Title className="pull-left">{t('LBL_SELECT_LANGUAGE')}</Modal.Title>
                </Modal.Header>
                <Modal.Body>{t('LBL_CATALOG_LANGUAGE_NOT_AVAILABLE')}</Modal.Body>
                <Modal.Footer>
                        <button className="PopUpBtn" onClick={() => handleShow(false)}>
                            {t('LBL_BACK')}
                        </button>
                    <div className="float-end">
                    {availableLanguages.map((lang) => (
                        <button key={lang} className="PopUpBtn" onClick={() => handleLanguageClick(lang)}>
                            {lang}
                        </button>
                    ))}
                    </div>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default PopUp;
