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
            exclusions: null,
            inclusions: null,
            text: ""
        }
    }

    componentDidUpdate(prevProps: Readonly<P>, prevState: Readonly<S>, snapshot: SS) {
        if(prevProps !== this.props) {
            this.setState({exclusions: null, inclusions: null})
            this.fetchInformations()
        }
    }

    componentDidMount() {
        this.fetchInformations()
    }
    fetchInformations () {
        fetch(`https://search.eonum.ch/`+this.language+`/`+this.catalog+`/`+this.version+`/`+this.page+`?show_detail=1`)
            .then((res) => res.json())
            .then((json) => {
                this.setState({
                    text: json.text,
                    children: json.children,
                })
                if(json.exclusions !== undefined) {
                    this.setState({
                        exclusions: json.exclusions
                    })
                }
                if(json.inclusions !== undefined) {
                    this.setState({
                        inclusions: json.inclusions
                    })
                }
            })
    }



    lookingForLink(aString) {
        var splitStr = aString.split(` {`)
        if (splitStr.length > 1){
            var endString = splitStr[1].split(`}`)
            return (
                <li className="Exclusion" key={aString}>{splitStr[0]} (<a className="link" href="">{endString[0]}</a>)</li>
            )
        } else {
            return splitStr
        }
    }

    render() {
        let exclusions;
        let inclusions;
        if(this.state.exclusions !== null && this.state.exclusions.length > 0) {
            exclusions =
                <div>
                    <h5>Exklusionen</h5>
                    <ul>
                        {this.state.exclusions.map((exclusion) => (
                            this.lookingForLink(exclusion)
                        ))}
                 </ul>
                </div>
        }
        if(this.state.inclusions !== null && this.state.exclusions.length > 0) {
            inclusions =
                <div>
                    <h5>Inklusionen</h5>

                    <ul>
                        {this.state.inclusions.map((inclusion) => (
                            <li className="Inclusion" key={inclusion}>{inclusion}</li>
                        ))}
                    </ul>
                </div>
        }

        return(
            <div>
                <div>
                    <h4>{this.page}</h4>
                    <p>{this.state.text}</p>
                    {exclusions}
                    {inclusions}
                    <h5>Untergeordnete Codes</h5>
                    <ul>
                        {this.state.children.map((child) => (
                            <li className="ICD" key={child.code}><a className="link" href="">{child.code}:</a> {child.text}</li>
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
