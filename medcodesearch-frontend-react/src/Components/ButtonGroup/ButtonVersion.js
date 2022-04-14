import React, {Component} from "react";
import {Dropdown, DropdownButton} from "react-bootstrap";
import CategorysSortService from "../../Services/CategorysSortService";
import ConvertCategoryService from "../../Services/convertCategory.service";
import { ButtonGroup} from "react-bootstrap";
import DropdownToggle from "react-bootstrap/DropdownToggle";
import DropdownMenu from "react-bootstrap/DropdownMenu";

class ButtonVersion extends React.Component{

    constructor(props) {
        super(props);
        this.state = {
            allVersions:[],
            currentVersions: [],
            allCategory: ["ICD","CHOP", "SwissDRG", "TARMED", "MiGeL", "AL", "DRUG"],
        }
    }

    componentDidUpdate(prevProps: Readonly<P>, prevState: Readonly<S>, snapshot: SS) {
        if(prevProps.language !== this.props.language) {
            this.fetchCurrentVersions()
        }
    }

    componentDidMount() {
        this.fetchInitialVersions()
        console.log(this.props)

    }

    fetchInitialVersions() {
        if (this.props.category === "SwissDRG") {
            fetch(`https://search.eonum.ch/de/drgs/versions`)
                .then((res) => res.json())
                .then((json) => {
                    this.setState({allVersions: CategorysSortService(json), currentVersions: CategorysSortService(json)})
                })
        } else {
            fetch(`https://search.eonum.ch/de/` + this.props.category.toLowerCase() + `s/versions`)
                .then((res) => res.json())
                .then((json) => {
                    this.setState({allVersions: CategorysSortService(json), currentVersions: CategorysSortService(json)})
                })
        }
    }

    fetchCurrentVersions() {
        if (this.props.category === "SwissDRG") {
            fetch(`https://search.eonum.ch/` + this.props.language + `/drgs/versions`)
                .then((res) => res.json())
                .then((json) => {
                    this.setState({currentVersions: json})
                })
        } else {
            fetch(`https://search.eonum.ch/` + this.props.language + `/` + this.props.category.toLowerCase() + `s/versions`)
                .then((res) => res.json())
                .then((json) => {
                    this.setState({currentVersions: CategorysSortService(json)})
                })
        }
    }

    render() {
        return (
            <div>
                <Dropdown as={ButtonGroup} className="catalogButtons d-none d-lg-block">
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
                        {console.log(this.state)}
                    </button>
                    <Dropdown.Toggle className="customButton" variant="" type="button">
                        {this.props.version === this.props.selectedVersion ? ConvertCategoryService.convertCategory(this.props.category, this.props.selectedVersion) : ConvertCategoryService.convertCategory(this.props.category, this.props.version)}
                    </Dropdown.Toggle>
                    <Dropdown.Menu className="dropdown">
                        {this.state.allVersions.reduceRight(function (arr, last, index, coll) {return (arr = arr.concat(last))},[]).map(
                            (versions) => (
                                <Dropdown.Item className={this.state.currentVersions.includes(versions) ? "dropdown-item" : "dropdown-item disabled"}
                                               eventKey={versions}
                                               key={versions}
                                               disabled={!this.state.currentVersions.includes(versions)}
                                               onClick={() => {
                                                this.props.chooseV(versions)
                                            }}
                                >{ConvertCategoryService.convertCategory(this.props.category, versions)}</Dropdown.Item>
                            )
                        )}
                    </Dropdown.Menu>
                </Dropdown>


                {this.props.category === this.props.selectedCategory &&
                <div className="d-lg-none">
                    <Dropdown className="catalogButtons">

                        <DropdownToggle className="customButton" type="button" >
                            {this.props.category}
                        </DropdownToggle>
                        <DropdownMenu className="dropdown" >
                            {this.state.allCategory.map(
                                (category) => (
                                    <Dropdown.Item className="dropdown-item" eventKey={category} key={category} onClick={() => {
                                        this.props.chooseC(category)
                                    }}>
                                        {category}
                                    </Dropdown.Item>
                                )
                            )}
                        </DropdownMenu>
                    </Dropdown>


                    <Dropdown className="catalogButtons">
                        <Dropdown.Toggle className="customButton" variant="" type="button" >
                            {this.props.version === this.props.selectedVersion ? ConvertCategoryService.convertCategory(this.props.category, this.props.selectedVersion) : ConvertCategoryService.convertCategory(this.props.category, this.props.version)}
                        </Dropdown.Toggle>
                        <Dropdown.Menu className="dropdown">
                            {this.state.allVersions.reduceRight(function (arr, last, index, coll) {return (arr = arr.concat(last))},[]).map(
                                (versions) => (
                                    <Dropdown.Item className={this.state.currentVersions.includes(versions) ? "dropdown-item" : "dropdown-item disabled"}
                                                   eventKey={versions}
                                                   key={versions}
                                                   disabled={!this.state.currentVersions.includes(versions)}
                                                   onClick={() => {
                                                       this.props.chooseV(versions)
                                                   }}
                                    >{ConvertCategoryService.convertCategory(this.props.category, versions)}</Dropdown.Item>
                                )
                            )}
                        </Dropdown.Menu>
                    </Dropdown>
                </div>
                    }

            </div>
        )
    }
}

export default ButtonVersion
