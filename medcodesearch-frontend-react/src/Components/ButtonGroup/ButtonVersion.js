import React from "react";
import {ButtonGroup, Dropdown} from "react-bootstrap";
import CategorysSortService from "../../Services/CategorysSortService";
import PopUp from "../PopUp/PopUp";
import {convertCategory, findCategory} from "../../Services/category-version.service";
import DropdownToggle from "react-bootstrap/DropdownToggle";
import DropdownMenu from "react-bootstrap/DropdownMenu";

/**
 * is responsible for the buttons with versions
 * @component
 */
class ButtonVersion extends React.Component{

    /**
     *  sets the default state values and bind the popup
     * @param props
     */
    constructor(props) {
        super(props);
        this.state = {
            allVersions:[],
            currentVersions: [],
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
     * after update of the component calls the fetch
     * @param prevProps
     * @param prevState
     * @param snapshot
     * @returns {Promise<void>}
     */
    async componentDidUpdate(prevProps: Readonly<P>, prevState: Readonly<S>, snapshot: SS) {
        if(prevProps.language !== this.props.language) {
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
     * fetches the first version
     * @returns {Promise<void>}
     */
    async fetchInitialVersions() {
        if (this.props.category === "SwissDRG") {
            await fetch(`https://search.eonum.ch/de/drgs/versions`)
                .then((res) => res.json())
                .then((json) => {
                    this.setState({allVersions: CategorysSortService(json), currentVersions: CategorysSortService(json)})
                })
        } else {
            await fetch(`https://search.eonum.ch/de/` + this.props.category.toLowerCase() + `s/versions`)
                .then((res) => res.json())
                .then((json) => {
                    this.setState({allVersions: CategorysSortService(json), currentVersions: CategorysSortService(json)})
                })
        }
    }

    /**
     * fetches the current versions
     * @returns {Promise<void>}
     */
    async fetchCurrentVersions() {
        if (this.props.category === "SwissDRG") {
            await fetch(`https://search.eonum.ch/` + this.props.language + `/drgs/versions`)
                .then((res) => res.json())
                .then((json) => {
                    this.setState({currentVersions: json})
                })
        } else {
            await fetch(`https://search.eonum.ch/` + this.props.language + `/` + this.props.category.toLowerCase() + `s/versions`)
                .then((res) => res.json())
                .then((json) => {
                    this.setState({currentVersions: CategorysSortService(json)})
                })
        }
    }

    /**
     * set the new version and button
     * @param version
     * @param btn
     */
    handleVersionClick(version) {
        const dropdown = document.getElementById(version);
        if(!dropdown.classList.contains('disabled')) {
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
        let lastVersion = this.state.currentVersions[this.state.currentVersions.length - 1];
        if(lastVersion) {
            return convertCategory(this.props.category, this.state.currentVersions[this.state.currentVersions.length - 1])
        }
        return ""
    }

    /**
     * set the new category
     * @param category
     */
    handleCategoryClick(category) {
        const dropdown = document.getElementById(category);
        if(!dropdown.classList.contains('disabled')) {
            this.props.activate(category);
        } else {
            this.setState({showPopUp: true})
            this.setState({disabledCategory: category})
            this.setState({disabledVersion: this.state.allVersions[this.state.allVersions.length-1]})
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
        if(this.state.currentVersions.length === 0) {
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
        return (
            <div key={"buttonVersion div 0"}>
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
                <Dropdown accessKey={"buttonversion dropdown"} className="catalogButtons d-none d-lg-block">
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
                    <Dropdown.Menu accessKey={"buttonversion dropdown menu for versions"} className="dropdown">
                        {this.state.allVersions.reduceRight(function (arr, last, index, coll) {return (arr = arr.concat(last))},[]).map(
                            (versions) => (
                                <Dropdown.Item className={this.state.currentVersions.includes(versions) ? "dropdown-item" : "dropdown-item disabled"}
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
                </Dropdown>
            </div>
        )
    }
}

export default ButtonVersion
