import {useLocation, useNavigate, useParams} from "react-router-dom";
import React, {Component} from "react";
import ICD from "./ICD"
import CHOP from "./CHOP";
import TARMED from "./TARMED";
import DRG from "./DRG";
import {Breadcrumb, BreadcrumbItem} from "react-bootstrap";
import findJsonService from "../../Services/find-json.service";
import {
    collectBreadcrumbs,
    fetchGrandparents,
    fetchSiblings,
    fetchVersionizedCodeInformations,
    initialCodeState
} from '../../Utils';
import {ICode, IParamTypesVersionized} from '../../interfaces';

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
        await this.fetchSiblings()
        await this.fetchGrandparents();
    }

    /**
     * Set the new state after every update and calls for the fetch, sibling and grandparents methods
     * @param prevProps
     * @param prevState
     * @param snapshot
     * @returns {Promise<void>}
     */
    async componentDidUpdate(prevProps: Props, prevState: ICode, snapshot) {
        if(prevProps.params.language !== this.props.params.language ||
            prevProps.params.version !== this.props.params.version ||
            prevProps.params.code !== this.props.params.code) {
            this.setState(initialCodeState)
            await this.fetchInformations()
            await this.fetchSiblings()
            await this.fetchGrandparents();
        }
    }

    /**
     * Fetch the information from the backend and does a case distinction for all the catalogs
     * @returns {Promise<void>}
     */
    async fetchInformations() {
        const {language, resource_type, version, code, catalog} = this.props.params;
        const codeAttributes = await fetchVersionizedCodeInformations(language, resource_type, version, code, catalog,
            this.state.attributes)
        this.setState({attributes: codeAttributes})
    }

    /**
     * Fetch siblings of the code.
     * @param parent
     * @returns {Promise<void>}
     */
    async fetchSiblings() {
        const children = this.state.attributes.children;
        const parent = this.state.attributes.parent;
        const siblings = this.state.siblings;
        const code = this.props.params.code;
        let fetchedSiblings = await fetchSiblings(children, parent, siblings, code)
        this.setState({siblings: fetchedSiblings})
    }

    /**
     * Fetch grandparents of the code.
     * @param parent
     * @returns {Promise<void>}
     */
    async fetchGrandparents() {
        let fetchedGrandParents = await fetchGrandparents(this.state.attributes.parent)
        this.setState({parents: fetchedGrandParents})
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
        let navigate = this.props.navigation;
        let catalog = this.props.params.catalog;
        let url_code = child.code.replace(" ", "_");
        let url = catalog === 'DRG' ? child.url : null;
        let version = this.props.params.version;
        let language = this.props.params.language;
        let componentByCatalog = {
            'DRG': DRG,
            'CHOP': CHOP,
            'ICD': ICD,
            'TARMED': TARMED
        };
        componentByCatalog[catalog].goToChild(url_code, navigate, version, language, url)
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
     * Render the body component
     * @returns {JSX.Element}
     */
    render() {
        let translateJson = findJsonService(this.props.params.language);
        let attributes_html = [];
        let parentBreadCrumbs = [];
        let code_attributes = this.state.attributes;

        var mappingFields = ['predecessors', 'successors'];
        // Define div for predecessor code info
        for(var j = 0; j < mappingFields.length; j++) {
            var field = mappingFields[j];
            if (code_attributes[field] != null) {
                // is this a non-trivial mapping?
                if(code_attributes[field].length > 1 || code_attributes[field].length == 1 && (code_attributes[field][0]['code'] != code_attributes['code'] || code_attributes[field][0]['text'] != code_attributes['text'])) {
                    attributes_html.push(
                        <div key={"mapping_pre_succ" + j}>
                            <h5>{translateJson["LBL_" + field.toUpperCase()]}</h5>
                            <ul>
                                {code_attributes[field].map((child,i) => (
                                    <li key={child + "_" + i}><b>{child.code}</b>{" " +  child.text}</li>
                                    ))}
                            </ul>
                        </div>)
                }
            }
        }

        // Collect parent breadcrumbs.
        if(this.state.parents && this.state.parents.length > 0){
            parentBreadCrumbs = collectBreadcrumbs(this.state.parents);
        }

        // Collect attributes as html elements.
        for(let attribute in code_attributes) {
            if(code_attributes[attribute] !== null && code_attributes[attribute] !== undefined) {
                if(attribute === "med_interpret" || attribute === "tech_interpret") {
                    attributes_html.push(
                        <div key={"med/tech interpret" + code_attributes[attribute].length * 41}>
                            <p>{code_attributes[attribute]}</p>
                        </div>
                    )
                } else if(attribute === "tp_al" || attribute === "tp_tl") {
                    if(code_attributes[attribute] !== 0) {
                        attributes_html.push(
                            <div key={"tp_al/tl" + code_attributes[attribute] * 37}>
                                <p>{translateJson["LBL_" + attribute.toUpperCase()]}: {code_attributes[attribute]}</p>
                            </div>
                        )
                    }
                }
                else if(attribute === "note" || attribute === "coding_hint" || attribute === "usage") {
                    attributes_html.push(
                        <div key={"note coding_hint usage" + code_attributes[attribute].length * 31}>
                            <h5>{translateJson["LBL_" + attribute.toUpperCase()]}</h5>
                            <p>{code_attributes[attribute]}</p>
                        </div>
                    )
                } else if(code_attributes[attribute].length > 0 && (attribute === "children" || attribute === "siblings")) {
                    attributes_html.push(
                        <div key={"children_siblings" + code_attributes[attribute].length * 29}>
                            <h5>{translateJson["LBL_" + attribute.toUpperCase()]}</h5>
                            <ul>
                                {code_attributes[attribute].map((child, i) => (
                                    <li key={child + " number " + (i * 23)}><a className="link" onClick={() => {this.goToChild(child)}}>{child.code}:</a> {child.text}</li>
                                ))}
                            </ul>
                        </div>
                    )
                } else if(code_attributes[attribute].length > 0 && (attribute === "groups" || attribute === "blocks")) {
                    attributes_html.push(
                        <div key={"groups " + code_attributes[attribute].length * 19}>
                            <h5>{translateJson["LBL_" + attribute.toUpperCase()]}</h5>
                            <ul>
                                {code_attributes[attribute].map((child, i) => (
                                    <li key={child.code + "childcode " + (i * 17)}>{child.code}: {child.text}</li>
                                ))}
                            </ul>
                        </div>
                    )
                }
                else if(code_attributes[attribute].length > 0 && (attribute === "inclusions" || attribute === "synonyms" || attribute === "most_relevant_drgs" || attribute === "descriptions" || attribute === "notes")) {
                    attributes_html.push(
                        <div key={"incl, syn, rel_drgs, descr " + code_attributes[attribute].length * 13}>
                            <h5>{translateJson["LBL_" + attribute.toUpperCase()]}</h5>
                            <ul>
                                {code_attributes[attribute].map((element, i) => (
                                    <li key={"element nr " + i}>{element}</li>
                                ))}
                            </ul>
                        </div>
                    )
                } else if(code_attributes[attribute].length > 0 && (attribute === "exclusions" || attribute === "supplement_codes")) {
                    attributes_html.push(
                        <div key={"exclusions supp_codes " + code_attributes[attribute].length * 11}>
                            <h5>{translateJson["LBL_" + attribute.toUpperCase()]}</h5>
                            <ul>
                                {code_attributes[attribute].map((exclusion, i) => (
                                    this.lookingForLink(exclusion, i)
                                ))}
                            </ul>
                        </div>
                    )
                } else if(attribute === "predecessors" && code_attributes[attribute].length === 0 && code_attributes.children == null) {
                    attributes_html.push(
                        <div key={"predec " + code_attributes[attribute].length * 7}>
                            <h5>{translateJson["LBL_NEW_CODE"]}</h5>
                        </div>
                    )
                }
            }
        }
        return (
            <div>
                <Breadcrumb>
                    {parentBreadCrumbs}
                    <Breadcrumb.Item active>{code_attributes.code.replace("_", " ")}</Breadcrumb.Item>
                </Breadcrumb>
                <h3>{code_attributes.code.replace("_", " ")}</h3>
                <p>{code_attributes.text}</p>
                {attributes_html}
            </div>
        )
    }
}

export default function(props) {
    const NAVIGATION = useNavigate();
    const LOCATION = useLocation();
    return <CodeBodyVersionized {...props} navigation={NAVIGATION} location={LOCATION} params={useParams()}/>
}
