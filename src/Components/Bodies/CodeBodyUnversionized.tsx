import {useLocation, useNavigate, useParams} from "react-router-dom";
import React, {Component} from "react";
import {Breadcrumb, BreadcrumbItem} from "react-bootstrap";
import findJsonService from "../../Services/find-json.service";
import {ICode, IParamTypes} from "../../interfaces";
import {initialCodeState, skippableAttributes} from "../../Utils";
import RouterService from "../../Services/router.service";

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
     * @param resourceType ('migels', 'als', 'drugs')
     * @param code ('all' if base code, (non-)terminal code else)
     * @param catalog ('MIGEL', 'AL', 'DRUG')
     * @returns {Promise<null|any>}
     */
    async fetchHelper(language, resource_type, code, catalog) {
        let codeForFetch = code === 'all' ? catalog : code;
        let resourceType = catalog === 'AL' ? 'laboratory_analyses' : resource_type;
        return await fetch('https://search.eonum.ch/' + language + "/" + resourceType + "/" + catalog + "/" + codeForFetch + "?show_detail=1")
            .then((res) => {
                return res.json()
            })
    }

    /**
     * Fetch the information from the backend and does a case distinction for all the catalogs
     * @returns {Promise<void>}
     */
    async fetchInformations() {
        let newAttributes;
        const {language, code, resource_type, catalog} = this.props.params;
        newAttributes = await this.fetchHelper(language, resource_type, code, catalog)
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
     * Navigates to the specified AL or MIGEL code. Used for clickable codes and breadcrumbs, i.e. parents, children
     * and siblings and thus not needed for drugs.
     * @param code
     */
    goToCode(code) {
        let navigate = this.props.navigation;
        let language = this.props.params.language;
        let catalog = this.props.params.catalog;
        let resourceType = catalog === 'AL' ? 'laboratory_analyses' : this.props.params.resource_type;
        let queryString = "?query=" + RouterService.getQueryVariable('query');
        if (["MIGEL", "AL"].includes(catalog)) {
            navigate({
                pathname: "/" + language + "/" + catalog + "/" + resourceType + "/" + code.code,
                search: RouterService.getQueryVariable('query') === "" ? "" : queryString
            })
        }
    }

    /**
     * If input is a base code ('MIGEL', 'AL', 'DRUG'), the method returns the base code in the given language,
     *  otherwise just returns input.
     * @param code
     * @returns {string|*}
     */
    extractLabel(code){
        let language = this.props.params.language;
        switch (true) {
            case ((code === "MIGEL") && (language === "de")):
                return "MiGeL"
            case ((code === "MIGEL") && (language === "fr")):
                return "LiMA"
            case ((code === "MIGEL") && (language === "it")):
                return "EMAp"
            case ((code === "AL") && (language === "de")):
                return code
            case ((code === "AL") && (language === "fr")):
                return "LA"
            case ((code === "AL") && (language === "it")):
                return "EA"
            case (code === "DRUG"):
                return "Med"
            default:
                return code
        }
    }

    /**
     * Updates list of html elements with a clickable code attribute (used for subordinate or similar codes).
     */
    addClickableElement(translateJson, ind, attribute, attributeValue, attributesHtml) {
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
    addObjectElement(translateJson, attribute, ind, attributeValue, attributesHtml) {
        if (attributeValue.length) {
            attributesHtml.push(
                <div key={ind}>
                    <h5>{translateJson["LBL_" + attribute.toUpperCase()]}</h5>
                    <ul>
                        {attributeValue.map((val, j) => (
                            <li key={attribute + "_" + j}><p dangerouslySetInnerHTML={{__html: val}}/></li>
                        ))}
                    </ul>
                </div>
            )
        }
    }

    /**
     * Render the CodeBodyUnversionized component
     * @returns {JSX.Element}
     */
    render() {
        // Generate BreadCrumbs.
        let parentBreadCrumbs = [];
        if (this.state.parents) {
            for (let i = this.state.parents.length - 1; i >= 0; i--) {
                parentBreadCrumbs.push(
                    <Breadcrumb.Item
                        key={i}
                        onClick={() => this.goToCode(this.state.parents[i])}
                        className="breadLink"
                    >{this.extractLabel(this.state.parents[i].code)}</Breadcrumb.Item>)
            }
        }

        let translateJson = findJsonService(this.props.params.language);
        let attributesHtml = [];
        let i = 1;

        // Add all non null/empty/undefined code attributes to attributesHtml.
        for (let attribute in this.state.attributes) {
            // Skip attributes we do not want to show, like terminal, version, ... or add later (siblings and children).
            if (skippableAttributes.includes(attribute)) { continue; }
            // Get value of current attribute.
            let attributeValue = this.state.attributes[attribute];
            // Only show attribute if defined, not null or not empty.
            if (attributeValue != null || attributeValue != undefined) {
                if (typeof attributeValue === 'object') {
                    this.addObjectElement(translateJson, attribute, i, attributeValue, attributesHtml)
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
            this.addClickableElement(translateJson, i, 'children', this.state.attributes.children, attributesHtml)
        }

        // Add siblings (similar codes).
        if(this.state.siblings && !this.state.attributes["children"]) {
            this.addClickableElement(translateJson, i, "siblings", this.state.siblings, attributesHtml);
        }

        return (
            <div>
                <Breadcrumb>
                    {parentBreadCrumbs}
                    <BreadcrumbItem active>{this.extractLabel(this.state.attributes["code"])}</BreadcrumbItem>
                </Breadcrumb>
                <h3>{this.extractLabel(this.state.attributes["code"])}</h3>
                <p dangerouslySetInnerHTML={{__html: this.state.attributes["text"]}} />
                {attributesHtml}
            </div>
        )
    }
}

export default function(props) {
    const NAVIGATION = useNavigate();
    const LOCATION = useLocation();
    return <CodeBodyUnversionized {...props} navigation={NAVIGATION} location={LOCATION} params={useParams()}/>
}
