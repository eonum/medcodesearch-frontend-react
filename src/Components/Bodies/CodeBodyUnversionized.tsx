import {useNavigate, useParams} from "react-router-dom";
import React, {Component} from "react";
import {Breadcrumb, BreadcrumbItem} from "react-bootstrap";
import {ICode, INavigationHook, IParamTypes} from "../../interfaces";
import {fetchURL, initialCodeState} from "../../Utils";
import RouterService from "../../Services/router.service";
import CodeAttributesUnversionized from "../CodeAttributes/CodeAttributesUnversionized";

interface Props {
    params: IParamTypes,
    navigation: INavigationHook,
    selectedDate: string
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
        if (this.state.attributes["parent"]) {
            await this.fetchSiblings(this.state.attributes["parent"])
        }
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
                prevProps.params.catalog !== this.props.params.catalog ||
                prevProps.selectedDate !== this.props.selectedDate) {
                this.setState(initialCodeState)
                await this.fetchInformations()
                if (this.state.attributes["parent"]) {
                    await this.fetchSiblings(this.state.attributes["parent"])
                }
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
        let fetchString = [fetchURL, language, resource_type, catalog, code].join("/") +
            "?show_detail=1&date=" + this.props.selectedDate;
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
        let fetchString = [fetchURL, parent.url].join("/") + "?show_detail=1&date=" + this.props.selectedDate;
        await fetch(fetchString)
            .then((res) => res.json())
            .then((json) => {
                for (let i = 0; i < json.children.length; i++) {
                    if (json.children[i].code !== this.props.params.code) {
                        this.setState({siblings: [...this.state.siblings, json.children[i]]})
                    }
                }
            })
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
     * Render the CodeBodyUnversionized component
     * @returns {JSX.Element}
     */
    render() {
        let navigate = this.props.navigation;
        let {language, catalog, resource_type, code} = this.props.params;
        let siblings = this.state.siblings;

        return (
            <div>
                <Breadcrumb>
                    {this.state.parents.reverse().map((currElement, i) => {
                        return (
                            <Breadcrumb.Item key={i} onClick={() => {
                                let pathname = "/" + [language, catalog, catalog === 'AL' ? 'laboratory_analyses' : resource_type , currElement.code].join("/")
                                let searchString = RouterService.getQueryVariable('query') === "" ? "" : "?query=" + RouterService.getQueryVariable('query');
                                if (["MIGEL", "AL"].includes(catalog)) {
                                    navigate({pathname: pathname, search: searchString})
                                }
                            }} className="breadLink">
                                {this.extractLabel(currElement.code)}
                            </Breadcrumb.Item>
                        )})}
                    <BreadcrumbItem active>{this.extractLabel(this.state.attributes["code"])}</BreadcrumbItem>
                </Breadcrumb>
                <h3>{this.extractLabel(this.state.attributes["code"])}</h3>
                <p dangerouslySetInnerHTML={{__html: this.state.attributes["text"]}} />
                <CodeAttributesUnversionized
                    attributes={this.state.attributes}
                    catalog={catalog}
                    siblings={siblings}
                    language={language}
                    resource_type={resource_type}
                    code={code}
                />
            </div>
        )
    }
}

function withProps(Component) {
    return props => <Component {...props} navigation={useNavigate()} key={"unversionized_body"} params={useParams() }/>;
}

export default withProps(CodeBodyUnversionized);
