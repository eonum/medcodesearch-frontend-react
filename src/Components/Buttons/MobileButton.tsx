import PopUp from "../PopUp/PopUp";
import {Dropdown} from "react-bootstrap";
import DropdownToggle from "react-bootstrap/DropdownToggle";
import DropdownMenu from "react-bootstrap/DropdownMenu";
import {convertCategory, findCategory} from "../../Services/category-version.service";
import React, {Component} from "react";
import CategorySortService from "../../Services/category-sort.service";
import DatePicker from "./DatePicker";
import {IVersions, IButtonLabels} from "../../interfaces";
import {fetchURL} from "../../Utils";

interface Props {
    selectedCatalog: string
    initialVersions: IVersions,
    currentVersions: IVersions,
    date: string,
    version: string,
    selectedVersion: string,
    reRender: boolean,
    category: string,
    language: string,
    selectedLanguage: any,
    updateVersion: any,
    updateCategory: any,
    buttons: IButtonLabels,
    labels: string[],
    chooseC: any
}

export interface IMobileButton {
    showPopUp: boolean,
    disabledVersion: string,
    disabledCategory: string,
    allVersions: string[], // all versions of one catalog in an array, f.e. ["CHOP_2011", "CHOP_2012", ...]
    currentVersions: any,
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
            disabledCategory: "",
            allVersions: [],
            currentVersions: [],
            buttons: this.convertButtons(),
            selectedButton: this.props.category
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
        if(prevProps.language !== this.props.language || prevProps.category !== this.props.category
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
            this.props.chooseC(version, btn)
        } else {
            this.setState({disabledCategory: findCategory(version)})
            this.setState({showPopUp: true})
            this.setState({disabledVersion: version})
        }

    }

    /**
     * If a category get clicked update the state
     * @param category
     */
    handleCategoryClick(category) {
        const CAT = document.getElementById(category);
        if(!CAT.classList.contains('disabled')) {
            this.props.chooseC('', category, false, "")
        } else {
            this.setState({disabledCategory: category})
            this.setState({showPopUp: true})
            if(category === "MiGeL" || category === "AL" || category === "DRUG") {
                this.setState({disabledVersion: ""})
            } else {
                this.setState({disabledVersion: this.getLastVersion(category)})
            }
        }
    }

    /**
     * fetches the first version
     * @returns {Promise<void>}
     */
    async fetchInitialVersions() {
        if (!this.isCalBut()) {
            if (this.props.category === "SwissDRG") {
                await fetch([fetchURL, '/de/drgs/versions'].join("/"))
                    .then((res) => res.json())
                    .then((json) => {
                        this.setState({
                            allVersions: CategorySortService(json),
                            currentVersions: CategorySortService(json)
                        })
                    })
            } else {
                await fetch([fetchURL, 'de', this.props.category.toLowerCase() + 's' ,'versions'].join("/"))
                    .then((res) => res.json())
                    .then((json) => {
                        this.setState({
                            allVersions: CategorySortService(json),
                            currentVersions: CategorySortService(json)
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
            if (this.props.category === "SwissDRG") {
                await fetch([fetchURL, this.props.language, 'drgs/versions'].join("/"))
                    .then((res) => res.json())
                    .then((json) => {
                        this.setState({currentVersions: CategorySortService(json)})
                    })
            } else {
                await fetch([fetchURL, this.props.language, this.props.category.toLowerCase() + 's', 'versions'].join("/"))
                    .then((res) => res.json())
                    .then((json) => {
                        this.setState({currentVersions: CategorySortService(json)})
                    })
            }
        }else {
            this.setState({currentVersions: []})
        }
    }

    /**
     * looks for the last used version
     * @returns {*|string} last version if it is present
     */
    getLastVersion(category) {
        switch (category) {
            case "ICD":
                return "ICD-GM-2022"
            case "CHOP":
                return "CHOP_2022"
            case "TARMED":
                return "TARMED_01.09"
            case "SwissDRG":
                return "V11.0"
        }
    }

    /**
     * looks for the current version
     * @returns {*|string} currently used version
     */
    getVersion() {
        if(this.props.selectedVersion) {
            return convertCategory(this.props.category, this.props.selectedVersion)
        } else {
            return convertCategory(this.props.category, this.props.version)
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
     * looks if the category uses a calendar
     * @returns {boolean} if calender is needed or not
     */
    isCalBut() {
        let category = this.props.category;
        return category === 'AL' || category.toUpperCase() === 'MIGEL' || category === 'DRUG';
    }

    /**
     * converts a category into a label so that it shows buttons with calendars in the correct language
     * only used for the selected button
     * @returns label
     */
    convertToLabel() {
        if(this.props.category === "SwissDRG" || this.props.category === "ICD" || this.props.category === "CHOP" || this.props.category === "TARMED"){
            return this.props.category;
        }
        else{
            if(this.props.category.toUpperCase() === "MIGEL"){
                return this.props.labels[0];
            }
            else if(this.props.category.toUpperCase() === "AL"){
                return this.props.labels[1];
            }
            else{
                return this.props.labels[2];
            }
        }
    }

    /**
     * converts a category into a label so that it shows buttons with calendars in the correct language, depends on the index
     * @returns label
     */
    extractLabels(category, index) {
        if (category === 'AL' || category.toUpperCase() === 'MIGEL' || category === 'DRUG'){
            return this.props.labels[index-4];
        }
        else {
            return category;
        }
    }

    /**
     * Returns the class name
     * @param category
     * @returns {string}
     */
    getClassName(category) {
        let name = "dropdown-item"
        if(this.props.language === "en" && category !== "ICD") {
            name += " disabled"
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
        <div key={"mobile_button_0"} className="d-lg-none text-center">
            <div key={"mobile_button_1"} className="btn-group">
                {
                    <PopUp
                        language={this.props.language}
                        selectedLanguage={this.props.selectedLanguage}
                        selectedVersion={this.props.updateVersion}
                        selectedCategory={this.props.updateCategory}
                        show={this.state.showPopUp}
                        updateValue={this.updatePopUp}
                        version={this.state.disabledVersion}
                        category={this.state.disabledCategory}
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
                        {this.state.buttons.map((btn, index) => (
                                <Dropdown.Item className={this.getClassName(btn)}
                                               eventKey={btn}
                                               key={"mobile_button_dropdown_catalog_" + btn}
                                               id={btn}
                                               onClick={() => {
                                    this.handleCategoryClick(btn)
                                }}>
                                    {this.extractLabels(btn, index)}
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
                            (versions) => (
                                <Dropdown.Item
                                    className={this.state.currentVersions.includes(versions) ? "dropdown-item" : "dropdown-item disabled"}
                                    eventKey={versions}
                                    key={"mobile_button_dropdown_versions_" + versions}
                                    id={versions}
                                    onClick={() => {
                                        this.handleVersionClick(versions, this.props.category)
                                    }}
                                >{convertCategory(this.props.category, versions)}</Dropdown.Item>
                            )
                        )}
                    </Dropdown.Menu>
                </Dropdown>
                }
                {renderCal &&
                <DatePicker
                    isMobile={true}
                    selectedCatalog={this.props.selectedCatalog}
                    activeDate = {this.props.date}
                    setDate={(date) => {
                        this.props.chooseC('',this.props.category, true, date)
                    }}
                />
                }
            </div>
        </div>
        )
    }
}
export default MobileButton;
