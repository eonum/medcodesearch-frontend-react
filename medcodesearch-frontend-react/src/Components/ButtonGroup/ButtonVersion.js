import React, {Component} from "react";
import {Dropdown, SplitButton} from "react-bootstrap";
import CategorysSortService from "../../Services/CategorysSortService";
import { ButtonGroup, Button } from "react-bootstrap";
import DropdownToggle from "react-bootstrap/esm/DropdownToggle";

class ButtonVersion extends Component{


    constructor(props) {
        super(props);
        this.state = {
            version:[],
            currentVersion: this.props.version,
            category: this.props.category,
            language: this.props.language,
            currentCatalog: this.props.selectedCategory
        }
    }

    componentDidMount() {
        if (this.state.category === "SwissDRG") {
            fetch(`https://search.eonum.ch/` + this.state.language + `/drgs/versions`)
                .then((res) => res.json())
                .then((json) => {
                    this.setState({version: json})
                })
        } else {
            fetch(`https://search.eonum.ch/` + this.state.language + `/` + this.state.category.toLowerCase() + `s/versions`)
                .then((res) => res.json())
                .then((json) => {
                    this.setState({version: CategorysSortService(json)})
                })
        }
    }

    render() {

        return (
            <div>
                <Dropdown as={ButtonGroup} className="catalogButtons">
                    <button 
                        id={this.state.category === this.state.currentCatalog ? "activeCatalog" : ""}
                        key={this.props.index}
                        title={this.state.category}
                        onClick={(e) => {
                            this.props.activate(this.state.category);
                        }}
                        className="customButton"
                        >
                        {this.state.category}
                    </button>
                    <Dropdown.Toggle className="customButton">{this.state.currentVersion}</Dropdown.Toggle>
                    <Dropdown.Menu>
                        {this.state.version.reduceRight(function (arr, last, index, coll) {return (arr = arr.concat(last))},[]).map(
                            (versions) => (
                                <Dropdown.Item eventKey={versions}
                                            key={versions}
                                            onClick={() => {
                                                this.props.chooseV(versions)
                                                this.state.currentVersion = versions
                                            }}
                                >{versions}</Dropdown.Item>
                            )
                        )}
                    </Dropdown.Menu>
                </Dropdown>
            </div>
            
            
            /*
            <div>
                <SplitButton 
                    className="customButton"
                    key={this.props.index}
                    title={this.state.category}
                    onClick={(e) => {
                        this.props.activate(this.state.category);
                    }}
                    >
                    {this.state.version.reduceRight(function (arr, last, index, coll) {return (arr = arr.concat(last))},[]).map(
                        (versions) => (
                            <Dropdown.Item eventKey={versions}
                                           key={versions}
                                           onClick={() => {
                                               this.props.chooseV(versions)
                                           }}
                            >{versions}</Dropdown.Item>
                        )
                    )}
                </SplitButton>
            </div>
            */
        )
    }
}

export default ButtonVersion