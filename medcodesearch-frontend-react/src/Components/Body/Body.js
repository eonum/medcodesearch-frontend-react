import React, {Component} from "react";
import ICDSortService from "../../Services/ICDSortService";
import {generatePath} from "react-router-dom";

class Body extends Component{

    constructor(props) {
        super(props);
        this.state = {
            page: undefined,
            children:[],
            exclusions: [],
            inclusions: []
        }
    }

    componentDidMount() {
        if (this.state.page === undefined) {
            this.fetchInformationsMain()
        } else {
            this.fetchInformationsChild()
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if(prevProps.language !== this.props.language ||
            prevProps.version !== this.props.version ||
            prevProps.category !== this.props.category) {
            if (this.state.page === undefined) {
                this.fetchInformationsMain()
            } else {
                this.fetchInformationsChild()
            }
        }
    }

    async fetchInformationsMain() {
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

    async fetchInformationsChild() {
        fetch(`https://search.eonum.ch/`+this.props.language+`/`+this.props.category+`/`+this.props.version+`/`+this.props.page+`?show_detail=1`)
            .then((res) => res.json())
            .then((json) => {
                this.setState({
                    children: json.children,
                    exclusions: json.exclusions,
                    inclusions: json.inclusions
                })
            })
    }

    lookingForLink(aString) {
        var splitStr = aString.split(` {`)
        if (splitStr.length > 1){
            var endString = splitStr[1].split(`}`)
            return (
                <li className="Exclusion" key={aString}>{splitStr[0]} (<a href="">{endString[0]}</a>)</li>
            )
        } else {
            return splitStr
        }
    }

    render() {
        return (
            <div>
                {this.state.page === undefined && (
                    <div>
                        <h3>{this.props.version}</h3>
                        <h4>Untergeordnete Codes</h4>
                        <ul>
                            {this.state.children.map((child) => (
                                <li className="ICD" key={child.code}><a onClick={() => this.setState({page: child.code})} className="link">{child.code}:</a> {child.text}</li>
                            ))}
                        </ul>
                    </div>
                )}
                {this.state.page !== undefined && (
                    <div>
                        <h4>{this.page}</h4>

                        {this.state.exclusions.length > 0 && (
                            <div>
                                <h5>Exklusionen</h5>

                                <ul>
                                    {this.state.exclusions.map((exclusion) => (
                                        this.lookingForLink(exclusion)
                                    ))}
                                </ul>
                            </div>
                        )}

                        {this.state.inclusions.length > 0 && (
                            <div>
                                <h5>Inklusionen</h5>

                                <ul>
                                    {this.state.inclusions.map((inclusion) => (
                                        <li className="Inclusion" key={inclusion}>{inclusion}</li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        <h5>Untergeordnete Codes</h5>
                        <ul>
                            {this.state.children.map((child) => (
                                <li className="ICD" key={child.code}><a href="">{child.code}:</a> {child.text}</li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        )
    }
}

export default Body
