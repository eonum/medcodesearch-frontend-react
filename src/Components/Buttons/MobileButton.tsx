import PopUp from "../PopUp/PopUp";
import {Dropdown} from "react-bootstrap";
import DropdownToggle from "react-bootstrap/DropdownToggle";
import DropdownMenu from "react-bootstrap/DropdownMenu";
import {cutCatalogFromVersion, findCatalog} from "../../Services/catalog-version.service";
import React, {Component} from "react";
import DatePicker from "./DatePicker";
import {IVersions, IButtonLabels, IUpdateStateByArg, IUpdateButton, IUnversionizedLabels} from "../../interfaces";
import {fetchURL} from "../../Utils";

interface Props {
    selectedCatalog: string
    initialVersions: IVersions,
    currentVersions: IVersions,
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

export interface IMobileButton {
    showPopUp: boolean,
    disabledVersion: string,
    disabledCatalog: string,
    allVersions: string[], // all versions of one catalog in an array, f.e. ["CHOP_2011", "CHOP_2012", ...]
    currentVersions: string[],
    buttons: string[],
    selectedButton: string
}

/**
 * creates the button for the mobile version
 * @component
 */
class MobileButton extends Component<Props,IMobileButton>{

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
            currentVersions: [],
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
     * after update of the component calls the fetch
     * @param prevProps
     * @param prevState
     * @param snapshot
     * @returns {Promise<void>}
     */
    async componentDidUpdate(prevProps, prevState, snapshot) {
        if(prevProps.language !== this.props.language || prevProps.catalog !== this.props.catalog
            || this.props.reRender) {
            await this.fetchInitialVersions()
            await this.fetchCurrentVersions()
        }
    }

    /**
     * after mount initialize the fetch for content and version
     * @returns {Promise<void>}
     */
    async componentDidMount() {
        await this.fetchInitialVersions()
        await this.fetchCurrentVersions()
    }

    /**
     * set the new version and button
     * @param version
     * @param btn
     */
    handleVersionClick(version, btn) {
        const DROPDOWN = document.getElementById(version);
        if(!DROPDOWN.classList.contains('disabled')) {
            this.props.updateOnButtonClick(version, btn)
        } else {
            this.setState({disabledCatalog: findCatalog(version)})
            this.setState({showPopUp: true})
            this.setState({disabledVersion: version})
        }

    }

    /**
     * Update state if a catalog get clicked.
     * @param catalog
     */
    handleCatalogClick(catalog) {
        const CAT = document.getElementById(catalog);
        if(!CAT.classList.contains('disabled')) {
            this.props.updateOnButtonClick('', catalog, false, "")
        } else {
            this.setState({disabledCatalog: catalog})
            this.setState({showPopUp: true})
            if(catalog === "MiGeL" || catalog === "AL" || catalog === "DRUG") {
                this.setState({disabledVersion: ""})
            } else {
                this.setState({disabledVersion: this.props.initialVersions[catalog].at(-1)})
            }
        }
    }

    /**
     * fetches the first version
     * @returns {Promise<void>}
     */
    async fetchInitialVersions() {
        if (!this.isCalBut()) {
            if (this.props.catalog === "SwissDRG") {
                await fetch([fetchURL, '/de/drgs/versions'].join("/"))
                    .then((res) => res.json())
                    .then((json) => {
                        this.setState({
                            allVersions: json,
                            currentVersions: json
                        })
                    })
            } else {
                await fetch([fetchURL, 'de', this.props.catalog.toLowerCase() + 's' ,'versions'].join("/"))
                    .then((res) => res.json())
                    .then((json) => {
                        this.setState({
                            allVersions: json,
                            currentVersions: json
                        })
                    })
            }
        }else {
            this.setState({allVersions: [], currentVersions: []})
        }
    }

    /**
     * fetches the current versions
     * @returns {Promise<void>}
     */
    async fetchCurrentVersions() {
        if (!this.isCalBut()) {
            if (this.props.catalog === "SwissDRG") {
                await fetch([fetchURL, this.props.language, 'drgs/versions'].join("/"))
                    .then((res) => res.json())
                    .then((json) => {
                        this.setState({currentVersions: json})
                    })
            } else {
                await fetch([fetchURL, this.props.language, this.props.catalog.toLowerCase() + 's', 'versions'].join("/"))
                    .then((res) => res.json())
                    .then((json) => {
                        this.setState({currentVersions: json})
                    })
            }
        }else {
            this.setState({currentVersions: []})
        }
    }

    /**
     * looks for the current version
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
     * updates the current showPopUp with the given value
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
        let catalog = this.props.catalog;
        return catalog === 'AL' || catalog.toUpperCase() === 'MIGEL' || catalog === 'DRUG'
    }

    /**
     * Converts a catalog into a label, s.t. buttons with calendars are displayed in correct language.
     * Only used for the selected button.
     * @returns label
     */
    convertToLabel() {
        if(this.props.catalog === "SwissDRG" || this.props.catalog === "ICD" || this.props.catalog === "CHOP" || this.props.catalog === "TARMED"){
            return this.props.catalog;
        }
        else{
            return this.props.labels[this.props.catalog.toUpperCase()]
        }
    }

    /**
     * Extracts label by button s.t. buttons with calendars are displayed in the correct language.
     * @returns label
     */
    extractLabel(btn) {
        return ["AL", "MIGEL", "DRUG"].includes(btn.toUpperCase()) ? this.props.labels[btn.toUpperCase()] : btn
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
     * renders the mobile button
     * @returns {JSX.Element}
     */
    render(){
        let renderCal = this.isCalBut()
        return(
        <div key={"mobile_button"} className="d-lg-none text-center">
            <div key={"mobile_button_0"} className="btn-group">
                {
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
                }
                <Dropdown key={"mobile_button_dropdown_catalog"} className="catalogButtons">
                    <DropdownToggle
                        key={"mobile_button_dropdown_catalog_toggle"}
                        className="customButton"
                        variant=""
                        type="button"
                        id={"mobile_button_catalog"}>
                        {this.convertToLabel()}
                    </DropdownToggle>
                    <DropdownMenu className="dropdown" >
                        {this.state.buttons.map((btn) => (
                                <Dropdown.Item className={this.getClassName(btn)}
                                               eventKey={btn}
                                               key={"mobile_button_dropdown_catalog_" + btn}
                                               id={btn}
                                               onClick={() => {
                                    this.handleCatalogClick(btn)
                                }}>
                                    {this.extractLabel(btn)}
                                </Dropdown.Item>
                            )
                        )}
                    </DropdownMenu>
                </Dropdown>
                {!renderCal &&
                <Dropdown key={"mobile_button_dropdown_versions"} className="catalogButtons">
                    <Dropdown.Toggle
                        key={"mobile_button_dropdown_versions_toggle"}
                        className="customButton"
                        variant=""
                        type="button"
                        id={"mobile_button_version"}>
                        {this.getVersion()}
                    </Dropdown.Toggle>
                    <Dropdown.Menu className="dropdown">
                        {this.state.allVersions.reverse().map(
                            (version) => (
                                <Dropdown.Item
                                    className={this.state.currentVersions.includes(version) ? "dropdown-item" : "dropdown-item disabled"}
                                    eventKey={version}
                                    key={"mobile_button_dropdown_versions_" + version}
                                    id={version}
                                    onClick={() => {
                                        this.handleVersionClick(version, this.props.catalog)
                                    }}
                                >{cutCatalogFromVersion(this.props.catalog, version)}</Dropdown.Item>
                            )
                        )}
                    </Dropdown.Menu>
                </Dropdown>
                }
                {renderCal &&
                <DatePicker
                    isMobile={true}
                    selectedCatalog={this.props.selectedCatalog}
                    selectedDate= {this.props.selectedDate}
                    clickDate={(date) => {
                        this.props.updateOnButtonClick('',this.props.catalog, true, date)
                    }}
                />
                }
            </div>
        </div>
        )
    }
}
export default MobileButton;
