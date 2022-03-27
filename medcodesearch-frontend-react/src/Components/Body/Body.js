import React, {Component} from "react";
import ICDSortService from "../../Services/ICDSortService";
import {generatePath} from "react-router-dom";

class Body extends Component{

    constructor(props) {
        super(props);
        this.state = {
            children:[],
        }
    }

    componentDidMount() {
        this.fetchInformations()
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if(prevProps.language !== this.props.language ||
            prevProps.version !== this.props.version ||
            prevProps.category !== this.props.category) {
            this.fetchInformations()
        }
    }

    async fetchInformations() {
        console.log(this.props.version)
        fetch(`https://search.eonum.ch/`+this.props.language+`/`+this.props.category+`/`+this.props.version+`/`+this.props.version+`?show_detail=1`)
            .then((res) => res.json())
            .then((json) => {
                if (json.children != null) {
                    this.setState({children: json.children})
                    if (this.props.category === "icd_chapters") {
                        this.setState({children: ICDSortService(this.state.children)})
                    }
                } else {
                    this.setState({children: []})
                }
            })
    }

    render() {
        return (
            <div>
                <h3>{this.props.version}</h3>
                <h4>Untergeordnete Codes</h4>
                <ul>
                    {this.state.children.map((child) => (
                        <li className="ICD" key={child.code}><a className="link" href="">{child.code}:</a> {child.text}</li>
                    ))}
                </ul>
            </div>
        )
    }
}

export default Body
