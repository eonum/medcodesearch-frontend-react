import PopUp from "../PopUp/PopUp";
import {Dropdown} from "react-bootstrap";
import DropdownToggle from "react-bootstrap/DropdownToggle";
import DropdownMenu from "react-bootstrap/DropdownMenu";
import {convertCategory, findCategory} from "../../Services/category-version.service";
import React, {Component} from "react";
import CategorysSortService from "../../Services/CategorysSortService";
import DatePicker from "./DatePicker";

/**
 * creates the button for the mobile version
 * @component
 */
class MobileButton extends Component{

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
            buttons: [this.props.buttons[0][0],this.props.buttons[0][1],this.props.buttons[0][2],this.props.buttons[0][3],this.props.buttons[1][0],this.props.buttons[1][1],this.props.buttons[1][2]]
        }
        this.updatePopUp = this.updatePopUp.bind(this);
    }

    /**
     * after update of the component calls the fetch
     * @param prevProps
     * @param prevState
     * @param snapshot
     * @returns {Promise<void>}
     */
    async componentDidUpdate(prevProps: Readonly<P>, prevState: Readonly<S>, snapshot: SS) {
        if(prevProps.language !== this.props.language || prevProps.category !== this.props.category) {
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
        const dropdown = document.getElementById(version);
        if(!dropdown.classList.contains('disabled')) {
            this.props.chooseC(version, btn)
        } else {
            this.setState({disabledCategory: findCategory(version)})
            this.setState({disabledVersion: version})
            this.setState({showPopUp: true})
        }
    }

    /**
     * fetches the first version
     * @returns {Promise<void>}
     */
    async fetchInitialVersions() {
        if (!this.isCalBut()) {
            if (this.props.category === "SwissDRG") {
                await fetch(`https://search.eonum.ch/de/drgs/versions`)
                    .then((res) => res.json())
                    .then((json) => {
                        this.setState({
                            allVersions: CategorysSortService(json),
                            currentVersions: CategorysSortService(json)
                        })
                    })
            } else {
                await fetch(`https://search.eonum.ch/de/` + this.props.category.toLowerCase() + `s/versions`)
                    .then((res) => res.json())
                    .then((json) => {
                        this.setState({
                            allVersions: CategorysSortService(json),
                            currentVersions: CategorysSortService(json)
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
                await fetch(`https://search.eonum.ch/` + this.props.language + `/drgs/versions`)
                    .then((res) => res.json())
                    .then((json) => {
                        this.setState({currentVersions: CategorysSortService(json)})
                    })
            } else {
                await fetch(`https://search.eonum.ch/` + this.props.language + `/` + this.props.category.toLowerCase() + `s/versions`)
                    .then((res) => res.json())
                    .then((json) => {
                        this.setState({currentVersions: CategorysSortService(json)})
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
    getLastVersion() {
        let lastVersion = this.state.currentVersions[this.state.currentVersions.length - 1];
        if(lastVersion) {
            return convertCategory(this.props.category, this.state.currentVersions[this.state.currentVersions.length - 1])
        }
        return ""
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
        if (category === 'AL' || category.toUpperCase() === 'MIGEL' || category === 'DRUG'){
            return true;
        }else {
            return false;
        }
    }

    /**
     * renders the mobile button
     * @returns {JSX.Element}
     */
    render(){
        let renderCal = this.isCalBut()
        return(
        <div key={"mobileButton div 0"} className="d-lg-none text-center">
            <div key={"mobileButton div 1"} className="btn-group">
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
                <Dropdown key={"mobileButton dropdown catalog"} className="catalogButtons">
                    <DropdownToggle key={"mobileButton dropdown catalog toggle"} className="customButton" type="button" >
                        {this.props.category}
                    </DropdownToggle>
                    <DropdownMenu className="dropdown" >
                        {this.state.buttons.map((category) => (
                                <Dropdown.Item className="dropdown-item"
                                               eventKey={category} key={"mobileButton dropdown catalog " + category}
                                               onClick={() => {
                                    this.props.chooseC('', category, false, "")
                                }}>
                                    {category}
                                </Dropdown.Item>
                            )
                        )}
                    </DropdownMenu>
                </Dropdown>
                {!renderCal &&
                <Dropdown key={"mobileButton dropdown versions"} className="catalogButtons">
                    <Dropdown.Toggle key={"mobileButton dropdown verisions toggle"} className="customButton" variant="" type="button">
                        {this.getVersion()}
                    </Dropdown.Toggle>
                    <Dropdown.Menu className="dropdown">
                        {this.state.allVersions.map(
                            (versions) => (
                                <Dropdown.Item
                                    className={this.state.currentVersions.includes(versions) ? "dropdown-item" : "dropdown-item disabled"}
                                    eventKey={versions}
                                    key={"mobileButton dropdown versions " + versions}
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
                    activeDate = {this.props.date}
                    setDate={(date) => {
                        this.props.chooseC('',this.props.selectedButton, true, date)
                    }}
                />
                }
            </div>
        </div>
        )
    }

}
export default MobileButton;
