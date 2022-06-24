import {useLocation, useNavigate, useParams} from "react-router-dom";
import React, {Component} from "react";
import ICD from "./ICD"
import CHOP from "./CHOP";
import TARMED from "./TARMED";
import DRG from "./DRG";
import {Breadcrumb} from "react-bootstrap";
import findJsonService from "../../Services/find-json.service";

/**
 * Responsible for the body of the website, for catalogs with versions (i.e. ICD, CHOP, DRG, TARMED).
 */
class CodeBodyVersionized extends Component {
    constructor(props) {
        super(props);
        this.state = {
            code: "",
            med_interpret: null,
            tech_interpret: null,
            tp_al: null,
            tp_tl: null,
            groups: null,
            blocks: null,
            exclusions: null,
            inclusions: null,
            notes: null,
            hints: null,
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
            children: [],
            parent: null,
            parents: [],
            siblings: [],
            terminal: null
        }
    }

    /**
     * Calls for the fetch, sibling and grandparents methods
     * @returns {Promise<void>}
     */
    async componentDidMount() {
        await this.fetchInformations()
        await this.fetchSiblings(this.state.parent)
        await this.fetchGrandparents(this.state.parent)
    }

    /**
     * Set the new state after every update and calls for the fetch, sibling and grandparents methods
     * @param prevProps
     * @param prevState
     * @param snapshot
     * @returns {Promise<void>}
     */
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
                blocks: null,
                exclusions: null,
                inclusions: null,
                hints: null,
                notes: null,
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
                children: [],
                parent: null,
                parents: [],
                siblings: [],
                terminal: null
            })
            await this.fetchInformations()
            await this.fetchSiblings(this.state.parent)
            await this.fetchGrandparents(this.state.parent)
        }
    }

    /**
     * Fetch the information from the backend and does a case distinction for all the catalogs
     * @returns {Promise<void>}
     */
    async fetchInformations() {
        let detailedCode;
        if (this.props.params.catalog === "ICD") {
            detailedCode = await ICD.fetchInformations(this.props.params.language, this.props.params.resource_type, this.props.params.version, this.props.params.code, this.state)
        } else if (this.props.params.catalog === "CHOP") {
            detailedCode = await CHOP.fetchInformations(this.props.params.language, this.props.params.resource_type, this.props.params.version, this.props.params.code, this.state)
        } else if (this.props.params.catalog === "TARMED") {
            detailedCode = await TARMED.fetchInformations(this.props.params.language, this.props.params.resource_type, this.props.params.version, this.props.params.code, this.state)
        } else {
            detailedCode = await DRG.fetchInformations(this.props.params.language, this.props.params.resource_type, this.props.params.version, this.props.params.code, this.state)
        }
        this.setState(detailedCode)
    }

    /**
     * Looks if the given string has a pattern which indicates a link
     * @param aString
     * @param index
     * @returns {JSX.Element}
     */
    lookingForLink(aString, index) {
        let results = []
        const REGEX = new RegExp(/[{(](([A-Z\d]{1,3}\.?){1,3})(-(([A-Z\d]{1,3}\.?){1,3})?)?[})]/g);
        let matches = aString.match(REGEX)
        if(matches) {
            let firstIndex = aString.indexOf(matches[0])
            for (let i = 0; i < matches.length; i++) {
                matches[i] = matches[i].substring(1, matches[i].length - 1);
                let arr = matches[i].split("-")
                if(arr.length > 1 && arr[1] !== "") {
                    results.push(<span key={(index + 7)*3}>(<a onClick={() => {
                        this.searchExclusion(arr[0].replace(/\.$/, ''))
                    }} className="link">{arr[0].replace(/\.$/, '')}</a>-<a onClick={() => {
                        this.searchExclusion(arr[1].replace(/\.$/, ''))
                    }} className="link">{arr[1].replace(/\.$/, '')}</a>) </span>)
                } else {
                    results.push(<span key={(index + 11)*3}>(<a onClick={() => {
                        this.searchExclusion(arr[0].replace(/\.$/, ''))
                    }} className="link">{arr[0].replace(/\.$/, '')}</a>) </span>)
                }
            }
            return <li key={"link" + index}>{aString.substring(0, firstIndex)} {results}</li>
        } else {
            return <li key={"link" + index} >{aString}</li>
        }
    }

    /**
     * navigates to the child component
     * @param child
     */
    goToChild(child) {
        let navigate = this.props.navigation
        if(this.props.params.catalog === "ICD") {
            ICD.goToChild(child.code, navigate, this.props.params.version, this.props.params.language)
        } else if(this.props.params.catalog === "CHOP") {
            CHOP.goToChild(child.code.replace(" ", "_"), navigate, this.props.params.version, this.props.params.language)
        } else if(this.props.params.catalog === "TARMED") {
            TARMED.goToChild(child.code.replace(" ", "_"), navigate, this.props.params.version, this.props.params.language)
        } else {
            DRG.goToChild(child, navigate, this.props.params.version, this.props.params.language)
        }
    }

    /**
     * looks in the given code for exclusions
     * @param code
     */
    searchExclusion(code) {
        let navigate = this.props.navigation
        navigate({search: "?query=" + code})
    }

    /**
     * fetch the sibling of the component
     * @param parent
     * @returns {Promise<void>}
     */
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

    /**
     * fetch the grandparent of the component
     * @param parent
     * @returns {Promise<void>}
     */
    async fetchGrandparents(parent) {
        let parents = []
        while(parent) {
            parents = [...parents, parent]
            await fetch('https://search.eonum.ch/' + parent.url + "?show_detail=1")
                .then((res) => res.json())
                .then((json) => {
                    parent = json["parent"]
                })
        }
        this.setState({parents: parents})
    }

    /**
     * Render the body component
     * @returns {JSX.Element}
     */
    render() {
        let translateJson = findJsonService(this.props.params.language)
        let attributes_html = []
        let parentBreadCrumbs = []

        var mappingFields = ['predecessors', 'successors'];
        // Define div for predecessor code info
        for(var j = 0; j < mappingFields.length; j++) {
            var field = mappingFields[j];
            if (this.state[field] != null) {
                // is this a non-trivial mapping?
                if(this.state[field].length > 1 || this.state[field].length == 1 && (this.state[field][0]['code'] != this.state['code'] || this.state[field][0]['text'] != this.state['text'])) {
                    attributes_html.push(
                        <div key={"mapping_pre_succ" + j}>
                            <h5>{translateJson["LBL_" + field.toUpperCase()]}</h5>
                            <ul>
                                {this.state[field].map((child,i) => (
                                    <li key={child + "_" + i}><b>{child.code}</b>{" " +  child.text}</li>
                                    ))}
                            </ul>
                        </div>)
                }
            }
        }

        if(this.state.parents && this.state.parents.length > 0){
            for(let i=this.state.parents.length-1; i>=0; i--){
                parentBreadCrumbs.push(<Breadcrumb.Item
                    key={i}
                    onClick={() => this.goToChild(this.state.parents[i])}
                    className="breadLink"
                >{this.state.parents[i].code}</Breadcrumb.Item>)
            }
        }
        for(let attribute in this.state) {
            if(this.state[attribute] !== null && this.state[attribute] !== undefined) {
                if(attribute === "med_interpret" || attribute === "tech_interpret") {
                    attributes_html.push(
                        <div key={"med/tech interpret" + this.state[attribute].length * 41}>
                            <p>{this.state[attribute]}</p>
                        </div>
                    )
                } else if(attribute === "tp_al" || attribute === "tp_tl") {
                    if(this.state[attribute] !== 0) {
                        attributes_html.push(
                            <div key={"tp_al/tl" + this.state[attribute] * 37}>
                                <p>{translateJson["LBL_" + attribute.toUpperCase()]}: {this.state[attribute]}</p>
                            </div>
                        )
                    }
                }
                else if(attribute === "note" || attribute === "coding_hint" || attribute === "usage") {
                    attributes_html.push(
                        <div key={"note coding_hint usage" + this.state[attribute].length * 31}>
                            <h5>{translateJson["LBL_" + attribute.toUpperCase()]}</h5>
                            <p>{this.state[attribute]}</p>
                        </div>
                    )
                } else if(this.state[attribute].length > 0 && (attribute === "children" || attribute === "siblings")) {
                    attributes_html.push(
                        <div key={"children siblings" + this.state[attribute] * 29}>
                            <h5>{translateJson["LBL_" + attribute.toUpperCase()]}</h5>
                            <ul>
                                {this.state[attribute].map((child, i) => (
                                    <li key={child + " number " + (i * 23)}><a className="link" onClick={() => {this.goToChild(child)}}>{child.code}:</a> {child.text}</li>
                                ))}
                            </ul>
                        </div>
                    )
                } else if(this.state[attribute].length > 0 && (attribute === "groups" || attribute === "blocks")) {
                    attributes_html.push(
                        <div key={"groups " + this.state[attribute].length * 19}>
                            <h5>{translateJson["LBL_" + attribute.toUpperCase()]}</h5>
                            <ul>
                                {this.state[attribute].map((child, i) => (
                                    <li key={child.code + "childcode " + (i * 17)}>{child.code}: {child.text}</li>
                                ))}
                            </ul>
                        </div>
                    )
                }
                else if(this.state[attribute].length > 0 && (attribute === "inclusions" || attribute === "synonyms" || attribute === "most_relevant_drgs" || attribute === "descriptions" || attribute === "notes")) {
                    attributes_html.push(
                        <div key={"incl, syn, rel_drgs, descr " + this.state[attribute].length * 13}>
                            <h5>{translateJson["LBL_" + attribute.toUpperCase()]}</h5>
                            <ul>
                                {this.state[attribute].map((element, i) => (
                                    <li key={"element nr " + i}>{element}</li>
                                ))}
                            </ul>
                        </div>
                    )
                } else if(this.state[attribute].length > 0 && (attribute === "exclusions" || attribute === "supplement_codes")) {
                    attributes_html.push(
                        <div key={"exclusions supp_codes " + this.state[attribute].length * 11}>
                            <h5>{translateJson["LBL_" + attribute.toUpperCase()]}</h5>
                            <ul>
                                {this.state[attribute].map((exclusion, i) => (
                                    this.lookingForLink(exclusion, i)
                                ))}
                            </ul>
                        </div>
                    )
                } else if(attribute === "predecessors" && this.state[attribute].length === 0 && this.state.children == null) {
                    attributes_html.push(
                        <div key={"predec " + this.state[attribute].length * 7}>
                            <h5>{translateJson["LBL_NEW_CODE"]}</h5>
                        </div>
                    )
                }
            }
        }
        if(this.props.params.catalog === "ICD") {
            return <ICD key={this.state.code} title={this.state.code} text={this.state.text} attributes={attributes_html} parents={parentBreadCrumbs}/>
        } else if(this.props.params.catalog === "CHOP") {
            return <CHOP key={this.state.code} title={this.state.code} text={this.state.text} attributes={attributes_html} parents={parentBreadCrumbs}/>
        } else if(this.props.params.catalog === "TARMED") {
            return <TARMED key={this.state.code} title={this.state.code} text={this.state.text} attributes={attributes_html} parents={parentBreadCrumbs}/>
        } else {
            return <DRG key={this.state.code} title={this.state.code} text={this.state.text} attributes={attributes_html} parents={parentBreadCrumbs}/>
        }
    }
}

export default function(props) {
    const NAVIGATION = useNavigate();
    const LOCATION = useLocation();
    return <CodeBodyVersionized {...props} navigation={NAVIGATION} location={LOCATION} params={useParams()} key={"bodyI"}/>
}
