import React, { useState, useEffect } from 'react';
import PopUp from "../PopUp/PopUp";
import { Dropdown, DropdownButton } from "react-bootstrap";
import { convertCatalogToResourceType, cutCatalogFromVersion } from "../../Services/catalog-version.service";
import { IVersions, IUpdateStateByArg, IUpdateButton, ILabelHash } from "../../interfaces";
import { fetchURL } from "../../Utils";
import DatePicker from "./DatePicker";

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

/**
 * Catalog and version dropdown buttons.
 * Handles UI rendering of dropdowns, version fetching logic, user interaction and PopUp.
 * @component
 */
const Buttons: React.FC<Props> = ({
                                      selectedCatalog,
                                      initialVersions,
                                      selectedDate,
                                      version,
                                      selectedVersion,
                                      reRender,
                                      catalog,
                                      language,
                                      changeLanguage,
                                      changeSelectedVersion,
                                      changeSelectedButton,
                                      buttons,
                                      labels,
                                      updateOnButtonClick
                                  }) => {
    const [showPopUp, setShowPopUp] = useState(false);
    const [disabledVersion, setDisabledVersion] = useState("");
    const [disabledCatalog, setDisabledCatalog] = useState("");
    const [allVersions, setAllVersions] = useState<string[]>([]);
    const [availableVersions, setAvailableVersions] = useState<string[]>([]);

    const isCalendar = () => {
        return ['AL', 'MIGEL', 'DRUG'].includes(catalog);
    };

    /**
     * Fetches base versions of a given catalog using 'de' language.
     */
    const fetchBaseVersions = async () => {
        if (!isCalendar()) {
            const response = await fetch([fetchURL, 'de', convertCatalogToResourceType(catalog), 'versions'].join("/"));
            const json = await response.json();
            setAllVersions(json);
        } else {
            setAllVersions([]);
        }
    }

    /**
     * Fetches available versions of a given catalog using language from props.
     */
    const fetchAvailableVersions = async () => {
        if (!isCalendar()) {
            const versionsString = [fetchURL, language, convertCatalogToResourceType(catalog), 'versions'].join("/");
            const response = await fetch(versionsString);
            const json = await response.json();
            setAvailableVersions(json);
        } else {
            setAvailableVersions([]);
        }
    }

    /**
     * Triggers fetching of base and available versions on initial render and changes of language, catalog, reRender.
     */
    useEffect(() => {
        (async () => {
            await fetchBaseVersions();
            await fetchAvailableVersions();
        })();
    }, [language, catalog, reRender]);

    /**
     * Handles click on version dropdown, i.e. update to clicked version or render not available PopUp if disabled one.
     * @param version
     * @param btn
     */
    const handleVersionClick = (version: string, btn: string) => {
        const dropdown = document.getElementById(version.replace(/\./g, ''));
        if (!dropdown?.classList.contains('disabled')) {
            updateOnButtonClick(version, btn);
        } else {
            setDisabledCatalog(btn);
            setShowPopUp(true);
            setDisabledVersion(version);
        }
    }

    /**
     * Handles click on catalog dropdown, i.e. update to clicked catalog or render not available PopUp if disabled one.
     * @param catalog
     */
    const handleCatalogClick = (catalog: string) => {
        const cat = document.getElementById(catalog + "_button");
        if (!cat?.classList.contains('disabled')) {
            updateOnButtonClick('', catalog, false, "");
        } else {
            setDisabledCatalog(catalog);
            setShowPopUp(true);
            if (catalog === "MIGEL" || catalog === "AL" || catalog === "DRUG") {
                setDisabledVersion("");
            } else {
                setDisabledVersion(initialVersions[catalog].at(-1));
            }
        }
    };

    /**
     * Returns the current version without the catalog prefix.
     */
    const getVersionString = () => {
        if (selectedVersion) {
            return cutCatalogFromVersion(catalog, selectedVersion);
        }
        return cutCatalogFromVersion(catalog, version);
    };

    return(
        <>
            <PopUp
                language={language}
                changeLanguage={changeLanguage}
                selectedVersion={changeSelectedVersion}
                changeSelectedButton={changeSelectedButton}
                show={showPopUp}
                updatePopUpState={setShowPopUp}
                version={disabledVersion}
                catalog={disabledCatalog}
            />
            <div key={"buttons"} className="btn-group">
                <div className={"me-2"}>
                    <DropdownButton
                        title={labels[catalog]}
                        key={"dropdown_catalog"}
                        id={"catalog_button"}
                        bsPrefix={'form-control'} // Use bsPrefix to change underlying CSS base class name.
                    >
                        {buttons.map((btn) => (
                                <Dropdown.Item
                                    className={language === "en" && btn !== "ICD" ? "disabled" : ""}
                                    eventKey={btn}
                                    key={"button_dropdown_catalog_" + btn}
                                    id={btn + "_button"}
                                    onClick={() => handleCatalogClick(btn)}
                                >
                                    {labels[btn]}
                                </Dropdown.Item>
                            )
                        )}
                    </DropdownButton>
                </div>
                <div className={"me-2"}>
                    {isCalendar() ?
                        <DatePicker
                            selectedCatalog={selectedCatalog}
                            selectedDate={selectedDate}
                            clickDate={(date) => {
                                updateOnButtonClick('', catalog, true, date);
                            }}
                        /> :
                        <DropdownButton
                            title={getVersionString()}
                            key={"dropdown_versions"}
                            id={"version_button"}
                            bsPrefix={'form-control'} // Use bsPrefix to change underlying CSS base class name.
                        >
                            {allVersions.reverse().map((version) => (
                                    <Dropdown.Item
                                        className={availableVersions.includes(version) ? "" : "disabled"}
                                        eventKey={version}
                                        key={"button_dropdown_versions_" + version}
                                        id={version.replace(/\./g, '')}
                                        onClick={() => handleVersionClick(version, catalog)}
                                    >
                                        {cutCatalogFromVersion(catalog, version)}
                                    </Dropdown.Item>
                                )
                            )}
                        </DropdownButton>
                    }
                </div>
            </div>
        </>
    );
}

export default Buttons;
