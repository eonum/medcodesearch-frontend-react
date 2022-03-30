import React, {Component} from "react";
import ICDSortService from "../../Services/ICDSortService";
import {generatePath, useParams} from "react-router-dom";

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
        if(prevProps.params.language !== this.props.params.language ||
            prevProps.params.version !== this.props.params.version ||
            prevProps.params.category !== this.props.params.category) {
            this.fetchInformations()
        }
    }

    async fetchInformations() {
        console.log(this.props.version)
        fetch(`https://search.eonum.ch/`+this.props.params.language+`/`+this.props.params.catalog+`/`+this.props.params.version+`/`+this.props.params.version+`?show_detail=1`)
            .then((res) => res.json())
            .then((json) => {
                if (json.children != null) {
                    this.setState({children: json.children})
                    if (this.props.params.category === "icd_chapters") {
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
                <h3>{this.props.params.version}</h3>
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

export default (props) => (
    <Body {...props} params={useParams()} />
)

