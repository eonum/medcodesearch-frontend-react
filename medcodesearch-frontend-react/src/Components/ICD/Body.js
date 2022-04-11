import {useLocation, useNavigate, useParams} from "react-router-dom";
import React, {Component} from "react";
import TranslatorService from "../../Services/translator.service";
import ICD from "./ICD"
import CHOP from "./CHOP";
import TARMED from "./TARMED";
import DRG from "./DRG";

class Body extends Component {
    constructor(props) {
        super(props);
        this.state = {
            exclusions: null,
            inclusions: null,
            note: null,
            coding_hint: null,
            synonyms: null,
            most_relevant_drgs: null,
            successors: null,
            predecessors: null,
            usage: "",
            text: "",
            children: []
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
                exclusions: null,
                inclusions: null,
                note: null,
                coding_hint: null,
                synonyms: null,
                most_relevant_drgs: null,
                successors: null,
                predecessors: null,
                text: "",
                usage: "",
                children: []
            })
            this.fetchInformations()
        }

    }

    async fetchInformations() {
        let newCategories;
        if (this.props.params.category === "ICD") {
            newCategories = await ICD.fetchInformations(this.props.params.language, this.props.params.catalog, this.props.params.version, this.props.params.code, this.state)
        } else if (this.props.params.category === "CHOP") {
            newCategories = await CHOP.fetchInformations(this.props.params.language, this.props.params.catalog, this.props.params.version, this.props.params.code, this.state)
        } else if (this.props.params.category === "TARMED") {
            newCategories = await TARMED.fetchInformations(this.props.params.language, this.props.params.catalog, this.props.params.version, this.props.params.code, this.state)
        } else {
            newCategories = await DRG.fetchInformations(this.props.params.language, this.props.params.catalog, this.props.params.version, this.props.params.code, this.state)
        }
        this.setState(newCategories)
    }

    lookingForLink(aString, i) {
        let splitStr = aString.split(` {`)
        let res
        if (splitStr.length > 1){
            let endString = splitStr[1].split(`}`)
            endString = endString[0].split("-")
            if(endString.length > 1 && endString[1] !== "") {
                res = <><a onClick={() => {this.searchExclusion(endString[0])}} key={i} className="link">{endString[0]}</a>-<a onClick={() => {this.searchExclusion(endString[1])}} className="link">{endString[1]}</a></>
            } else {
                res = <a onClick={() => {this.searchExclusion(endString[0].replaceAll(".", ""))}} key={i} className="link">{endString[0].replaceAll(".", "")}</a>
            }
            return (
                <li className="Exclusion" key={i}>{splitStr[0]} ({res})</li>
            )
        } else {
            return splitStr
        }
    }

    goToChild(child) {
        let navigate = this.props.navigation
        if(this.props.params.category === "ICD") {
            ICD.goToChild(this.props.params.code, child.code, navigate, this.props.params.version, this.props.params.language)
        } else if(this.props.params.category === "CHOP") {
            CHOP.goToChild(this.props.params.code, child.code, navigate, this.props.params.version, this.props.params.language)
        } else if(this.props.params.category === "TARMED") {
            TARMED.goToChild(this.props.params.code, child.code, navigate, this.props.params.version, this.props.params.language)
        } else {
            DRG.goToChild(child, navigate, this.props.params.version, this.props.params.language)
        }
    }

    searchExclusion(code) {
        let navigate = this.props.navigation
        navigate({search: "?query=" + code})
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
                                {this.state.children.map((child, i) => (
                                    <li key={i}><a className="link" onClick={() => {this.goToChild(child)}}>{child.code}:</a> {child.text}</li>
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
                                {this.state.exclusions.map((exclusion, i) => (
                                    this.lookingForLink(exclusion, i)
                                ))}
                            </ul>
                        </div>
                    )
                } else if (this.state.predecessors && this.state.predecessors.length === 0){
                    categories.push(
                        <div>
                            <h5>{TranslatorService.translateCategory("predecessors", this.props.params.language)}</h5>
                        </div>
                    )
                }
            }
        }
        if(this.props.params.category === "ICD") {
            return <ICD title={this.props.params.code} text={this.state.text} categories={categories}/>
        } else if(this.props.params.category === "CHOP") {
            return <CHOP title={this.props.params.code} text={this.state.text} categories={categories}/>
        } else if(this.props.params.category === "TARMED") {
            return <TARMED title={this.props.params.code} text={this.state.text} categories={categories}/>
        } else {
            return <DRG title={this.props.params.code} text={this.state.text} categories={categories}/>
        }
    }
}

export default function(props) {
    const navigation = useNavigate();
    const location = useLocation();
    return <Body {...props} navigation={navigation} location={location} params={useParams()}/>
}
