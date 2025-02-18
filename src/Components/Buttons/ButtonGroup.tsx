import React, { useState, useEffect } from "react";
import "./ButtonGroup.css"
import {useParams} from "react-router-dom";
import {RouterService} from "../../Services/router.service";
import Buttons from "./Buttons";
import {
    IVersions,
    INoArgsFunction,
    IUpdateStateByArg,
    ILabelHash
} from "../../interfaces";
import {currentCatalogsByButton, versionizedCatalogs} from "../../Services/catalog-version.service";
import dateFormat from "dateformat"

interface Props {
    initialVersions: IVersions,
    currentVersions: IVersions,
    clickedOnLogo: boolean,
    selectedButton: string,
    version: string,
    reSetClickOnLogo: INoArgsFunction,
    reSetButton: INoArgsFunction,
    changeLanguage: IUpdateStateByArg,
    language: string,
    changeSelectedButton: IUpdateStateByArg,
    changeSelectedVersion: IUpdateStateByArg,
    changeSelectedDate: IUpdateStateByArg,
    labels: ILabelHash,
    buttons: string[]
}

/**
 * Handles high-level logic of the dropdown buttons, state management for versions of different catalogs, router
 * integration and date formatting.
 */
const ButtonGroup: React.FC<Props> = ({
                                           initialVersions,
                                           clickedOnLogo,
                                           selectedButton,
                                           version,
                                           reSetClickOnLogo,
                                           reSetButton,
                                           changeLanguage,
                                           language,
                                           changeSelectedButton,
                                           changeSelectedVersion,
                                           changeSelectedDate,
                                           labels,
                                           buttons
                                       }) => {
    const params = useParams();
    const [state, setState] = useState({
        activeButton: RouterService.getCatalog(),
        activeVersion: params.version,
        activeDate: dateFormat(new Date(), "dd.mm.yyyy"),
        currentICD: initialVersions['ICD'].at(-1),
        currentSwissDRG: initialVersions['SwissDRG'].at(-1),
        currentCHOP: initialVersions['CHOP'].at(-1),
        currentTARMED: initialVersions['TARMED'].at(-1),
        currentTARDOC: initialVersions['TARDOC'].at(-1),
        currentAmbGroup: initialVersions['AmbGroup'].at(-1),
        currentReha: initialVersions['Reha'].at(-1),
        currentSupplements: initialVersions['Supplements'].at(-1),
    });

    /**
     * Updates the button with the chosen params (version, btn (ICD, CHOP, ...), isCalendarType (which is the case for
     * Migel, AL and Drugs) and date.
     * @param version
     * @param btn
     * @param isCalendarType
     * @param date
     */
    // TODO: If choosing different version from different button, should old button version jump back to default or stay where it was?
    //  F.e. if clicking from ICD10-GM-2014 to SwissDRG V9.0, should version button of icd stay at GM-2014 or jump back to GM-2022?
    const updateOnButtonClick = (version: string, btn: string, isCalendarType?: boolean, date?: string) => {
        // If version is empty, we get it using btn.
        let selectedVersion;
        if (isCalendarType) {
            selectedVersion = ''
        } else {
            selectedVersion = version === '' ? getVersionFromButton(btn) : version;
            // Update currentVersion of currentButton.
            setState(prevState => ({
                ...prevState,
                [`current${btn}`]: selectedVersion
            }));
        }

        const formattedDate = date || dateFormat(new Date(), "dd.mm.yyyy");
        changeSelectedDate(formattedDate);
        changeSelectedVersion(selectedVersion);
        changeSelectedButton(btn);
        setState(prevState => ({
            ...prevState,
            selectedButton: btn,
            activeVersion: selectedVersion,
            selectedDate: formattedDate
        }));
    }

    /**
     * Takes the button name and returns the version of the button.
     * @param btn
     */
    const getVersionFromButton = (btn: string) => {
        return versionizedCatalogs.includes(btn) ? state[currentCatalogsByButton[btn]] : "";
    };

    useEffect(() => {
        if (versionizedCatalogs.includes(selectedButton)) {
            setState(prevState => ({
                ...prevState,
                [`current${selectedButton}`]: version
            }));
        }
    }, [version, selectedButton]);

    useEffect(() => {
        if (clickedOnLogo) {
            setState(prevState => ({
                ...prevState,
                selectedButton: params.catalog
            }));
            reSetClickOnLogo();
        }
    }, [clickedOnLogo, params.catalog, reSetClickOnLogo]);

    const { activeDate, activeButton } = state;

    return (
        <Buttons
            selectedCatalog={params.catalog}
            initialVersions={initialVersions}
            selectedDate={activeDate}
            version={getVersionFromButton(activeButton)}
            selectedVersion={params.version}
            reRender={clickedOnLogo}
            catalog={selectedButton}
            language={language}
            changeLanguage={changeLanguage}
            changeSelectedVersion={changeSelectedVersion}
            changeSelectedButton={changeSelectedButton}
            buttons={buttons}
            labels={labels}
            updateOnButtonClick={updateOnButtonClick}
        />
    );
};

export default ButtonGroup;