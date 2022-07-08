import {useLocation, useNavigate, useParams} from "react-router-dom";
import React, {Component} from "react";
import ICD from "./ICD"
import CHOP from "./CHOP";
import TARMED from "./TARMED";
import DRG from "./DRG";
import {Breadcrumb} from "react-bootstrap";
import findJsonService from "../../Services/find-json.service";
import {ICode, IParamTypes, IParamTypesVersionized} from "../../interfaces";
import {initialCodeState} from "../../Utils";
import IcdSortService from "../../Services/icd-sort.service";
import CodeSortService from "../../Services/code-sort.service";
import RouterService from "../../Services/router.service";

interface Props {
    params: IParamTypesVersionized,
    navigation: any,
    location: any,
}

/**
 * Responsible for the body of the website, for catalogs with versions (i.e. ICD, CHOP, DRG, TARMED).
 */
class CodeBodyVersionized extends Component<Props, ICode> {
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
        await this.fetchSiblings(this.state.attributes.parent)
        await this.fetchGrandparents(this.state.attributes.parent)
    }

    /**
     * Set the new state after every update and calls for the fetch, sibling and grandparents methods
     * @param prevProps
     * @param prevState
     * @param snapshot
     * @returns {Promise<void>}
     */
    async componentDidUpdate(prevProps, prevState, snapshot) {
        if(prevProps.params.language !== this.props.params.language ||
            prevProps.params.version !== this.props.params.version ||
            prevProps.params.code !== this.props.params.code) {
            this.setState(initialCodeState)
            await this.fetchInformations()
            await this.fetchSiblings(this.state.attributes.parent)
            await this.fetchGrandparents(this.state.attributes.parent)
        }
    }

    /**
     * Does a case distinction for all the catalogs and set the string ready for fetching
     * @param language
     * @param resourceType ('icd_chapters', 'icd_groups', 'icds', 'chop_chapters', ...)
     * @param code (equal to version if base code, (non-)terminal code else)
     * @param catalog ('ICD', 'CHOP', 'DRG', 'TARMED')
     * @param version ('ICD10-GM-2022', 'ICD10-GM-2021', ...)
     * @returns {Promise<null|any>}
     */
    async fetchHelper(language, resourceType, code, catalog, version, attributes) {
        let newAttributes = attributes;
        let codeForFetch = code;
        // Set base code for mdcs, since this is not equal to version but equal to 'ALL'.
        if (resourceType === 'mdcs' && code === version) {
            codeForFetch = 'ALL'
        }
        let sortService = catalog === 'ICD' ? IcdSortService : CodeSortService;
        let fetchString = ['https://search.eonum.ch', language, resourceType, version, codeForFetch, "?show_detail=1"].join("/");
        return await fetch(fetchString)
            .then((res) => res.json())
            .then((json) => {
                for(let attribute in attributes) {
                    newAttributes[attribute] = json[attribute]
                }
                if(version === code && ["ICD", "CHOP", "DRG"].includes(catalog)) {
                    newAttributes["children"] = sortService(json["children"])
                }
            })
            .then(() => {return newAttributes})
    }

    /**
     * Fetch the information from the backend and does a case distinction for all the catalogs
     * @returns {Promise<void>}
     */
    async fetchInformations() {
        let detailedCode;
        let {language, catalog, resource_type, code, version} = this.props.params;
        detailedCode = await this.fetchHelper(language, resource_type, code, catalog, version, this.state.attributes)
        if (detailedCode !== null) {
            this.setState({attributes: detailedCode})
        }
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
     * Navigates to the specified code.
     * @param code
     */
    goToCode(code) {
        let catalog = this.props.params.catalog;
        // Transform backend of code to frontend url for navigation
        // TODO: This split and assignment feels kinda error prone or unstylish but saves a ton of distinctions that
        //  where made via regexes. Any style suggestions?
        let backend_url_components = code.url.split("/").filter(e => e);
        let language = backend_url_components[0];
        let resourceType = backend_url_components[1];
        let version = backend_url_components[2];
        let codeFromBackend = backend_url_components[3];
        // Convert base code 'ALL' from SwissDrg to version.
        let codeToNavigate = codeFromBackend === 'ALL' ? version : codeFromBackend;
        let navigate = this.props.navigation
        let queryString = "?query=" + RouterService.getQueryVariable('query');
        navigate({
            pathname: "/" + language + "/" + catalog + "/" + version + "/" + resourceType + "/" + codeToNavigate,
            search: RouterService.getQueryVariable('query') === "" ? "" : queryString
        })
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
    // TODO: I will refactor below code into Utils since we can use this for versionized and unversionized codes.
    async fetchSiblings(parent) {
        if(this.state.attributes.children == null) {
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
    // TODO: I will refactor below code into Utils since we can use this for versionized and unversionized codes.
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

        // TODO: below if else will be refactored into more compact code
        var mappingFields = ['predecessors', 'successors'];
        // Define div for predecessor code info
        for(var j = 0; j < mappingFields.length; j++) {
            var field = mappingFields[j];
            if (this.state.attributes[field] != null) {
                // is this a non-trivial mapping?
                if(this.state.attributes[field].length > 1 || this.state.attributes[field].length == 1 && (this.state.attributes[field][0]['code'] != this.state.attributes['code'] || this.state.attributes[field][0]['text'] != this.state.attributes['text'])) {
                    attributes_html.push(
                        <div key={"mapping_pre_succ" + j}>
                            <h5>{translateJson["LBL_" + field.toUpperCase()]}</h5>
                            <ul>
                                {this.state.attributes[field].map((child,i) => (
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
                    onClick={() => this.goToCode(this.state.parents[i])}
                    className="breadLink"
                >{this.state.parents[i].code}</Breadcrumb.Item>)
            }
        }
        for(let attribute in this.state.attributes) {
            if(this.state.attributes[attribute] !== null && this.state.attributes[attribute] !== undefined) {
                if(attribute === "med_interpret" || attribute === "tech_interpret") {
                    attributes_html.push(
                        <div key={"med/tech interpret" + this.state.attributes[attribute].length * 41}>
                            <p>{this.state.attributes[attribute]}</p>
                        </div>
                    )
                } else if(attribute === "tp_al" || attribute === "tp_tl") {
                    if(this.state.attributes[attribute] !== 0) {
                        attributes_html.push(
                            <div key={"tp_al/tl" + this.state.attributes[attribute] * 37}>
                                <p>{translateJson["LBL_" + attribute.toUpperCase()]}: {this.state.attributes[attribute]}</p>
                            </div>
                        )
                    }
                }
                else if(attribute === "note" || attribute === "coding_hint" || attribute === "usage") {
                    attributes_html.push(
                        <div key={"note coding_hint usage" + this.state.attributes[attribute].length * 31}>
                            <h5>{translateJson["LBL_" + attribute.toUpperCase()]}</h5>
                            <p>{this.state.attributes[attribute]}</p>
                        </div>
                    )
                } else if(this.state.attributes[attribute].length > 0 && (attribute === "groups" || attribute === "blocks")) {
                    attributes_html.push(
                        <div key={"groups " + this.state.attributes[attribute].length * 19}>
                            <h5>{translateJson["LBL_" + attribute.toUpperCase()]}</h5>
                            <ul>
                                {this.state.attributes[attribute].map((child, i) => (
                                    <li key={child.code + "childcode " + (i * 17)}>{child.code}: {child.text}</li>
                                ))}
                            </ul>
                        </div>
                    )
                }
                else if(this.state.attributes[attribute].length > 0 && (attribute === "inclusions" || attribute === "synonyms" || attribute === "most_relevant_drgs" || attribute === "descriptions" || attribute === "notes")) {
                    attributes_html.push(
                        <div key={"incl, syn, rel_drgs, descr " + this.state.attributes[attribute].length * 13}>
                            <h5>{translateJson["LBL_" + attribute.toUpperCase()]}</h5>
                            <ul>
                                {this.state.attributes[attribute].map((element, i) => (
                                    <li key={"element nr " + i}>{element}</li>
                                ))}
                            </ul>
                        </div>
                    )
                } else if(this.state.attributes[attribute].length > 0 && (attribute === "exclusions" || attribute === "supplement_codes")) {
                    attributes_html.push(
                        <div key={"exclusions supp_codes " + this.state.attributes[attribute].length * 11}>
                            <h5>{translateJson["LBL_" + attribute.toUpperCase()]}</h5>
                            <ul>
                                {this.state.attributes[attribute].map((exclusion, i) => (
                                    this.lookingForLink(exclusion, i)
                                ))}
                            </ul>
                        </div>
                    )
                } else if(attribute === "predecessors" && this.state.attributes[attribute].length === 0 && this.state.attributes.children == null) {
                    attributes_html.push(
                        <div key={"predec " + this.state.attributes[attribute].length * 7}>
                            <h5>{translateJson["LBL_NEW_CODE"]}</h5>
                        </div>
                    )
                }
                else if(this.state.attributes[attribute].length > 0 && attribute === "children") {
                    attributes_html.push(
                        <div key={"children" + this.state.attributes[attribute].length * 29}>
                            <h5>{translateJson["LBL_" + attribute.toUpperCase()]}</h5>
                            <ul>
                                {this.state.attributes[attribute].map((child, i) => (
                                    <li key={child + " number " + (i * 23)}><a className="link" onClick={() => {this.goToCode(child)}}>{child.code}:</a> {child.text}</li>
                                ))}
                            </ul>
                        </div>
                    )
                }
            }
        }
        if(this.state.siblings.length > 0 && !this.state.attributes["children"]) {
            attributes_html.push(
                <div key={4}>
                    <h5>{translateJson["LBL_SIBLINGS"]}</h5>
                    <ul>
                        {this.state.siblings.map((child, i) => (
                            <li key={i}><a className="link" onClick={() => {this.goToCode(child)}}>{child.code}: </a>
                                <span dangerouslySetInnerHTML={{__html: child.text}}/></li>
                        ))}
                    </ul>
                </div>
            )
        }
        if(this.props.params.catalog === "ICD") {
            return <ICD key={this.state.attributes.code} title={this.state.attributes.code} text={this.state.attributes.text} attributes={attributes_html} parents={parentBreadCrumbs}/>
        } else if(this.props.params.catalog === "CHOP") {
            return <CHOP key={this.state.attributes.code} title={this.state.attributes.code} text={this.state.attributes.text} attributes={attributes_html} parents={parentBreadCrumbs}/>
        } else if(this.props.params.catalog === "TARMED") {
            return <TARMED key={this.state.attributes.code} title={this.state.attributes.code} text={this.state.attributes.text} attributes={attributes_html} parents={parentBreadCrumbs}/>
        } else {
            return <DRG key={this.state.attributes.code} title={this.state.attributes.code} text={this.state.attributes.text} attributes={attributes_html} parents={parentBreadCrumbs}/>
        }
    }
}

export default function(props) {
    const NAVIGATION = useNavigate();
    const LOCATION = useLocation();
    return <CodeBodyVersionized {...props} navigation={NAVIGATION} location={LOCATION} params={useParams()} key={"bodyI"}/>
}
