import PopUp from "../PopUp/PopUp";
import {Dropdown, DropdownButton} from "react-bootstrap";
import {convertCatalogToResourceType, cutCatalogFromVersion} from "../../Services/catalog-version.service";
import React, {useState, useEffect} from "react";
import DatePicker from "./DatePicker";
import {IVersions, IUpdateStateByArg, IUpdateButton, ILabelHash} from "../../interfaces";
import {fetchURL} from "../../Utils";
import {toast} from "react-toastify";
import {useTranslation} from "react-i18next";

interface Props {
    selectedCatalog: string
    initialVersions: IVersions,
    selectedDate: string,
    version: string,
    selectedVersion: string,
    reRender: boolean,
    catalog: string,
    language: string,
    changeLanguage: IUpdateStateByArg,
    changeSelectedVersion: IUpdateStateByArg,
    changeSelectedButton: IUpdateStateByArg,
    buttons: string[]
    labels: ILabelHash,
    updateOnButtonClick: IUpdateButton
}

export interface IButton {
    showPopUp: boolean,
    disabledVersion: string,
    disabledCatalog: string,
    allVersions: string[], // All possible versions in language 'de' of one catalog in an array, f.e. ["CHOP_2011", "CHOP_2012", ...].
    availableVersions: string[], // All available version in a specific language (used to enable / disable versions in dropdown.
}

/**
 * Creates the catalog and version dropdown buttons.
 * @component
 */
function Buttons(props: Props) {
    const { t } = useTranslation();
    const [showPopUp, setShowPopUp] = useState(false);
    const [disabledVersion, setDisabledVersion] = useState("");
    const [disabledCatalog, setDisabledCatalog] = useState("");
    const [allVersions, setAllVersions] = useState<string[]>([]);
    const [availableVersions, setAvailableVersions] = useState<string[]>([]);

    /**
     * Fetches base and available versions when language, catalog, or reRender changes.
     */
    useEffect(() => {
        fetchBaseVersions();
        fetchAvailableVersions();
    }, [props.language, props.catalog, props.reRender]); // eslint-disable-line

    /**
     * Uses 'de' language to fetch base versions.
     */
    async function fetchBaseVersions() {
        if (!isCalBut()) {
            await fetch([fetchURL, 'de', convertCatalogToResourceType(props.catalog), 'versions'].join("/"))
                .then((res) => {
                    if (!res.ok) throw new Error(`HTTP ${res.status}`)
                    return res.json()
                })
                .then((json) => {
                    setAllVersions(json)
                    setAvailableVersions(json)
                })
                .catch(() => {
                    toast.error(t('LBL_FETCH_ERROR'))
                })
        } else {
            setAllVersions([])
            setAvailableVersions([])
        }
    }

    /**
     * Uses language from props to fetch available versions for this language.
     */
    async function fetchAvailableVersions() {
        if (!isCalBut()) {
            let versionsString = [fetchURL, props.language, convertCatalogToResourceType(props.catalog), 'versions'].join("/")
            await fetch(versionsString)
                .then((res) => {
                    if (!res.ok) throw new Error(`HTTP ${res.status}`)
                    return res.json()
                })
                .then((json) => {
                    setAvailableVersions(json)
                })
                .catch(() => {
                    toast.error(t('LBL_FETCH_ERROR'))
                })
        } else {
            setAvailableVersions([])
        }
    }

    /**
     * Set the clicked version and button.
     * @param version
     * @param btn
     */
    function handleVersionClick(version, btn) {
        const dropdown = document.getElementById(version.replace(/\./g, ''));
        if(!dropdown.classList.contains('disabled')) {
            props.updateOnButtonClick(version, btn)
        } else {
            setDisabledCatalog(btn)
            setShowPopUp(true)
            setDisabledVersion(version)
        }
    }

    /**
     * Update state if a catalog gets clicked.
     * @param catalog
     */
    function handleCatalogClick(catalog) {
        const cat = document.getElementById(catalog + "_button");
        if(!cat.classList.contains('disabled')) {
            props.updateOnButtonClick('', catalog, false, "")
        } else {
            setDisabledCatalog(catalog)
            setShowPopUp(true)
            if(catalog === "MIGEL" || catalog === "AL" || catalog === "DRUG") {
                setDisabledVersion("")
            } else {
                setDisabledVersion(props.initialVersions[catalog].at(-1))
            }
        }
    }

    /**
     * Returns the current version without the catalog prefix.
     * @returns {*|string} currently used version
     */
    function getVersion() {
        if(props.selectedVersion) {
            return cutCatalogFromVersion(props.catalog, props.selectedVersion)
        } else {
            return cutCatalogFromVersion(props.catalog, props.version)
        }
    }

    /**
     * Looks if the catalog uses a calendar (true or false).
     * @returns {boolean}
     */
    function isCalBut() {
        return ['AL', 'MIGEL', 'DRUG'].includes(props.catalog)
    }

    /**
     * Render the button.
     * @returns {JSX.Element}
     */
    return(
        <>
            <PopUp
                language={props.language}
                changeLanguage={props.changeLanguage}
                selectedVersion={props.changeSelectedVersion}
                changeSelectedButton={props.changeSelectedButton}
                show={showPopUp}
                updatePopUpState={(value) => setShowPopUp(value)}
                version={disabledVersion}
                catalog={disabledCatalog}
            />
            <div key={"buttons"} className="btn-group">
                <div className={"me-2"}>
                    <DropdownButton
                        title={props.labels[props.catalog]}
                        key={"dropdown_catalog"}
                        id={"catalog_button"}
                        bsPrefix={'form-control'} // Use bsPrefix to change underlying CSS base class name.
                    >
                        {props.buttons.map((btn) => (
                                <Dropdown.Item
                                    className={props.language === "en" && btn !== "ICD" ? "disabled" : ""}
                                    eventKey={btn}
                                    key={"button_dropdown_catalog_" + btn}
                                    id={btn + "_button"}
                                    onClick={() => {handleCatalogClick(btn)}}>
                                    {props.labels[btn]}
                                </Dropdown.Item>
                            )
                        )}
                    </DropdownButton>
                </div>
                <div className={"me-2"}>
                    {isCalBut() ?
                        props.catalog !== 'DRUG' &&
                        <DatePicker
                            selectedCatalog={props.selectedCatalog}
                            selectedDate= {props.selectedDate}
                            clickDate={(date) => {
                                props.updateOnButtonClick('', props.catalog, true, date)
                            }}
                        /> :
                        <DropdownButton
                            title={getVersion()}
                            key={"dropdown_versions"}
                            id={"version_button"}
                            bsPrefix={'form-control'} // Use bsPrefix to change underlying CSS base class name.
                        >
                            {allVersions.slice().reverse().map(
                                (version) => (
                                    <Dropdown.Item
                                        className={availableVersions.includes(version) ? "" : "disabled"}
                                        eventKey={version}
                                        key={"button_dropdown_versions_" + version}
                                        id={version.replace(/\./g, '')}
                                        onClick={() => {
                                            handleVersionClick(version, props.catalog)
                                        }}
                                    >{cutCatalogFromVersion(props.catalog, version)}</Dropdown.Item>
                                )
                            )}
                        </DropdownButton>
                    }
                </div>
            </div>
        </>
    )
}

export default Buttons;
