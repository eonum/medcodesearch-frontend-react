import {useLocation, useNavigate, useParams} from "react-router-dom";
import React, {Component} from "react";
import MIGEL from "./MIGEL";
import AL from "./AL";
import {Breadcrumb, BreadcrumbItem} from "react-bootstrap";
import findJsonService from "../../Services/find-json.service";
import {fetchUnversionizedCodeInformations} from "../../Utils";
import {ICode} from "../../interfaces";

/**
 * Responsible for the body of the website, for catalogs with versions (i.e. ICD, CHOP, DRG, TARMED)
 */

interface Props {
    params: any,
    navigation: any,
    location: any,
}

class CodeBodyUnversionized extends Component<Props, ICode> {
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
    async componentDidUpdate(prevProps, prevState, snapshot) {
            if (prevProps.params.language !== this.props.params.language ||
                prevProps.params.code !== this.props.params.code ||
                prevProps.params.catalog !== this.props.params.catalog) {
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
        const {language, code, catalog} = this.props.params;
        let detailedCode, versions;
        versions = {"MIGEL": "migels", "AL": "laboratory_analyses", "DRUG": "drugs"};
        detailedCode = await fetchUnversionizedCodeInformations(language, catalog, versions[catalog], code);
        if (detailedCode !== null) {
            this.setState(detailedCode)
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
     * fetch the sibling of the component
     * @param parent
     * @returns {Promise<void>}
     */
    async fetchSiblings(parent) {
        if(this.state.children == null && parent) {
            await fetch('https://search.eonum.ch/' + parent.url + "?show_detail=1")
                .then((res) => res.json())
                .then((json) => {
                    for(let i = 0; i < json.children.length; i++) {
                        if(json.children[i].code !== this.props.params.code) {
                            this.setState({siblings: [...this.state.siblings, json.children[i]]})
                        }
                    }
                })
        }
    }

    /**
     * navigates to the child component
     * @param child
     */
    goToChild(child) {
        let navigate = this.props.navigation
        if(this.props.params.catalog === "MIGEL") {
            MIGEL.goToChild(child.code, navigate, this.props.params.language)
        } else if(this.props.params.catalog === "AL") {
            AL.goToChild(child.code, navigate, this.props.params.language)
        }
    }

    /**
     * Returns code in the correct language
     * @param code
     * @returns {string|*}
     */
    extractLabel(code){
        let language = this.props.params.language;
        if(code==="MIGEL"){
            switch (language) {
                case "fr":
                    return "LiMA"
                case "it":
                    return "EMAp"
                default: return "MiGeL";
            }
        }
        else if(code==="AL"){
            switch (language) {
                case "fr":
                    return "LA"
                case "it":
                    return "EA"
                default: return code;
            }
        }
        else if(code==="DRUG") {
            return "Med";
        }
        else return code;
    }

    /**
     * Render the CodeBodyUnversionized component
     * @returns {JSX.Element}
     */
    render() {
        let translateJson = findJsonService(this.props.params.language)
        let attributes_html = []
        let parentBreadCrumbs = []
        if(this.state.parents && this.state.parents.length > 0){
            for(let i=this.state.parents.length-1; i>=0; i--){
                parentBreadCrumbs.push(<Breadcrumb.Item
                    key={i}
                    onClick={() => this.goToChild(this.state.parents[i])}
                    className="breadLink"
                >{this.extractLabel(this.state.parents[i].code)}</Breadcrumb.Item>)
            }
        }
        let i = 1;
        for(let attribute in this.state) {
            if(this.state[attribute] !== null && this.state[attribute] !== undefined) {
                if(this.state[attribute].length > 0 && attribute === "limitation") {
                    attributes_html.push (
                        <div key={i}>
                            <h5>{translateJson["LBL_" + attribute.toUpperCase()]}</h5>
                            <p dangerouslySetInnerHTML={{__html: this.state[attribute]}}/>
                        </div>
                    )
                } else if(this.state[attribute].length > 0 && attribute !== "children" && attribute !== "text" && attribute !== "rev" &&
                    attribute !== "code" && attribute !== "version" && attribute !== "valid_to" && attribute !== "valid_from" && attribute !== "auth_holder_nr"
                    && attribute !== "atc_code" && attribute !== "pharma_form" && attribute !== "package_code" && attribute!=="auth_number") {
                    attributes_html.push(
                        <div key={i}>
                            <p><span><strong>{translateJson["LBL_" + attribute.toUpperCase()]}: </strong> </span><span dangerouslySetInnerHTML={{__html: this.state[attribute]}}/></p>
                        </div>
                    )
                }
            }
            i += 1
        }
        if(this.state["children"] && this.state["children"].length > 0) {
            attributes_html.push(
                <div key={i}>
                    <h5>{translateJson["LBL_CHILDREN"]}</h5>
                    <ul>
                        {this.state["children"].map((child, i) => (
                            <li key={i}><a key={"link to child: " + i} className="link" onClick={() => {this.goToChild(child)}}>{child.code}: </a>
                                <span key={"child text"} dangerouslySetInnerHTML={{__html: child.text}}/></li>
                        ))}
                    </ul>
                </div>
            )
        }
        if(this.state.siblings.length > 0 && !this.state["children"]) {
            attributes_html.push(
                <div key={4}>
                    <h5>{translateJson["LBL_SIBLINGS"]}</h5>
                    <ul>
                        {this.state.siblings.map((child, i) => (
                            <li key={i}><a className="link" onClick={() => {this.goToChild(child)}}>{child.code}: </a>
                                <span dangerouslySetInnerHTML={{__html: child.text}}/></li>
                        ))}
                    </ul>
                </div>
            )
        }
        return (
            <div>
                <Breadcrumb>
                    {parentBreadCrumbs}
                    <BreadcrumbItem active>{this.extractLabel(this.state["code"])}</BreadcrumbItem>
                </Breadcrumb>
                <h3>{this.extractLabel(this.state["code"])}</h3>
                <p dangerouslySetInnerHTML={{__html: this.state["text"]}} />
                {attributes_html}
            </div>
        )
    }
}

export default function(props) {
    const NAVIGATION = useNavigate();
    const LOCATION = useLocation();
    return <CodeBodyUnversionized {...props} navigation={NAVIGATION} location={LOCATION} params={useParams()}/>
}
