import PopUp from "../PopUp/PopUp";
import {Dropdown, DropdownButton} from "react-bootstrap";
import {convertCatalogToResourceType, cutCatalogFromVersion} from "../../Services/catalog-version.service";
import React, {useEffect, useState} from "react";
import DatePicker from "./DatePicker";
import {IVersions, IUpdateStateByArg, IUpdateButton, ILabelHash} from "../../interfaces";
import {fetchURL} from "../../Utils";

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
    disabledVersion: string,
    disabledCatalog: string,
    allVersions: string[], // All possible versions in language 'de' of one catalog in an array, f.e. ["CHOP_2011", "CHOP_2012", ...].
    availableVersions: string[], // All available version in a specific language (used to enable / disable versions in dropdown.
    selectedButton: string
}

/**
 * Creates the catalog and version dropdown buttons.
 * @component
 */
const Buttons: React.FunctionComponent<Props> = props =>  {
    const [showPopup, setShowPopup] = useState<boolean>(false)
    const [disabledVersion, setDisabledVersion] = useState<string>("")
    const [disabledCatalog, setDisabledCatalog] = useState<string>("")
    // All possible versions in language 'de' of one catalog in an array, f.e. ["CHOP_2011", "CHOP_2012", ...].
    const [allVersions, setAllVersions] = useState<string[]>([])
    // All available version in a specific language (used to enable / disable versions in dropdown).
    const [availableVersions, setAvailableVersions] = useState<string[]>([])
    const [selectedButton, setSelectedButton] = useState<string>("")

    // Fetch base and available versions after initial render and if language, catalog or reRender changes.
    useEffect(() => {
        /**
         * Uses 'de' language to fetch base versions.
         * @returns {Promise<void>}
         */
        const fechtBaseVersions = async() => {
            if (!isCalBut()) {
                await fetch([fetchURL, 'de', convertCatalogToResourceType(props.catalog), 'versions'].join("/"))
                    .then((res) => res.json())
                    .then((json) => {
                        setAllVersions(json);
                        setAvailableVersions(json);
                    })
            } else {
                setAllVersions([]);
                setAvailableVersions([]);
            }
        }

        /**
         * Uses language from props to fetch available versions for this language.
         * @returns {Promise<void>}
         */
        const fetchAvailableVersions = async() => {
            if (!isCalBut()) {
                let versionsString = [fetchURL, props.language, convertCatalogToResourceType(props.catalog), 'versions'].join("/")
                await fetch(versionsString)
                    .then((res) => res.json())
                    .then((json) => {
                        setAvailableVersions(json);
                    })
            } else {
                setAvailableVersions([]);
            }
        }
        fechtBaseVersions();
        fetchAvailableVersions();
    }, [props.language, props.catalog, props.reRender])

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
            setShowPopup(true)
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
            setShowPopup(true)
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
    const getVersion = () => {
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
    const isCalBut = () => {
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
                    changeSelectedVersion={props.changeSelectedVersion}
                    changeSelectedButton={props.changeSelectedButton}
                    show={showPopup}
                    updatePopUpState={(value) => {setShowPopup(value)}}
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
                            <DatePicker
                                selectedCatalog={props.selectedCatalog}
                                selectedDate= {props.selectedDate}
                                clickDate={(date) => {
                                    props.updateOnButtonClick('',props.catalog, true, date)
                                }}
                            /> :
                            <DropdownButton
                                title={getVersion()}
                                key={"dropdown_versions"}
                                id={"version_button"}
                                bsPrefix={'form-control'} // Use bsPrefix to change underlying CSS base class name.
                            >
                                {allVersions.reverse().map(
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
