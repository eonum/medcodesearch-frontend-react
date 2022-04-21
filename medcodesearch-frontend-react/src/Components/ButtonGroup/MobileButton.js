import PopUp from "../PopUp/PopUp";
import {Dropdown} from "react-bootstrap";
import DropdownToggle from "react-bootstrap/DropdownToggle";
import DropdownMenu from "react-bootstrap/DropdownMenu";
import {convertCategory} from "../../Services/category-version.service";
import React, {Component} from "react";

class MobileButton extends Component{
    constructor(props) {
        super(props);
        this.state={
            showPopUp: false,
            disabledVersion: "",
            disabledCategory: "",
            currentVersions: [],
            buttons: [this.props.buttons[0][0],this.props.buttons[0][1],this.props.buttons[0][2],this.props.buttons[0][3],this.props.buttons[1][0],this.props.buttons[1][1],this.props.buttons[1][2]]
        }
        this.updatePopUp = this.updatePopUp.bind(this);

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
                                    this.props.chooseC(category, false, "")
                                }}>
                                    {category}
                                </Dropdown.Item>
                            )
                        )}
                    </DropdownMenu>
                </Dropdown>


                <Dropdown className="catalogButtons">
                    <Dropdown.Toggle className="customButton" variant="" type="button" >
                        {this.getVersion()}
                    </Dropdown.Toggle>
                    <Dropdown.Menu className="dropdown">
                        {this.state.buttons.reduceRight(function (arr, last, index, coll) {return (arr = arr.concat(last))},[]).map(
                            (versions) => (
                                <Dropdown.Item className={this.state.currentVersions.includes(versions) ? "dropdown-item" : "dropdown-item disabled"}
                                               eventKey={versions}
                                               key={versions}
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

        </div>
        )
    }
}
export default MobileButton;