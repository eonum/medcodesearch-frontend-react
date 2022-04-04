import {useLocation, useNavigate, useParams} from "react-router-dom";
import React, {Component} from "react";
import ICDSortService from "../../Services/ICDSortService";
import Fetch from "../../Services/fetch";
import RouterService from "../../Services/router.service";

class DRG extends Component {
    constructor(props) {
        super(props);
        this.state = {
            children:[],
            exclusions: null,
            inclusions: null,
            note: null,
            text: ""
        }
    }
    componentDidMount() {
        this.fetchInformations()
    }
    componentDidUpdate(prevProps: Readonly<P>, prevState: Readonly<S>, snapshot: SS) {
        if(prevProps.params.language !== this.props.params.language ||
            prevProps.params.version !== this.props.params.version ||
            prevProps.params.code !== this.props.params.code) {
            this.setState({
                children:[],
                exclusions: null,
                inclusions: null,
                note: null,
                text: ""
            })
            this.fetchInformations()
        }
    }

    async fetchInformations() {
        await //Fetch(this.props.params.language, this.props.params.version, 'icd_chapters', this.props.params.version)
            fetch('https://search.eonum.ch/' + this.props.params.language + "/mdcs/" + this.props.params.version + "/ALL?show_detail=1")
                .then((res) => res.json())
                .then((json) => {
                    if (json.children != null) {
                        this.setState({children: json.children})
                    }
                    if (json.text !== undefined) {
                        this.setState({text: json.text})
                    }
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
                    if (json.note !== undefined) {
                        this.setState({
                            note: json.note
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
        let note;
        let children;
        if(this.state.note !== null) {
            note =
                <div>
                    <h5>Hinweis</h5>
                    <p>{this.state.note}</p>
                </div>
        }
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
                    <h4>Untergeordnete Codes</h4>
                    <ul>
                        {this.state.children.map((child) => (
                            <li className="DRG" key={child.code}><a className="link" onClick={() => {
                                this.goToChild(child.code)}}>{child.code}:</a> {child.text}</li>
                        ))}
                    </ul>
                </div>
        }
        return (
            <div>
                <h3>{this.props.params.code}</h3>
                <p>{this.state.text}</p>
                {exclusions}
                {inclusions}
                {note}
                {children}
            </div>
        )
    }

    goToChild(code) {
        let navigate = this.props.navigation
        if(this.props.params.version === this.props.params.code) { // for first codes
            navigate({pathname: "/" + this.props.params.language + "/SwissDRG/" + this.props.params.version + "/mdcs/" + code,
                search: RouterService.getQueryVariable('query') === "" ? "" : "?query=" + RouterService.getQueryVariable('query')})
        } else if (code.match(/^[A-Z][A-Z][A-Z]\s[0-9][0-9]$/)){ // for example MDC 03
            let searchCode = code.split(' ');
            navigate({pathname: "/" + this.props.params.language + "/SwissDRG/" + this.props.params.version + "/mdcs/" + searchCode[1],
                search: RouterService.getQueryVariable('query') === "" ? "" : "?query=" + RouterService.getQueryVariable('query')})
        } else if(code.match(/^[A-Z]?[A-Z]$/)){ // for example C_A
            navigate({pathname: "/" + this.props.params.language + "/SwissDRG/" + this.props.params.version + "/partitions/" + code,
                search: RouterService.getQueryVariable('query') === "" ? "" : "?query=" + RouterService.getQueryVariable('query')})
        }else if (/^[A-Z][0-9][0-9][A-Z]$/) { // for example C60A
            navigate({
                pathname: "/" + this.props.params.language + "/SwissDRG/" + this.props.version + "/drgs/" + code,
                search: RouterService.getQueryVariable('query') === "" ? "" : "?query=" + RouterService.getQueryVariable('query')})
        }else if(/^[A-Z][0-9][0-9]$/){ // for example C60
            navigate({pathname: "/" + this.props.params.language + "/SwissDRG/" + this.props.version + "/adrgs/" + code,
                search: RouterService.getQueryVariable('query') === "" ? "" : "?query=" + RouterService.getQueryVariable('query')})
            }

    }


}
export default function(props) {
    const navigation = useNavigate();
    const location = useLocation();
    return <DRG {...props} navigation={navigation} location={location} params={useParams()}/>
}
