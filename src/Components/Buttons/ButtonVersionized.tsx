import React from "react";
import {Dropdown} from "react-bootstrap";
import PopUp from "../PopUp/PopUp";
import {convertCategory, findCategory} from "../../Services/category-version.service";
import {IUpdateButton, IUpdateStateByArg} from "../../interfaces";

interface Props {
    key: string,
    index: number,
    activate: {(button: string): void},
    category: string
    initialVersions: string[],
    currentVersions:  string[],
    language: string,
    version: string,
    changeLanguage: IUpdateStateByArg,
    changeSelectedVersion: IUpdateStateByArg,
    changeSelectedButton: IUpdateStateByArg,
    selectedVersion: string,
    selectedCategory: string,
    updateVersionizedButton: IUpdateButton
}

export interface IButtonVersionized {
    showPopUp: boolean,
    disabledVersion: string,
    disabledCategory: string,
}

/**
 * Responsible for the buttons with versions.
 * @component
 */
class ButtonVersionized extends React.Component<Props,IButtonVersionized>{
    /**
     * Set the default state values and binds the popup.
     * @param props
     */
    constructor(props) {
        super(props);
        this.state = {
            showPopUp: false,
            disabledVersion: "",
            disabledCategory: "",
        }
        this.changeShowPopUp = this.changeShowPopUp.bind(this);
    }

    /**
     * Changes the current showPopUp with the given boolean value.
     * @param boolean_value
     */
    changeShowPopUp = (boolean_value) => {
        this.setState({showPopUp: boolean_value})
    }

    /**
     * Handles version change when clicking on a button, i.e. sets the selected version, button and date or renders
     * popup for non available versions.
     * @param version
     */
    handleVersionClick(version) {
        const DROPDOWN = document.getElementById(version);
        if(!DROPDOWN.classList.contains('disabled')) {
            this.props.updateVersionizedButton(version)
        } else {
            this.setState({disabledCategory: findCategory(version)})
            this.setState({disabledVersion: version})
            this.setState({showPopUp: true})
        }
    }

    /**
     * looks for the last used version
     * @returns {*|string} last version if it is present
     */
    getLastVersion() {
        if(this.props.currentVersions) {
            let lastVersion = this.props.currentVersions[this.props.currentVersions.length - 1];
            if (lastVersion) {
                return convertCategory(this.props.category, this.props.currentVersions[this.props.currentVersions.length - 1])
            }
        }
        return ""
    }

    /**
     * set the new category
     * @param category
     */
    handleCategoryClick(category) {
        const DROPDOWN = document.getElementById(category);
        if(!DROPDOWN.classList.contains('disabled')) {
            this.props.activate(category);
        } else {
            this.setState({showPopUp: true})
            this.setState({disabledCategory: category})
            this.setState({disabledVersion: this.props.initialVersions[this.props.initialVersions.length-1]})
        }
    }

    /**
     * looks for old versions
     * @returns {string} classname of the button
     */
    getClassName() {
        let classname = "customButton"
        if(this.props.category === this.props.selectedCategory) {
            classname += " activeCatalog"
        }
        if(this.props.currentVersions && this.props.currentVersions.length === 0) {
            classname += " disabled"
        }
        return classname
    }

    /**
     * looks for the current version
     * @returns {*|string} currently used version
     */
    getVersion() {
        let lastVersion = this.getLastVersion()
        if(lastVersion === "") {
            return lastVersion
        }
        if(this.props.version === this.props.selectedVersion) {
            return convertCategory(this.props.category, this.props.selectedVersion)
        } else {
            return convertCategory(this.props.category, this.props.version)
        }
    }

    /**
     * renders the buttons with versions
     * @returns {JSX.Element}
     */
    render() {
        let dropdown;
        if(this.props.initialVersions && this.props.currentVersions) {
            dropdown = <Dropdown.Menu className="dropdown">
                {this.props.initialVersions.reverse().map(
                    (versions) => (
                        <Dropdown.Item
                            className={this.props.currentVersions.includes(versions) ? "dropdown-item" : "dropdown-item disabled"}
                            eventKey={versions}
                            key={"button_versionized_" + this.props.category + "_drop_down_" + versions}
                            id={versions}
                            onClick={() => {
                                this.handleVersionClick(versions)
                            }}
                        >{convertCategory(this.props.category, versions)}</Dropdown.Item>
                    )
                )}
            </Dropdown.Menu>
        }
        return (
            <div key={"button_versionized"}>
                {<PopUp
                    language={this.props.language}
                    changeLanguage={this.props.changeLanguage}
                    selectedVersion={this.props.changeSelectedVersion}
                    selectedCategory={this.props.changeSelectedButton}
                    show={this.state.showPopUp}
                    updatePopUpState={this.changeShowPopUp}
                    version={this.state.disabledVersion}
                    category={this.state.disabledCategory}
                />}
                <Dropdown className="catalogButtons d-none d-lg-block">
                    <button 
                        type="button"
                        id={this.props.category}
                        key={"button_versionized_" + this.props.category + "_button"}
                        title={this.props.category}
                        onClick={(e) => {
                            this.handleCategoryClick(this.props.category)
                        }}
                        className={this.getClassName()}
                        >
                        {this.props.category}
                    </button>
                    <Dropdown.Toggle
                        className="customButton"
                        id={"button_versionized"}
                        type="button"
                        variant=""
                        key={"button_versionized_" + this.props.category + "_drop_down"
                    }>
                        {this.getVersion()}
                    </Dropdown.Toggle>
                    {dropdown}
                </Dropdown>
            </div>
        )
    }
}

export default ButtonVersionized
