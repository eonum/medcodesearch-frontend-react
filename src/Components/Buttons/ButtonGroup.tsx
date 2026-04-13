import React, {useState, useEffect} from "react";
import "./ButtonGroup.css"
import {useParams} from "react-router-dom";
import {initializeCatalogFromURL} from "../../Services/router.service";
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
 * Responsible for all buttons to render
 * @component
 */
function ButtonGroup(props: Props) {
    const { catalog: paramCatalog, version: paramVersion } = useParams();

    const [selectedButtonState, setSelectedButtonState] = useState(initializeCatalogFromURL());
    const [activeVersion, setActiveVersion] = useState(paramVersion);
    const [currentVersionsByButton, setCurrentVersionsByButton] = useState<Record<string, string>>({
        ICD: props.initialVersions['ICD'].at(-1),
        SwissDRG: props.initialVersions['SwissDRG'].at(-1),
        CHOP: props.initialVersions['CHOP'].at(-1),
        TARMED: props.initialVersions['TARMED'].at(-1),
        Reha: props.initialVersions['Reha'].at(-1),
        Supplements: props.initialVersions['Supplements'].at(-1),
    });
    const [selectedDate, setSelectedDate] = useState(dateFormat(new Date(), "dd.mm.yyyy"));

    /**
     * Sets the catalog version from props when version or selectedButton changes.
     */
    useEffect(() => {
        if (versionizedCatalogs.includes(props.selectedButton)) {
            setCurrentVersionsByButton(prev => ({ ...prev, [props.selectedButton]: props.version }));
        }
    }, [props.version, props.selectedButton]);

    /**
     * Resets state when logo is clicked.
     */
    useEffect(() => {
        if (props.clickedOnLogo) {
            props.reSetClickOnLogo();
        }
    }, [props.clickedOnLogo]); // eslint-disable-line

    /**
     * Take a button name and return the version of the button.
     * @param btn
     * @returns {string}
     */
    function getVersionFromButton(btn) {
        return versionizedCatalogs.includes(btn) ? currentVersionsByButton[btn] : ""
    }

    /**
     * Updates the button with the new params.
     * @param version
     * @param btn
     * @param isCalendarType
     * @param date
     */
    // TODO: If choosing different version from different button, should old button version jump back to default or stay where it was?
    //  F.e. if clicking from ICD10-GM-2014 to SwissDRG V9.0, should version button of icd stay at GM-2014 or jump back to GM-2022?
    function updateOnButtonClick(version, btn, isCalendarType?, date?) {
        let selectedVersion;
        if (isCalendarType) {
            selectedVersion = ''
        } else {
            selectedVersion = version === '' ? getVersionFromButton(btn) : version;
            setCurrentVersionsByButton(prev => ({ ...prev, [btn]: selectedVersion }));
        }

        if (date === '') {
            date = dateFormat(new Date(), "dd.mm.yyyy")
        }
        props.changeSelectedDate(date);
        setSelectedButtonState(btn);
        setActiveVersion(selectedVersion);
        props.changeSelectedVersion(selectedVersion);
        props.changeSelectedButton(btn);
    }

    /**
     * Render the button group.
     * @returns {JSX.Element}
     */
    return (
        <Buttons
            selectedCatalog={paramCatalog}
            initialVersions={props.initialVersions}
            selectedDate={selectedDate}
            version={getVersionFromButton(selectedButtonState)}
            selectedVersion={paramVersion}
            reRender={props.clickedOnLogo}
            catalog={props.selectedButton}
            language={props.language}
            changeLanguage={props.changeLanguage}
            changeSelectedVersion={props.changeSelectedVersion}
            changeSelectedButton={props.changeSelectedButton}
            buttons={props.buttons}
            labels={props.labels}
            updateOnButtonClick={(version, catalog, isCalendar, date) => {
                updateOnButtonClick(version, catalog, isCalendar, date)
            }}
        />
    )
}

export default ButtonGroup;
