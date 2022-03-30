import React, {Component} from "react";
import {useParams} from "react-router-dom";

class BodyChild extends Component{
    version;
    category;
    page;
    language;


    constructor(props) {
        super(props);

        this.version = props.params.version;
        this.category = props.params.category;
        this.page = props.params.page;
        this.language = props.params.language;
        this.catalog = props.params.catalog;

        this.state = {
            children:[],
            exclusions: [],
            inclusions: [],
            text: ""
        }
    }

    async componentDidMount() {
        fetch(`https://search.eonum.ch/`+this.language+`/`+this.catalog+`/`+this.version+`/`+this.page+`?show_detail=1`)
            .then((res) => res.json())
            .then((json) => {
                this.setState({
                    text: json.text,
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
        return(
            <div>
                <div>
                    <h4>{this.page}</h4>
                    <p>{this.state.text}</p>
                    {this.state.exclusions !== undefined && this.state.exclusions.length > 0 && (
                        <div>
                            <h5>Exklusionen</h5>

                            <ul>
                                {this.state.exclusions.map((exclusion) => (
                                    this.lookingForLink(exclusion)
                                ))}
                            </ul>
                        </div>
                    )}

                    {this.state.inclusions !== undefined && this.state.inclusions.length > 0 && (
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
            </div>
        )
    }
}
export default (props) => (
    <BodyChild {...props} params={useParams()} />
)
