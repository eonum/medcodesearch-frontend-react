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
        }
    }

    componentDidMount() {
        if (this.props.category === "SwissDRG") {
            fetch(`https://search.eonum.ch/` + this.props.language + `/drgs/versions`)
                .then((res) => res.json())
                .then((json) => {
                    this.setState({version: json})
                })
        } else {
            fetch(`https://search.eonum.ch/` + this.props.language + `/` + this.props.category.toLowerCase() + `s/versions`)
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
                    <Dropdown.Toggle className="customButton" variant="" type="button">{this.props.version === this.props.selectedVersion ? this.props.selectedVersion : this.props.version}</Dropdown.Toggle>
                    <Dropdown.Menu>
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