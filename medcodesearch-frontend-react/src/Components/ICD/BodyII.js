import {useLocation, useNavigate, useParams} from "react-router-dom";
import React, {Component} from "react";
import TranslatorService from "../../Services/translator.service";
import MiGeL from "./MiGeL";
import AL from "./AL";
import DRUG from "./DRUG";

class BodyII extends Component {
    constructor(props) {
        super(props);
        this.state = {
            exclusions: null,
            inclusions: null,
            note: null,
            coding_hint: null,
            synonyms: null,
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
            if (prevProps.params.language !== this.props.params.language ||
                prevProps.params.code !== this.props.params.code) {
                this.setState({
                    exclusions: null,
                    inclusions: null,
                    note: null,
                    coding_hint: null,
                    synonyms: null,
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
        if (this.props.params.category === "MIGEL") {
            newCategories = await MiGeL.fetchInformations(this.props.params.language, this.props.params.category, 'migels', this.props.params.code, this.state)
        }else if (this.props.params.category === "AL") {
            newCategories = await AL.fetchInformations(this.props.params.language, this.props.params.category, 'laboratory_analyses', this.props.params.code, this.state)
        }else if (this.props.params.category === "DRUG") {
            newCategories = await DRUG.fetchInformations(this.props.params.language, this.props.params.category, 'drugs', this.props.params.code, this.state)
        }
        if (newCategories !== null) {
            this.setState(newCategories)
        }
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
        if(this.props.params.category === "MIGEL") {
            MiGeL.goToChild(this.props.category, child.code, navigate, this.props.params.language)
        }
        else if(this.props.params.captegory === "AL") {
            AL.goToChild(this.props.category, child.code, navigate, this.props.params.language)
        }
        else if(this.props.params.captegory === "DRUG") {
            DRUG.goToChild(this.props.category, child.code, navigate, this.props.params.language)
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
        let showTitle = false;
        if (this.props.params.code === 'all') {
            showTitle = true;
        }
        if(this.props.params.category === "MIGEL") {
            return <MiGeL title={showTitle ? 'MiGeL' : this.props.params.code}
                          text={showTitle ? "Search for a Code" : this.state.text} categories={categories}/>
        }
        else if (this.props.params.category === "AL") {
            return <AL title={showTitle ? 'AL' : this.props.params.code}
                       text={showTitle ? "Search for a Code" : this.state.text} categories={categories}/>
        }
        else if (this.props.params.category === "DRUG") {
            return <AL title={showTitle ? 'DRUG' : this.props.params.code}
                       text={showTitle ? "Search for a Code" : this.state.text} categories={categories}/>
        }

    }
}

export default function(props) {
    const navigation = useNavigate();
    const location = useLocation();
    return <BodyII {...props} navigation={navigation} location={location} params={useParams()}/>
}
