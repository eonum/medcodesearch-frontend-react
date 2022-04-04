import {useLocation, useNavigate, useParams} from "react-router-dom";
import React, {Component} from "react";
import ICDSortService from "../../Services/ICDSortService";
import Fetch from "../../Services/fetch";
import RouterService from "../../Services/router.service";
import TranslatorService from "../../Services/translator.service";

class TARMED extends Component {
    constructor(props) {
        super(props);
        this.state = {
            children:[],
            exclusions: null,
            inclusions: null,
            note: null,
            coding_hint: null,
            synonyms: null,
            most_relevant_drgs: null,
            successors: null,
            predecessors: null,
            usage: "",
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
            this.state = {
                children:[],
                exclusions: null,
                inclusions: null,
                note: null,
                coding_hint: null,
                synonyms: null,
                most_relevant_drgs: null,
                successors: null,
                predecessors: null,
                usage: "",
                text: ""
            }
            this.fetchInformations()
        }
    }

    async fetchInformations() {
        await //Fetch(this.props.params.language, this.props.params.version, 'icd_chapters', this.props.params.version)
            fetch('https://search.eonum.ch/' + this.props.params.language + "/" + this.props.params.catalog + "/" + this.props.params.version + "/" + this.props.params.code + "?show_detail=1")
                .then((res) => res.json())
                .then((json) => {
                    for(let category in this.state) {
                        let newState = {}
                        newState[category] = json[category]
                        this.setState(newState)
                    }
                })
    }

    lookingForLink(aString) {
        let splitStr = aString.split(` {`)
        if (splitStr.length > 1){
            let endString = splitStr[1].split(`}`)
            endString = endString[0].split("-")
            if(endString.length > 1) {
                endString = <><a className="link">{endString[0]}</a>-<a className="link">{endString[1]}</a></>
            } else {
                endString = <a className="link">{endString[0]}</a>
            }
            return (
                <li className="Exclusion" key={aString}>{splitStr[0]} ({endString})</li>
            )
        } else {
            return splitStr
        }
    }


    render() {
        let categories = []
        for(let category in this.state) {
            if(this.state[category] !== null && this.state[category] !== undefined && this.state[category].length > 0) {
                if(category === "note" || category === "coding_hint" || category === "usage") {
                    categories.push(
                        <div>
                            <h5>{TranslatorService.translateCategory(category, this.props.params.language)}</h5>
                            <p>{this.state[category]}</p>
                        </div>
                    )
                } else if(category === "children") {
                    categories.push(
                        <div>
                            <h4>{TranslatorService.translateCategory(category, this.props.params.language)}</h4>
                            <ul>
                                {this.state.children.map((child) => (
                                    <li key={child.code}><a className="link" onClick={() => {this.goToChild(child.code)}}>{child.code}:</a> {child.text}</li>
                                ))}
                            </ul>
                        </div>
                    )
                } else if(category === "inclusions" || category === "synonyms" || category === "most_relevant_drgs") {
                    categories.push(
                        <div>
                            <h5>{TranslatorService.translateCategory(category, this.props.params.language)}</h5>
                            <ul>
                                {this.state[category].map((element, i) => (
                                    <li key={i}>{element}</li>
                                ))}
                            </ul>
                        </div>
                    )
                } else if(category === "exclusions") {
                    categories.push(
                        <div>
                            <h5>{TranslatorService.translateCategory(category, this.props.params.language)}</h5>
                            <ul>
                                {this.state.exclusions.map((exclusion) => (
                                    this.lookingForLink(exclusion)
                                ))}
                            </ul>
                        </div>
                    )
                }
            }
        }
        return (
            <div>
                <h3>{this.props.params.code}</h3>
                <p>{this.state.text}</p>
                {categories}
            </div>
        )
    }

    goToChild(code) {
        let navigate = this.props.navigation
        if(this.props.params.version === this.props.params.code) {
            navigate({pathname: "/" + this.props.params.language + "/TARMED/" + this.props.params.version + "/tarmed_chapters/" + code,
                search: RouterService.getQueryVariable('query') === "" ? "" : "?query=" + RouterService.getQueryVariable('query')})
        } else {
            navigate({pathname: "/" + this.props.params.language + "/TARMED/" + this.props.params.version + "/tarmeds/" + code,
                search: RouterService.getQueryVariable('query') === "" ? "" : "?query=" + RouterService.getQueryVariable('query')})
        }
    }
}
export default function(props) {
    const navigation = useNavigate();
    const location = useLocation();
    return <TARMED {...props} navigation={navigation} location={location} params={useParams()}/>
}
