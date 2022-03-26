import React, {Component} from "react";
import {Dropdown, SplitButton} from "react-bootstrap";
import CategorysSortService from "../../Services/CategorysSortService";

class ButtonVersion extends Component{


    constructor(props) {
        super(props);
        this.state = {
            version:[],
            category: this.props.category,
            language: this.props.language
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
                <SplitButton
                    key={this.props.index}
                    variant={this.state.category.toLowerCase()}
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
        )
    }
}

export default ButtonVersion