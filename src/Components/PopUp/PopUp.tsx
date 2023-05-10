import React, {useEffect, useState} from "react";
import "./PopUp.css"
import {Modal, Spinner} from "react-bootstrap";
import {convertCatalogToResourceType, languages} from "../../Services/catalog-version.service";
import {fetchURL} from "../../Utils";
import {IUpdateStateByArg} from "../../interfaces";
import {useTranslation} from "react-i18next";
import loadingSpinner from "../Spinner/spinner";

interface Props {
    language: string,
    changeLanguage: IUpdateStateByArg,
    changeSelectedVersion: IUpdateStateByArg,
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
const PopUp: React.FunctionComponent<Props> = props =>  {
    const [availableLanguages, setAvailableLanguages] = useState<string[]>(['de'])
    const [showLanguages, setShowLanguages] = useState<boolean>(false)
    const {t} = useTranslation();

    // Update show popup state.
    useEffect(() => {
        props.updatePopUpState(props.show)
    }, [props.show])

    useEffect(() => {
        // Named async function to reset available languages, then fetch current catalog and reset available languages
        // for this catalog.
        const findAvailableLanguages = async() => {
            setShowLanguages(false)
            if(props.catalog === "AL" || props.catalog === "DRUG" || props.catalog === "MIGEL") {
                await setAvailableLanguages(["de", "fr", "it"])
            } else {
                let ressource_type = convertCatalogToResourceType(props.catalog)
                let validLanguages = ['de']
                for(let lang of languages) {
                    if(lang !== props.language && lang !== 'de') {
                        await fetch([fetchURL, lang, ressource_type, 'versions'].join("/"))
                            .then((res) => res.json())
                            .then((json) => {
                                if (json.includes(props.version)) {
                                    validLanguages.push(lang)
                                }})
                    }
                }
                await setAvailableLanguages(validLanguages)
            }
            setShowLanguages(true)
        }
        // Call above async function.
        findAvailableLanguages();
    }, [props.catalog, props.version])

    /**
     * Handles the action after click on a disabled language.
     * @param language
     */
    function handleLanguageClick(language) {
        props.updatePopUpState(false)
        props.changeLanguage(language)
        props.changeSelectedVersion(this.props.version)
        props.changeSelectedButton(this.props.catalog)
    }

    // Return the popup JSX.
    return (
        <Modal size="sm" show={props.show} onHide={() => props.updatePopUpState(false)}>
            <Modal.Header closeButton>
                <Modal.Title className="pull-left">{t('LBL_SELECT_LANGUAGE')}</Modal.Title>
            </Modal.Header>
            <Modal.Body>{t('LBL_CATALOG_LANGUAGE_NOT_AVAILABLE')}</Modal.Body>
            <Modal.Footer>
                <button className="PopUpBtn" onClick={() => props.updatePopUpState(false)}>
                    {t('LBL_BACK')}
                </button>
                <div className="float-end">
                    {showLanguages ? availableLanguages.map((language, i) => (
                        <button key={i} className="PopUpBtn" onClick={() => handleLanguageClick(language)}>
                            {language}
                        </button>
                    )) : <Spinner animation="border" /> }
                </div>
            </Modal.Footer>
        </Modal>)
}

export default PopUp;
