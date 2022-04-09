import {useLocation, useNavigate, useParams} from "react-router-dom";
import React, {Component} from "react";
import ICD from "./ICD"
import ICDSortService from "../../Services/ICDSortService";
import RouterService from "../../Services/router.service";
import {useState} from "react";
import CHOP from "./CHOP";
import TARMED from "./TARMED";
import DRG from "./DRG";

class Body extends Component {
    constructor(props) {
        super(props);
        this.state = {
            med_interpret: null,
            tech_interpret: null,
            tp_al: null,
            tp_tl: null,
            groups: null,
            exclusions: null,
            inclusions: null,
            note: null,
            coding_hint: null,
            synonyms: null,
            most_relevant_drgs: null,
            analogous_code_text: null,
            descriptions: null,
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
                med_interpret: null,
                tech_interpret: null,
                tp_al: null,
                tp_tl: null,
                groups: null,
                exclusions: null,
                inclusions: null,
                note: null,
                coding_hint: null,
                synonyms: null,
                most_relevant_drgs: null,
                analogous_code_text: null,
                descriptions: null,
                successors: null,
                predecessors: null,
                usage: "",
                text: "",
                children: []
            })
            this.fetchInformations()
        }
    }

    async fetchInformations() {
        let newCategories;
        if(this.props.params.category === "ICD") {
            newCategories = await ICD.fetchInformations(this.props.params.language, this.props.params.catalog, this.props.params.version, this.props.params.code, this.state)
        } else if(this.props.params.category === "CHOP") {
            newCategories = await CHOP.fetchInformations(this.props.params.language, this.props.params.catalog, this.props.params.version, this.props.params.code, this.state)
        } else if(this.props.params.category === "TARMED") {
            newCategories = await TARMED.fetchInformations(this.props.params.language, this.props.params.catalog, this.props.params.version, this.props.params.code, this.state)
        } else {
            newCategories = await DRG.fetchInformations(this.props.params.language, this.props.params.catalog, this.props.params.version, this.props.params.code, this.state)
        }
        this.setState(newCategories)
    }

    lookingForLink(aString, i) {
        let res
        let klammer = "{"
        if(this.props.params.category === "CHOP") {
            klammer = "("
        }
        let indexCode = aString.lastIndexOf(klammer)
        let code = aString.substring(indexCode+1, aString.length-1).split("-")
        if(code.length > 1 && code[1] !== "") {
            res = <><a onClick={() => {
                this.searchExclusion(code[0])
            }} key={i} className="link">{code[0]}</a>-<a onClick={() => {
                this.searchExclusion(code[1])
            }} className="link">{code[1]}</a></>
        } else {
            res = <a onClick={() => {
                this.searchExclusion(code[0])
            }} key={i} className="link">{code[0]}</a>
        }
        return <li key={i}>{aString.substring(0,indexCode)} ({res})</li>
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
        let translateJson = require("../../assets/translations/" + this.props.params.language + ".json")
        let categories = []
        for(let category in this.state) {
            if(this.state[category] !== null && this.state[category] !== undefined && (this.state[category].length > 0 || typeof this.state[category] == "number")) {
                if(category === "med_interpret" || category === "tech_interpret") {
                    categories.push(
                        <div>
                            <p>{this.state[category]}</p>
                        </div>
                    )
                } else if(category === "tp_al" || category === "tp_tl") {
                    if(this.state[category] !== 0) {
                        categories.push(
                            <div>
                                <p>{translateJson["LBL_" + category.toUpperCase()]}: {this.state[category]}</p>
                            </div>
                        )
                    }
                }
                else if(category === "note" || category === "coding_hint" || category === "usage") {
                    categories.push(
                        <div>
                            <h5>{translateJson["LBL_" + category.toUpperCase()]}</h5>
                            <p>{this.state[category]}</p>
                        </div>
                    )
                } else if(category === "children") {
                    categories.push(
                        <div>
                            <h5>{translateJson["LBL_" + category.toUpperCase()]}</h5>
                            <ul>
                                {this.state[category].map((child, i) => (
                                    <li key={i}><a className="link" onClick={() => {this.goToChild(child)}}>{child.code}:</a> {child.text}</li>
                                ))}
                            </ul>
                        </div>
                    )
                } else if(category === "groups") {
                    categories.push(
                        <div>
                            <h5>{translateJson["LBL_" + category.toUpperCase()]}</h5>
                            <ul>
                                {this.state[category].map((child, i) => (
                                    <li key={i}>{child.code}: {child.text}</li>
                                ))}
                            </ul>
                        </div>
                    )
                }
                else if((category === "inclusions" || category === "synonyms" || category === "most_relevant_drgs" || category === "descriptions")) {
                    categories.push(
                        <div>
                            <h5>{translateJson["LBL_" + category.toUpperCase()]}</h5>
                            <ul>
                                {this.state[category].map((element, i) => (
                                    <li key={i}>{element}</li>
                                ))}
                            </ul>
                        </div>
                    )
                } else if(category === "exclusions" || category === "groups") {
                    categories.push(
                        <div>
                            <h5>{translateJson["LBL_" + category.toUpperCase()]}</h5>
                            <ul>
                                {this.state[category].map((exclusion, i) => (
                                    this.lookingForLink(exclusion, i)
                                ))}
                            </ul>
                        </div>
                    )
                } else if (this.state.predecessors && this.state.predecessors.length === 0){
                    categories.push(
                        <div>
                            <h5>{translateJson["LBL_" + category.toUpperCase()]}</h5>
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
