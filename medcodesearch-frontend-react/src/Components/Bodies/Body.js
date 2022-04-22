import {useLocation, useNavigate, useParams} from "react-router-dom";
import React, {Component} from "react";
import ICD from "./ICD"
import CHOP from "./CHOP";
import TARMED from "./TARMED";
import DRG from "./DRG";
import de from "../../assets/translations/de.json"
import fr from "../../assets/translations/fr.json"
import en from "../../assets/translations/en.json"
import it from "../../assets/translations/it.json"
import deJson from "../../assets/translations/de.json";
import frJson from "../../assets/translations/fr.json";
import itJson from "../../assets/translations/it.json";
import enJson from "../../assets/translations/en.json";

class Body extends Component {
    constructor(props) {
        super(props);
        this.state = {
            code: "",
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
            supplement_codes: null,
            usage: "",
            text: "",
            parent: null,
            siblings: [],
            children: []
        }
    }
    async componentDidMount() {
        await this.fetchInformations()
        await this.fetchSiblings(this.state.parent)
    }
    async componentDidUpdate(prevProps: Readonly<P>, prevState: Readonly<S>, snapshot: SS) {
        if(prevProps.params.language !== this.props.params.language ||
            prevProps.params.version !== this.props.params.version ||
            prevProps.params.code !== this.props.params.code) {
            this.setState({
                code: "",
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
                supplement_codes: null,
                usage: "",
                text: "",
                parent: null,
                siblings: [],
                children: []
            })
            await this.fetchInformations()
            await this.fetchSiblings(this.state.parent)
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
        let results = []
        const regex = new RegExp(/[{(](([A-Z\d]{1,3}\.?){1,3})(-(([A-Z\d]{1,3}\.?){1,3})?)?[})]/g);
        let matches = aString.match(regex)
        if(matches) {
            let firstIndex = aString.indexOf(matches[0])
            for (let i = 0; i < matches.length; i++) {
                matches[i] = matches[i].substring(1, matches[i].length - 1);
                let arr = matches[i].split("-")
                if(arr.length > 1 && arr[1] !== "") {
                    results.push(<span>(<a onClick={() => {
                        this.searchExclusion(arr[0].replace(/\.$/, ''))
                    }} className="link">{arr[0].replace(/\.$/, '')}</a>-<a onClick={() => {
                        this.searchExclusion(arr[1].replace(/\.$/, ''))
                    }} className="link">{arr[1].replace(/\.$/, '')}</a>) </span>)
                } else {
                    results.push(<span>(<a onClick={() => {
                        this.searchExclusion(arr[0].replace(/\.$/, ''))
                    }} className="link">{arr[0].replace(/\.$/, '')}</a>) </span>)
                }
            }
            return <li>{aString.substring(0, firstIndex)} {results}</li>
        } else {
            return <li>{aString}</li>
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

    findJson(language) {
        switch (language) {
            case "de":
                return deJson
            case "fr":
                return frJson
            case "it":
                return itJson
            case "en":
                return enJson
        }
    }

    async fetchSiblings(parent) {
        if(this.state.children == null) {
            await fetch('https://search.eonum.ch/' + parent.url + "?show_detail=1")
                .then((res) => res.json())
                .then((json) => {
                    for(let i = 0; i < json.children.length; i++) {
                        if(json.children[i].code !== this.props.params.code) {
                            if(!this.state.siblings) {
                                this.setState({siblings: [json.children[i]]})
                            } else {
                                this.setState({siblings: [...this.state.siblings, json.children[i]]})
                            }
                        }
                    }
                })
        }
    }

    render() {
        let translateJson = this.findJson(this.props.params.language)
        let categories = []
        for(let category in this.state) {
            if(this.state[category] !== null && this.state[category] !== undefined) {
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
                } else if(this.state[category].length > 0 && (category === "children" || category === "siblings")) {
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
                } else if(this.state[category].length > 0 && category === "groups") {
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
                else if(this.state[category].length > 0 && (category === "inclusions" || category === "synonyms" || category === "most_relevant_drgs" || category === "descriptions")) {
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
                } else if(this.state[category].length > 0 && (category === "exclusions" || category === "supplement_codes")) {
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
                } else if(category === "predecessors" && this.state[category].length === 0) {
                    categories.push(
                        <div>
                            <h5>{translateJson["LBL_NEW_CODE"]}</h5>
                        </div>
                    )
                }
            }
        }
        if(this.props.params.category === "ICD") {
            return <ICD title={this.state.code} text={this.state.text} categories={categories}/>
        } else if(this.props.params.category === "CHOP") {
            return <CHOP title={this.state.code} text={this.state.text} categories={categories}/>
        } else if(this.props.params.category === "TARMED") {
            return <TARMED title={this.state.code} text={this.state.text} categories={categories}/>
        } else {
            return <DRG title={this.state.code} text={this.state.text} categories={categories}/>
        }
    }
}

export default function(props) {
    const navigation = useNavigate();
    const location = useLocation();
    return <Body {...props} navigation={navigation} location={location} params={useParams()}/>
}
