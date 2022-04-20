import React, {Component, useState} from "react";
import {Button, Dropdown, Modal} from "react-bootstrap";
import CategorysSortService from "../../Services/CategorysSortService";
import { ButtonGroup} from "react-bootstrap";
import {isDisabled} from "@testing-library/user-event/dist/utils";
import PopUp from "../PopUp/PopUp";
import {convertCategory, findCategory} from "../../Services/category-version.service";

class ButtonVersion extends React.Component{

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

    getLastVersion() {
        let lastVersion = this.state.currentVersions[this.state.currentVersions.length - 1];
        if(lastVersion) {
            return convertCategory(this.props.category, this.state.currentVersions[this.state.currentVersions.length - 1])
        }
        return ""
    }

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

    render() {
        return (
            <div>
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
                <Dropdown as={ButtonGroup} className="catalogButtons">
                    <button
                        type="button"
                        id={this.props.category}
                        key={this.props.category + "" + this.props.index}
                        title={this.props.category}
                        onClick={(e) => {
                            this.handleCategoryClick(this.props.category)
                        }}
                        className={this.getClassName()}
                        >
                        {this.props.category}
                    </button>
                    <Dropdown.Toggle className="customButton" variant="" type="button">
                        {this.getVersion()}
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
