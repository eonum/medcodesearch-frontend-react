import React, {Component, useState} from "react";
import {Button, Dropdown, Modal} from "react-bootstrap";
import CategorysSortService from "../../Services/CategorysSortService";
import { ButtonGroup} from "react-bootstrap";
import {isDisabled} from "@testing-library/user-event/dist/utils";
import PopUp from "../PopUp/PopUp";
import {convertCategory, findCategory} from "../../Services/category-version.service";

class ButtonVersion extends Component{

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
    updatePopUp = (value) => {
        this.setState({showPopUp: value})
    }

    async componentDidUpdate(prevProps: Readonly<P>, prevState: Readonly<S>, snapshot: SS) {
        if(prevProps.language !== this.props.language) {
            await this.fetchCurrentVersions()
        }
    }

    async componentDidMount() {
        await this.fetchInitialVersions()
        await this.fetchCurrentVersions()
    }

    async fetchInitialVersions() {
        if (this.props.category === "SwissDRG") {
            await fetch(`https://search.eonum.ch/de/drgs/versions`)
                .then((res) => res.json())
                .then((json) => {
                    this.setState({allVersions: json, currentVersions: json})
                })
        } else {
            await fetch(`https://search.eonum.ch/de/` + this.props.category.toLowerCase() + `s/versions`)
                .then((res) => res.json())
                .then((json) => {
                    this.setState({allVersions: CategorysSortService(json), currentVersions: CategorysSortService(json)})
                })
        }
    }

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

    render() {
        return (
            <div>
                <PopUp
                    language={this.props.language}
                    show={this.state.showPopUp}
                    updateValue={this.updatePopUp}
                    version={this.state.disabledVersion}
                    category={this.state.disabledCategory}
                />
                <Dropdown as={ButtonGroup} className="catalogButtons">
                    <button 
                        type="button"
                        id={this.props.category === this.props.selectedCategory ? "activeCatalog" : ""}
                        key={this.props.category + "" + this.props.index}
                        title={this.props.category}
                        onClick={(e) => {
                            this.props.activate(this.props.category);
                        }}
                        className="customButton"
                        >
                        {this.props.category}
                    </button>
                    <Dropdown.Toggle className="customButton" variant="" type="button">
                        {this.props.version === this.props.selectedVersion ? convertCategory(this.props.category, this.props.selectedVersion) : convertCategory(this.props.category, this.props.version)}
                    </Dropdown.Toggle>
                    <Dropdown.Menu className="dropdown">
                        {this.state.allVersions.reduceRight(function (arr, last, index, coll) {return (arr = arr.concat(last))},[]).map(
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
        )
    }
}

export default ButtonVersion
