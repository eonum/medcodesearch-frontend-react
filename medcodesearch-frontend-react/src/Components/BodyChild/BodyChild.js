import React, {Component} from "react";
import {useLocation, useNavigate, useParams} from "react-router-dom";

class BodyChild extends Component{
    version;
    category;
    page;
    language;


    constructor(props) {
        super(props);

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

    async fetchInformations() {
        await fetch(`https://search.eonum.ch/` + this.props.params.language + `/` + this.props.params.catalog + `/` + this.props.params.version + `/` + this.props.params.page + `?show_detail=1`)
            .then((res) => {
                if(res.ok) {
                    return res.json()
                }
                throw new Error('Not found');
            })
            .then((json) => {
                this.setState({
                    text: json.text,
                    children: json.children,
                })
                if (json.exclusions !== undefined) {
                    this.setState({
                        exclusions: json.exclusions
                    })
                }
                if (json.inclusions !== undefined) {
                    this.setState({
                        inclusions: json.inclusions
                    })
                }
            })
            .catch(async () => {
                await fetch(`https://search.eonum.ch/` + this.props.params.language + "/" + this.props.params.category.toLowerCase() + "s/" + this.props.params.version + `/` + this.props.params.page + `?show_detail=1`)
                    .then((res) => {
                            return res.json()
                    })
                    .then((json) => {
                        this.setState({
                            text: json.text,
                            children: json.children,
                        })
                        if (json.exclusions !== undefined) {
                            this.setState({
                                exclusions: json.exclusions
                            })
                        }
                        if (json.inclusions !== undefined) {
                            this.setState({
                                inclusions: json.inclusions
                            })
                        }
                    })
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
        let children;
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
        if(this.state.inclusions !== null && this.state.inclusions.length > 0) {
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
        if(this.state.children !== null && this.state.children.length > 0) {
            children =
                <div>
                    <h5>Untergeordnete Codes</h5>
                    <ul>
                        {this.state.children.map((child) => (
                            <li key={child.code}><a className="link" onClick={() => {this.goToChild(child.code)}}>{child.code}:</a> {child.text}</li>
                        ))}
                    </ul>
                </div>
        }

        return(
            <div>
                <div>
                    <h4>{this.props.params.page}</h4>
                    <p>{this.state.text}</p>
                    {exclusions}
                    {inclusions}
                    {children}
                </div>
            </div>
        )
    }
    goToChild(code) {
        let navigate = this.props.navigation
        navigate("/" + this.props.params.language + "/" + this.props.params.category + "/" + this.props.params.version + "/" + this.props.params.category.toLowerCase() + "_groups/" + code)
    }
}

export default function(props) {
    const navigation = useNavigate();
    const location = useLocation();
    return <BodyChild {...props} navigation={navigation} location={location} params={useParams()}/>
}
