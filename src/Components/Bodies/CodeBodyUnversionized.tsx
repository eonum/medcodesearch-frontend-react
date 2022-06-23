import {useLocation, useNavigate, useParams} from "react-router-dom";
import React, {Component} from "react";
import {Breadcrumb, BreadcrumbItem} from "react-bootstrap";
import findJsonService from "../../Services/find-json.service";
import {
    collectBreadcrumbs,
    extractLabel,
    fetchGrandparents,
    fetchSiblings,
    fetchUnversionizedCodeInformations,
    initialCodeState
} from "../../Utils";
import {ICode, IParamTypes} from "../../interfaces";
import RouterService from "../../Services/router.service";

/**
 * Responsible for the body of the website, for catalogs with versions (i.e. ICD, CHOP, DRG, TARMED)
 */

interface Props {
    params: IParamTypes,
    navigation: any,
    location: any,
}

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
        await this.fetchSiblings()
        await this.fetchGrandparents()
    }

    /**
     * Set the new state after every update and calls for the fetch, sibling and grandparents methods
     * @param prevProps
     * @param prevState
     * @param snapshot
     * @returns {Promise<void>}
     */
    async componentDidUpdate(prevProps: Props, prevState: ICode, snapshot) {
            if (prevProps.params.language !== this.props.params.language ||
                prevProps.params.code !== this.props.params.code ||
                prevProps.params.catalog !== this.props.params.catalog) {
                this.setState(initialCodeState)
                await this.fetchInformations()
                await this.fetchSiblings()
                await this.fetchGrandparents()
            }
    }

    /**
     * Fetch the information from the backend and does a case distinction for all the catalogs
     * @returns {Promise<void>}
     */
    async fetchInformations() {
        const {language, resource_type, code, catalog} = this.props.params;
        const codeAttributes = await fetchUnversionizedCodeInformations(language, resource_type, code, catalog)
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
     * navigates to the child component
     * @param child
     */
    goToChild(child) {
        let navigate = this.props.navigation
        let pathPartialByCatalog = {
            'MIGEL': "/MIGEL/migels/",
            'AL': "/AL/als/"
        };
        let catalog = this.props.params.catalog;
        let language = this.props.params.language
        if(!(catalog === 'DRUG')) {
            navigate({pathname: "/" + language + pathPartialByCatalog[catalog] + child.code,
                search: RouterService.getQueryVariable('query') === "" ? "" : "?query=" + RouterService.getQueryVariable('query')})
        }
    }



    /**
     * Render the CodeBodyUnversionized component
     * @returns {JSX.Element}
     */
    render() {
        let translateJson = findJsonService(this.props.params.language)
        let attributes_html = []
        let parentBreadCrumbs = []
        let i = 1;
        let code_attributes = this.state.attributes;

        // Collect parent breadcrumbs.
        if(this.state.parents && this.state.parents.length > 0){
            parentBreadCrumbs = collectBreadcrumbs(this.state.parents);
        }

        // Collect attributes as html elements.
        for(let attribute in this.state.attributes) {
            if(code_attributes[attribute] !== null && code_attributes[attribute] !== undefined) {
                if(code_attributes[attribute].length > 0 && attribute === "limitation") {
                    attributes_html.push (
                        <div key={i}>
                            <h5>{translateJson["LBL_" + attribute.toUpperCase()]}</h5>
                            <p dangerouslySetInnerHTML={{__html: code_attributes[attribute]}}/>
                        </div>
                    )
                } else if(code_attributes[attribute].length > 0 && !["children", "text", "rev", "code", "version", "valid_to", "valid_from", "auth_holder_nr", "atc_code", "pharma_form", "package_code", "auth_number"].includes(attribute)) {
                    attributes_html.push(
                        <div key={i}>
                            <p><span><strong>{translateJson["LBL_" + attribute.toUpperCase()]}: </strong> </span><span dangerouslySetInnerHTML={{__html: code_attributes[attribute]}}/></p>
                        </div>
                    )
                }
            }
            i += 1
        }
        if(code_attributes["children"] && code_attributes["children"].length > 0) {
            attributes_html.push(
                <div key={i}>
                    <h5>{translateJson["LBL_CHILDREN"]}</h5>
                    <ul>
                        {code_attributes["children"].map((child, i) => (
                            <li key={i}><a key={"link to child: " + i} className="link" onClick={() => {this.goToChild(child)}}>{child.code}: </a>
                                <span key={"child text"} dangerouslySetInnerHTML={{__html: child.text}}/></li>
                        ))}
                    </ul>
                </div>
            )
        }
        if(this.state.siblings.length > 0 && !code_attributes["children"]) {
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
                    <BreadcrumbItem active>{extractLabel(code_attributes["code"], this.props.params.language)}
                    </BreadcrumbItem>
                </Breadcrumb>
                <h3>{extractLabel(code_attributes["code"], this.props.params.language)}</h3>
                <p dangerouslySetInnerHTML={{__html: code_attributes["text"]}} />
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
