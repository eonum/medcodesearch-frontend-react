import {useLocation, useNavigate, useParams} from "react-router-dom";
import React, {Component} from "react";
import {Breadcrumb, BreadcrumbItem} from "react-bootstrap";
import findJsonService from "../../Services/find-json.service";
import {ICode, IParamTypes} from "../../interfaces";
import {fetchURL, initialCodeState, skippableAttributes} from "../../Utils";
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
     * @param resource_type ('migels', 'als', 'drugs')
     * @param code ('all' if base code, (non-)terminal code else)
     * @param catalog ('MIGEL', 'AL', 'DRUG')
     * @returns {Promise<null|any>}
     */
    async fetchHelper(language, resource_type, code, catalog) {
        let fetchString = [fetchURL, language, resource_type, catalog, code].join("/") + "?show_detail=1"
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
        let newAttributes;
        const {language, code, resource_type, catalog} = this.props.params;
        let codeForFetch = code === 'all' ? catalog : code;
        newAttributes = await this.fetchHelper(
            language,
            catalog === 'AL' ? 'laboratory_analyses' : resource_type,
            codeForFetch,
            catalog)
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
            await fetch([fetchURL, parent.url].join("/") + "?show_detail=1")
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
            await fetch([fetchURL, parent.url].join("/") + "?show_detail=1")
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
        let pathname = [language, catalog, catalog === 'AL' ? 'laboratory_analyses' : this.props.params.resource_type, code.code].join("/")
        let queryString = "?query=" + RouterService.getQueryVariable('query');
        if (["MIGEL", "AL"].includes(catalog)) {
            navigate({
                pathname: "/" + pathname,
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
     * Returns a unordered list of clickable codes (used for subordinate or similar codes).
     */
    clickableCodesArray(translateJson, attribute, attributeValue) {
        return <div key={attribute}>
            <h5>{translateJson["LBL_" + attribute.toUpperCase()]}</h5>
            <ul>
                {attributeValue.map((val, j) => (
                    <li key={j}><a key={attribute + "_" + j} className="link" onClick={() => {
                        this.goToCode(val)
                    }}>{val.code}: </a>
                        <span key={"code_text"} dangerouslySetInnerHTML={{__html: val.text}}/></li>
                ))}
            </ul>
        </div>
    }

    /**
     * Render the CodeBodyUnversionized component
     * @returns {JSX.Element}
     */
    render() {
        // Generate BreadCrumbs.
        let parentBreadCrumbs = this.state.parents.reverse().map((currElement, i) => {
            let breadcrumbItem =
                <Breadcrumb.Item key={i} onClick={() => this.goToCode(currElement)} className="breadLink">
                    {this.extractLabel(currElement.code)}
                </Breadcrumb.Item>
            return breadcrumbItem;
        })

        let translateJson = findJsonService(this.props.params.language);

        // Use filter to only select attributes we want to display (not in skippable attributes and value not null,
        // undefined or empty.
        let codeAttributes = Object.keys(this.state.attributes)
            .filter((key) => !skippableAttributes.includes(key))
            .filter((key) => !["", null, undefined].includes(this.state.attributes[key]))
            .filter((key) => this.state.attributes[key].length)
            .reduce((obj, key) => {
                return Object.assign(obj, {
                    [key]: this.state.attributes[key]
                });
            }, {});

        let attributesHtml = Object.keys(codeAttributes).map((attribute) => {
            let attributeValue = codeAttributes[attribute];
            if (typeof attributeValue === 'object') {
                return <div key={attribute}>
                    <h5>{translateJson["LBL_" + attribute.toUpperCase()]}</h5>
                    <ul>
                        {attributeValue.map((val, j) => (
                            <li key={attribute + "_" + j}><p dangerouslySetInnerHTML={{__html: val}}/></li>
                        ))}
                    </ul>
                </div>
            } else {
                return <div key={attribute}>
                    <h5>{translateJson["LBL_" + attribute.toUpperCase()]}</h5>
                    <p dangerouslySetInnerHTML={{__html: this.state.attributes[attribute]}}/>
                </div>
            }
        })

        // Add swissmedic number for drugs.
        if (this.props.params.catalog === "DRUG" && this.props.params.code != 'all') {
            attributesHtml.push(
                <div key={"swissmedic_nr"}>
                    <h5>{translateJson["LBL_SWISSMEDIC_NR"]}</h5>
                    <p> {this.state.attributes.auth_number + this.state.attributes.package_code} </p>
                </div>
            )
        }

        // Add children (subordinate codes).
        let children = this.state.attributes.children;
        if (children) {
            attributesHtml.push(this.clickableCodesArray(translateJson, 'children', children))
        }

        // Add siblings (similar codes).
        let siblings = this.state.siblings;
        if(siblings.length && !children) {
            attributesHtml.push(this.clickableCodesArray(translateJson, "siblings", siblings))
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
    return <CodeBodyUnversionized {...props} navigation={NAVIGATION} location={LOCATION} params={useParams()} key={"unversionized_body"}/>
}
