import PopUp from "../PopUp/PopUp";
import {Dropdown} from "react-bootstrap";
import DropdownToggle from "react-bootstrap/DropdownToggle";
import DropdownMenu from "react-bootstrap/DropdownMenu";
import {convertCatalogToResourceType, cutCatalogFromVersion, findCatalog} from "../../Services/catalog-version.service";
import React, {Component} from "react";
import DatePicker from "./DatePicker";
import {IVersions, IButtonLabels, IUpdateStateByArg, IUpdateButton, IUnversionizedLabels} from "../../interfaces";
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
    buttons: IButtonLabels,
    labels: IUnversionizedLabels,
    updateOnButtonClick: IUpdateButton
}

export interface IButton {
    showPopUp: boolean,
    disabledVersion: string,
    disabledCatalog: string,
    allVersions: string[], // All possible versions in language 'de' of one catalog in an array, f.e. ["CHOP_2011", "CHOP_2012", ...].
    availableVersions: string[], // All available version in a specific language (used to enable / disable versions in dropdown.
    buttons: string[],
    selectedButton: string
}

/**
 * creates the button for the mobile version
 * @component
 */
class Button extends Component<Props,IButton>{

    /**
     * sets the default state values and bind the popup
     * @param props
     */
    constructor(props) {
        super(props);
        this.state={
            showPopUp: false,
            disabledVersion: "",
            disabledCatalog: "",
            allVersions: [],
            availableVersions: [],
            buttons: this.convertButtons(),
            selectedButton: this.props.catalog
        }
        this.updatePopUp = this.updatePopUp.bind(this);
    }

    /**
     * converts button-arrays to one button array
     * @returns {[]}
     */
    convertButtons(){
        let buttons= [];
        for(let i =0 ; i < this.props.buttons[0].length; i++){
            buttons[i]= this.props.buttons[0][i]
        }
        for(let j=0 ; j < this.props.buttons[1].length; j++){
            buttons[j+ this.props.buttons[0].length]=this.props.buttons[1][j];
        }
        return buttons;
    }

    /**
     * Fetches base and available versions after component did update.
     * @param prevProps
     * @param prevState
     * @param snapshot
     * @returns {Promise<void>}
     */
    async componentDidUpdate(prevProps, prevState, snapshot) {
        if(prevProps.language !== this.props.language || prevProps.catalog !== this.props.catalog
            || this.props.reRender) {
            await this.fechtBaseVersions()
            await this.fetchAvailableVersions()
        }
    }

    /**
     * Initializes the base and available versions after mount.
     * @returns {Promise<void>}
     */
    async componentDidMount() {
        await this.fechtBaseVersions()
        await this.fetchAvailableVersions()
    }

    /**
     * Set the clicked version and button.
     * @param version
     * @param btn
     */
    handleVersionClick(version, btn) {
        const dropdown = document.getElementById(version.replace(/\./g, ''));
        if(!dropdown.classList.contains('disabled')) {
            this.props.updateOnButtonClick(version, btn)
        } else {
            this.setState({disabledCatalog: findCatalog(version)})
            this.setState({showPopUp: true})
            this.setState({disabledVersion: version})
        }

    }

    /**
     * Update state if a catalog gets clicked.
     * @param catalog
     */
    handleCatalogClick(catalog) {
        const cat = document.getElementById(catalog + "_button");
        if(!cat.classList.contains('disabled')) {
            this.props.updateOnButtonClick('', catalog, false, "")
        } else {
            this.setState({disabledCatalog: catalog})
            this.setState({showPopUp: true})
            if(catalog === "MIGEL" || catalog === "AL" || catalog === "DRUG") {
                this.setState({disabledVersion: ""})
            } else {
                this.setState({disabledVersion: this.props.initialVersions[catalog].at(-1)})
            }
        }
    }

    /**
     * Uses 'de' language to fetch base versions.
     * @returns {Promise<void>}
     */
    async fechtBaseVersions() {
        if (!this.isCalBut()) {
            await fetch([fetchURL, 'de', convertCatalogToResourceType(this.props.catalog), 'versions'].join("/"))
                .then((res) => res.json())
                .then((json) => {
                    this.setState({
                        allVersions: json,
                        availableVersions: json
                    })
                })
        } else {
            this.setState({allVersions: [], availableVersions: []})
        }
    }

    /**
     * Uses language from props to fetch available versions for this language.
     * @returns {Promise<void>}
     */
    async fetchAvailableVersions() {
        if (!this.isCalBut()) {
            let versionsString = [fetchURL, this.props.language, convertCatalogToResourceType(this.props.catalog), 'versions'].join("/")
            await fetch(versionsString)
                .then((res) => res.json())
                .then((json) => {
                    this.setState({availableVersions: json})
                })
        } else {
            this.setState({availableVersions: []})
        }
    }

    /**
     * Returns the current version without the catalog prefix.
     * @returns {*|string} currently used version
     */
    getVersion() {
        if(this.props.selectedVersion) {
            return cutCatalogFromVersion(this.props.catalog, this.props.selectedVersion)
        } else {
            return cutCatalogFromVersion(this.props.catalog, this.props.version)
        }
    }

    /**
     * Set show popup boolean.
     * @param value
     */
    updatePopUp = (value) => {
        this.setState({showPopUp: value})
    }

    /**
     * Looks if the catalog uses a calendar (true or false).
     * @returns {boolean}
     */
    isCalBut() {
        return ['AL', 'MIGEL', 'DRUG'].includes(this.props.catalog)
    }

    /**
     * Converts a catalog into a label, s.t. buttons with calendars are displayed in correct language.
     * Only used for the selected button.
     * @returns label
     */
    convertToLabel() {
        if(this.props.catalog === "SwissDRG" || this.props.catalog === "ICD" || this.props.catalog === "CHOP"
            || this.props.catalog === "TARMED" || this.props.catalog === "STS"){
            return this.props.catalog;
        }
        else{
            return this.props.labels[this.props.catalog]
        }
    }

    /**
     * Extracts label by button s.t. buttons with calendars are displayed in the correct language.
     * @returns label
     */
    extractLabel(btn) {
        return ["AL", "MIGEL", "DRUG"].includes(btn) ? this.props.labels[btn] : btn
    }

    /**
     * Returns the class name of a button.
     * @param btn
     * @returns {string}
     */
    getClassName(btn) {
        let name = "dropdown-item"
        if(this.props.language === "en" && btn !== "ICD") {
            name += "-disabled"
        }
        return name
    }

    /**
     * Render the mobile button.
     * @returns {JSX.Element}
     */
    render(){
        return(
            <div key={"mobile_button_0"} className="btn-group">
                <PopUp
                    language={this.props.language}
                    changeLanguage={this.props.changeLanguage}
                    selectedVersion={this.props.changeSelectedVersion}
                    changeSelectedButton={this.props.changeSelectedButton}
                    show={this.state.showPopUp}
                    updatePopUpState={this.updatePopUp}
                    version={this.state.disabledVersion}
                    catalog={this.state.disabledCatalog}
                />
                <Dropdown key={"mobile_button_dropdown_catalog"} className={this.isCalBut() ? "catalogButtons mobileCal" : "catalogButtons"}>
                    <DropdownToggle
                        key={"mobile_button_dropdown_catalog_toggle"}
                        className={this.isCalBut() ? "customButton mobileCal" : "customButton"}
                        variant=""
                        type="button"
                        id={"mobile_catalog_button"}>
                        {this.convertToLabel()}
                    </DropdownToggle>
                    <DropdownMenu className="dropdown" >
                        {this.state.buttons.map((btn) => (
                                <Dropdown.Item className={this.getClassName(btn)}
                                               eventKey={btn}
                                               key={"mobile_button_dropdown_catalog_" + btn}
                                               id={btn + "_button"}
                                               onClick={() => {
                                    this.handleCatalogClick(btn)
                                }}>
                                    {this.extractLabel(btn)}
                                </Dropdown.Item>
                            )
                        )}
                    </DropdownMenu>
                </Dropdown>
                {this.isCalBut() ?
                    <DatePicker
                        isMobile={true}
                        selectedCatalog={this.props.selectedCatalog}
                        selectedDate= {this.props.selectedDate}
                        clickDate={(date) => {
                            this.props.updateOnButtonClick('',this.props.catalog, true, date)
                        }}
                    /> :
                    <Dropdown key={"mobile_button_dropdown_versions"} className="catalogButtons">
                        <Dropdown.Toggle
                            key={"mobile_button_dropdown_versions_toggle"}
                            className="customButton"
                            variant=""
                            type="button"
                            id={"mobile_version_button"}>
                            {this.getVersion()}
                        </Dropdown.Toggle>
                        <Dropdown.Menu className="dropdown">
                            {this.state.allVersions.reverse().map(
                                (version) => (
                                    <Dropdown.Item
                                        className={this.state.availableVersions.includes(version) ? "dropdown-item" : "dropdown-item disabled"}
                                        eventKey={version}
                                        key={"mobile_button_dropdown_versions_" + version}
                                        id={version.replace(/\./g, '')}
                                        onClick={() => {
                                            this.handleVersionClick(version, this.props.catalog)
                                        }}
                                    >{cutCatalogFromVersion(this.props.catalog, version)}</Dropdown.Item>
                                )
                            )}
                        </Dropdown.Menu>
                    </Dropdown>
                }
        </div>
        )
    }
}
export default Button;
