import React from "react";
import {Dropdown} from "react-bootstrap";
import PopUp from "../PopUp/PopUp";
import {cutCatalogFromVersion, findCatalog} from "../../Services/catalog-version.service";
import {IUpdateButton, IUpdateStateByArg} from "../../interfaces";

interface Props {
    key: string,
    index: number,
    clickButton: {(button: string): void},
    button: string
    initialVersions: string[],
    currentVersions:  string[],
    language: string,
    version: string,
    changeLanguage: IUpdateStateByArg,
    changeSelectedVersion: IUpdateStateByArg,
    changeSelectedButton: IUpdateStateByArg,
    selectedVersion: string,
    selectedButton: string,
    updateOnButtonClick: IUpdateButton
}

export interface IButtonVersionized {
    showPopUp: boolean,
    disabledVersion: string,
    disabledCatalog: string,
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
            disabledCatalog: "",
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
        const dropDown = document.getElementById(version.replace(/\./g, ''));
        if(!dropDown.classList.contains('disabled')) {
            this.props.updateOnButtonClick(version)
        } else {
            this.setState({disabledCatalog: findCatalog(version)})
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
                return cutCatalogFromVersion(this.props.button, this.props.currentVersions[this.props.currentVersions.length - 1])
            }
        }
        return ""
    }

    /**
     * set the new catalog
     * @param catalog
     */
    handleCatalogButtonClick(catalog) {
        const dropDown = document.getElementById(catalog);
        if(!dropDown.classList.contains('disabled')) {
            this.props.clickButton(catalog);
        } else {
            this.setState({showPopUp: true})
            this.setState({disabledCatalog: catalog})
            this.setState({disabledVersion: this.props.initialVersions[this.props.initialVersions.length-1]})
        }
    }

    /**
     * looks for old versions
     * @returns {string} classname of the button
     */
    getClassName() {
        let classname = "customButton"
        if(this.props.button === this.props.selectedButton) {
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
            return cutCatalogFromVersion(this.props.button, this.props.selectedVersion)
        } else {
            return cutCatalogFromVersion(this.props.button, this.props.version)
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
                    (version) => (
                        <Dropdown.Item
                            className={this.props.currentVersions.includes(version) ? "dropdown-item" : "dropdown-item disabled"}
                            eventKey={version}
                            key={"button_versionized_" + this.props.button + "_drop_down_" + version}
                            id={version.replace(/\./g, '')}
                            onClick={() => {
                                this.handleVersionClick(version)
                            }}
                        >{cutCatalogFromVersion(this.props.button, version)}</Dropdown.Item>
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
                    changeSelectedButton={this.props.changeSelectedButton}
                    show={this.state.showPopUp}
                    updatePopUpState={this.changeShowPopUp}
                    version={this.state.disabledVersion}
                    catalog={this.state.disabledCatalog}
                />}
                <Dropdown className="catalogButtons d-none d-lg-block">
                    <button 
                        type="button"
                        id={this.props.button}
                        key={"button_versionized_" + this.props.button + "_button"}
                        title={this.props.button}
                        onClick={(e) => {
                            this.handleCatalogButtonClick(this.props.button)
                        }}
                        className={this.getClassName()}
                        >
                        {this.props.button}
                    </button>
                    <Dropdown.Toggle
                        className="customButton"
                        id={this.props.button + "_version_button"}
                        type="button"
                        variant=""
                        key={"button_versionized_" + this.props.button + "_drop_down"
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
