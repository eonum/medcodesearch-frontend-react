import PopUp from "../PopUp/PopUp";
import {Dropdown} from "react-bootstrap";
import DropdownToggle from "react-bootstrap/DropdownToggle";
import DropdownMenu from "react-bootstrap/DropdownMenu";
import {convertCategory, findCategory} from "../../Services/category-version.service";
import React, {Component} from "react";
import CategorysSortService from "../../Services/CategorysSortService";
import BootstrapDatePickerComponent from "./BootstrapDatePickerComponent";

class MobileButton extends Component{
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
    async componentDidUpdate(prevProps: Readonly<P>, prevState: Readonly<S>, snapshot: SS) {
        if(prevProps.language !== this.props.language || prevProps.category !== this.props.category) {
            await this.fetchCurrentVersions()
        }
    }
    async componentDidMount() {
        await this.fetchInitialVersions()
        await this.fetchCurrentVersions()
    }
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

    getLastVersion() {
        let lastVersion = this.state.currentVersions[this.state.currentVersions.length - 1];
        if(lastVersion) {
            return convertCategory(this.props.category, this.state.currentVersions[this.state.currentVersions.length - 1])
        }
        return ""
    }
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
    updatePopUp = (value) => {
        this.setState({showPopUp: value})
    }
    render(){
        let renderCal = this.isCalBut()
        return(
        <div className="d-lg-none">
            <div className="btn-group">
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
                <Dropdown className="catalogButtons">

                    <DropdownToggle className="customButton" type="button" >
                        {this.props.category}
                    </DropdownToggle>
                    <DropdownMenu className="dropdown" >
                        {this.state.buttons.map((category) => (
                                <Dropdown.Item className="dropdown-item" eventKey={category} key={category} onClick={() => {
                                    this.props.chooseC('', category, false, "")
                                }}>
                                    {category}
                                </Dropdown.Item>
                            )
                        )}
                    </DropdownMenu>
                </Dropdown>
                {!renderCal &&
                <Dropdown className="catalogButtons">
                    <Dropdown.Toggle className="customButton" variant="" type="button">
                        {this.getVersion()}
                    </Dropdown.Toggle>
                    <Dropdown.Menu className="dropdown">
                        {this.state.currentVersions.map(
                            (versions) => (
                                <Dropdown.Item
                                    className={this.state.currentVersions.includes(versions) ? "dropdown-item" : "dropdown-item disabled"}
                                    eventKey={versions}
                                    key={versions}
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
                <BootstrapDatePickerComponent
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

    isCalBut() {
        let category = this.props.category;
        if (category === 'AL' || category.toUpperCase() === 'MIGEL' || category === 'DRUGS'){
            return true;
        }else {
            return false;
        }
    }

}
export default MobileButton;