import React from "react";
import {Dropdown} from "react-bootstrap";
import PopUp from "../PopUp/PopUp";
import {convertCategory, findCategory} from "../../Services/category-version.service";

interface Props {
    key: string,
    index: number,
    activate: any,
    category: string
    initialVersions: string[],
    currentVersions:  string[],
    language: string,
    version: string,
    selectedLanguage: any,
    updateVersion: any,
    updateCategory: any,
    selectedVersion: string,
    selectedCategory: string,
    chooseV: any
}

export interface IButtonVersion {
    showPopUp: boolean,
    disabledVersion: string,
    disabledCategory: string,
}

/**
 * is responsible for the buttons with versions
 * @component
 */
class ButtonVersion extends React.Component<Props,IButtonVersion>{

    /**
     *  sets the default state values and bind the popup
     * @param props
     */
    constructor(props) {
        super(props);
        this.state = {
            showPopUp: false,
            disabledVersion: "",
            disabledCategory: "",
        }
        this.updatePopUp = this.updatePopUp.bind(this);
    }

    /**
     * updates the current showPopUp with the given value
     * @param value
     */
    updatePopUp = (value) => {
        this.setState({showPopUp: value})
    }

    /**
     * set the new version and button
     * @param version
     * @param btn
     */
    handleVersionClick(version) {
        const DROPDOWN = document.getElementById(version);
        if(!DROPDOWN.classList.contains('disabled')) {
            this.props.chooseV(version)
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
                            key={"buttonversion " + this.props.category + " DropDown " + versions}
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
            <div key={"buttonVersion div 0"}>
                {<PopUp
                    language={this.props.language}
                    selectedLanguage={this.props.selectedLanguage}
                    selectedVersion={this.props.updateVersion}
                    selectedCategory={this.props.updateCategory}
                    show={this.state.showPopUp}
                    updateValue={this.updatePopUp}
                    version={this.state.disabledVersion}
                    category={this.state.disabledCategory}
                />}
                <Dropdown className="catalogButtons d-none d-lg-block">
                    <button 
                        type="button"
                        id={this.props.category}
                        key={"buttonversion " + this.props.category + "-button"}
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
                        id={"buttonversion"}
                        type="button"
                        variant=""
                        key={"buttonversion " + this.props.category + " DropDown"
                    }>
                        {this.getVersion()}
                    </Dropdown.Toggle>
                    {dropdown}
                </Dropdown>
            </div>
        )
    }
}

export default ButtonVersion
