import {useLocation, useNavigate, useParams} from "react-router-dom";
import React, {Component} from "react";
import MIGEL from "./MIGEL";
import AL from "./AL";
import {Breadcrumb, BreadcrumbItem} from "react-bootstrap";
import findJsonService from "../../Services/find-json.service";
import {ICode, IParamTypes} from "../../interfaces";
import {initialCodeState} from "../../Utils";

interface Props {
    params: IParamTypes,
    navigation: any,
    location: any,
}

/**
 * Responsible for the body of the website, for catalogs without versions (i.e. MIGEL, AL, DRUG)
 */
class CodeBodyUnversionized extends Component<Props, ICode> {
    constructor(props) {
        super(props);
        this.state = initialCodeState
    }

    /**
     * Calls for the fetch, sibling and grandparents methods
     * @returns {Promise<void>}
     */
    async componentDidMount() {
        await this.fetchInformations()
        await this.fetchSiblings(this.state.attributes["parent"])
        await this.fetchGrandparents(this.state.attributes["parent"])
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
                this.setState(initialCodeState)
                await this.fetchInformations()
                await this.fetchSiblings(this.state.attributes["parent"])
                await this.fetchGrandparents(this.state.attributes["parent"])
            }
    }

    /**
     * Does a case distinction for all the catalogs and set the string ready for fetching
     * @param language
     * @param resource_type
     * @param version
     * @param code
     * @returns {Promise<null|any>}
     */
    async fetchHelper(language, resource_type, version, code) {
        resource_type = resource_type.toUpperCase();
        if(code === "all") {
            code = resource_type
        }
        if (code === "all" && code !== 'AL') {
            return null
        } else {
            if (version === 'AL'){
                resource_type = resource_type + "/" + resource_type;
                code = '?show_detail=1'
            }
            return await fetch('https://search.eonum.ch/' + language + "/" + version + "/" + resource_type + "/" + code + "?show_detail=1")
                .then((res) => {
                    return res.json()
                })
        }
    }

    /**
     * Fetch the information from the backend and does a case distinction for all the catalogs
     * @returns {Promise<void>}
     */
    async fetchInformations() {
        let newAttributes, versions;
        if (this.props.params.catalog === "MIGEL") {
            versions = 'migels'
        }else if (this.props.params.catalog === "AL") {
            versions = 'laboratory_analyses';
        }else if (this.props.params.catalog === "DRUG") {
            versions = 'drugs'
        }
        newAttributes = await this.fetchHelper(this.props.params.language, this.props.params.catalog, versions, this.props.params.code)
        if (newAttributes !== null) {
            this.setState({attributes: newAttributes})
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
        if(this.state.attributes.children == null && parent) {
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
     * navigates to the specified code component
     * @param code
     */
    goToCode(code) {
        let navigate = this.props.navigation
        if(this.props.params.catalog === "MIGEL") {
            MIGEL.goToCode(code.code, navigate, this.props.params.language)
        } else if(this.props.params.catalog === "AL") {
            AL.goToCode(code.code, navigate, this.props.params.language)
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
     * Returns code in the correct language
     * @param code
     * @returns {string|*}
     */
    clickableListElement(translateJson, ind, attribute, attribute_value, attributes_html) {
        attributes_html.push(
            <div key={ind}>
                <h5>{translateJson["LBL_" + attribute.toUpperCase()]}</h5>
                <ul>
                    {attribute_value.map((val, j) => (
                        <li key={j}><a key={"related_code_" + j} className="link" onClick={() => {this.goToCode(val)}}>{val.code}: </a>
                            <span key={"code_text"} dangerouslySetInnerHTML={{__html: val.text}}/></li>
                    ))}
                </ul>
            </div>
    )
    }


    /**
     * Render the CodeBodyUnversionized component
     * @returns {JSX.Element}
     */
    render() {
        let parentBreadCrumbs = [];
        // TODO: Collecting Breadcrumbs will be refactored into Utils since we can use it for both un- & versionized codes.
        if(this.state.parents){
            for(let i=this.state.parents.length-1; i>=0; i--){
                parentBreadCrumbs.push(<Breadcrumb.Item
                    key={i}
                    onClick={() => this.goToCode(this.state.parents[i])}
                    className="breadLink"
                >{this.extractLabel(this.state.parents[i].code)}</Breadcrumb.Item>)
            }
        }

        let translateJson = findJsonService(this.props.params.language);
        let attributes_html = [];
        let all_attributes = this.state.attributes;
        let i = 1;
        let skippable_attributes = ["code", "text", "parent", "groups", "blocks", "terminal", "active", "version"];
        // TODO: below if else will be refactored into more compact code
        for(let attribute in all_attributes) {
            if (skippable_attributes.includes(attribute)) { continue; }
            let attribute_value = all_attributes[attribute];
            // Only show attribute if defined, not null or not empty.
            if(attribute_value || attribute_value === 0.0){
                if (attribute !== 'children') {
                    switch(attribute_value) {
                        case typeof attribute_value === 'object':
                            attributes_html.push(
                                <div key={i}>
                                    <h5>{translateJson["LBL_" + attribute.toUpperCase()]}</h5>
                                    <ul>
                                        {attribute_value.map((val, j) => (
                                            <li key={attribute + "_" + j}><p dangerouslySetInnerHTML={{__html: val}}/></li>
                                        ))}
                                    </ul>
                                </div>
                            )
                            i += 1
                        default:
                            attributes_html.unshift (
                                <div key={i}>
                                    <h5>{translateJson["LBL_" + attribute.toUpperCase()]}</h5>
                                    <p dangerouslySetInnerHTML={{__html: this.state.attributes[attribute]}}/>
                                </div>
                            )
                            i += 1
                    }
                }
                else { this.clickableListElement(translateJson, i, attribute, attribute_value, attributes_html) }
            }
        }
        if(this.state.siblings && !this.state.attributes["children"]) {
            this.clickableListElement(translateJson, i, "siblings", this.state.siblings, attributes_html);
        }
        return (
            <div>
                <Breadcrumb>
                    {parentBreadCrumbs}
                    <BreadcrumbItem active>{this.extractLabel(this.state.attributes["code"])}</BreadcrumbItem>
                </Breadcrumb>
                <h3>{this.extractLabel(this.state.attributes["code"])}</h3>
                <p dangerouslySetInnerHTML={{__html: this.state.attributes["text"]}} />
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
