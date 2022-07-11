import {useLocation, useNavigate, useParams} from "react-router-dom";
import React, {Component} from "react";
import {Breadcrumb} from "react-bootstrap";
import findJsonService from "../../Services/find-json.service";
import {ICode, IParamTypesVersionized} from "../../interfaces";
import {initialCodeState, skippableAttributes} from "../../Utils";
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
     * @param resource_type ('icd_chapters', 'icd_groups', 'icds', 'chop_chapters', ...)
     * @param code (equal to version if base code, (non-)terminal code else)
     * @param catalog ('ICD', 'CHOP', 'DRG', 'TARMED')
     * @param version ('ICD10-GM-2022', 'ICD10-GM-2021', ...)
     * @returns {Promise<null|any>}
     */
    async fetchHelper(language, resource_type, code, catalog, version) {
        let fetchString = ['https://search.eonum.ch', language, resource_type, version, code, "?show_detail=1"].join("/");
        return await fetch(fetchString)
            .then((res) => {
                return res.json()
            })
    }

    /**
     * Fetch the information from the backend and does a case distinction for all the catalogs
     * @returns {Promise<void>}
     */
    async fetchInformations() {
        let detailedCode;
        let {language, catalog, resource_type, code, version} = this.props.params;
        let sortService = catalog === 'ICD' ? IcdSortService : CodeSortService;
        let codeForFetch = code;
        // Set base code for mdcs, since this is not equal to version but equal to 'ALL'.
        if (resource_type === 'mdcs' && code === version) {
            codeForFetch = 'ALL'
        }
        detailedCode = await this.fetchHelper(language, resource_type, codeForFetch, catalog, version)
        if (version === code) {
            detailedCode["children"] = sortService(detailedCode["children"])
        }
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
        let {language, catalog, version, resource_type} = this.props.params;
        // Transform backend of code to frontend url for navigation
        // TODO: This split and assignment feels kinda error prone or unstylish but saves a ton of distinctions that
        //  where made via regexes. Any style suggestions?
        let backend_url_components = code.url.split("/").filter(e => e);
        let codeFromBackend = backend_url_components[3];
        // Convert base code 'ALL' from SwissDrg to version.
        let codeToNavigate = codeFromBackend === 'ALL' ? version : codeFromBackend;
        let navigate = this.props.navigation
        let queryString = "?query=" + RouterService.getQueryVariable('query');
        let pathname = [language, catalog, version, resource_type, codeToNavigate].join("/")
        navigate({
            pathname: "/" + pathname,
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
    // TODO: Does it make sense to refactor grandparents and siblings fetching into utils to share between un- and
    //  versionized bodies (maybe not since we're setting state)?
    async fetchSiblings(parent) {
        if(this.state.attributes.children == null && this.props.params.resource_type != "partitions") {
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
     * Updates list of html elements with a clickable code attribute (used for subordinate or similar codes).
     */
    addClickableCodeAttribute(translateJson, ind, attribute, attributeValue, attributesHtml) {
        if (attributeValue.length) {
            attributesHtml.push(
                <div key={ind}>
                    <h5>{translateJson["LBL_" + attribute.toUpperCase()]}</h5>
                    <ul>
                        {attributeValue.map((val, j) => (
                            <li key={j}><a key={"related_code_" + j} className="link" onClick={() => {
                                this.goToCode(val)
                            }}>{val.code}: </a>
                                <span key={"code_text"} dangerouslySetInnerHTML={{__html: val.text}}/></li>
                        ))}
                    </ul>
                </div>
            )
        }
    }

    /**
     * Updates attributes_html with attribute of non clickable object type.
     */
    addObjectTypeCodeAttribute(translateJson, attribute, ind, attributeValue, attributesHtml) {
        if (attributeValue.length) {
            attributesHtml.push(
                <div key={ind}>
                    <h5>{translateJson["LBL_" + attribute.toUpperCase()]}</h5>
                    <ul>
                        {attributeValue.map((val, j) => (
                            this.objectListElement(attribute, val, j)
                        ))}
                    </ul>
                </div>
            )
        }
    }

    objectListElement(attribute, val, j) {
        if (["exclusions", "supplement_codes"].includes(attribute)) {
            return this.lookingForLink(val, j)
        }
        else {
            return <li key={attribute + "_" + j}><p dangerouslySetInnerHTML={{__html: val}}/></li>
        }
    }

    /**
     * Render the body component
     * @returns {JSX.Element}
     */
    render() {
        // Generate BreadCrumbs.
        let parentBreadCrumbs = [];
        if (this.state.parents) {
            for(let i=this.state.parents.length-1; i>=0; i--){
                parentBreadCrumbs.push(<Breadcrumb.Item
                    key={i}
                    onClick={() => this.goToCode(this.state.parents[i])}
                    className="breadLink"
                >{this.state.parents[i].code}</Breadcrumb.Item>)
            }
        }

        let translateJson = findJsonService(this.props.params.language);
        let mappingFields = ['predecessors', 'successors'];
        let attributesHtml = [];
        let i = 1;

        // TODO: below if else will be refactored into more compact code
        // Define div for predecessor code info
        for(var j = 0; j < mappingFields.length; j++) {
            var field = mappingFields[j];
            if (this.state.attributes[field] != null) {
                // is this a non-trivial mapping?
                if(this.state.attributes[field].length > 1 ||
                    this.state.attributes[field].length == 1 &&
                    (this.state.attributes[field][0]['code'] != this.state.attributes['code'] ||
                        this.state.attributes[field][0]['text'] != this.state.attributes['text'])) {
                    attributesHtml.push(
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

        // Add all non null/empty/undefined code attributes to attributesHtml.
        for (let attribute in this.state.attributes) {
            // Skip attributes we do not want to show, like terminal, version, ... or add later (siblings and children).
            if (skippableAttributes.includes(attribute)) { continue; }
            // Get value of current attribute.
            let attributeValue = this.state.attributes[attribute];
            // Only show attribute if defined, not null or not empty.
            if (!["", null, undefined].includes(attributeValue)) {
                if (typeof attributeValue === 'object') {
                    this.addObjectTypeCodeAttribute(translateJson, attribute, i, attributeValue, attributesHtml)
                    i += 1
                } else {
                    attributesHtml.push(
                        <div key={i}>
                            <h5>{translateJson["LBL_" + attribute.toUpperCase()]}</h5>
                            <p dangerouslySetInnerHTML={{__html: this.state.attributes[attribute]}}/>
                        </div>
                    )
                    i += 1
                }
            }
        }

        // Add children (subordinate codes).
        if (this.state.attributes.children) {
            this.addClickableCodeAttribute(translateJson, i, 'children', this.state.attributes.children, attributesHtml)
        }

        // Add siblings (similar codes).
        if(this.state.siblings && !this.state.attributes["children"]) {
            this.addClickableCodeAttribute(translateJson, i, "siblings", this.state.siblings, attributesHtml);
        }

        let title = this.state.attributes.code.replace("_", " ");
        return (
            <div>
                <Breadcrumb>
                    {parentBreadCrumbs}
                    <Breadcrumb.Item active>{title}</Breadcrumb.Item>
                </Breadcrumb>
                <h3>{title}</h3>
                <p>{this.state.attributes.text}</p>
                {attributesHtml}
            </div>
        )
    }
}

export default function(props) {
    const NAVIGATION = useNavigate();
    const LOCATION = useLocation();
    return <CodeBodyVersionized {...props} navigation={NAVIGATION} location={LOCATION} params={useParams()} key={"bodyI"}/>
}
