import {useNavigate, useParams} from "react-router-dom";
import React, {Component} from "react";
import {Breadcrumb, BreadcrumbItem} from "react-bootstrap";
import {ICode, INavigationHook, IParamTypes} from "../../interfaces";
import {fetchURL, getNavParams, initialCodeState} from "../../Utils";
import CodeAttributesUnversionized from "../CodeAttributes/CodeAttributesUnversionized";
import { useTranslation } from 'react-i18next';

interface Props {
    params: IParamTypes,
    navigation: INavigationHook,
    selectedDate: string,
    translation: any
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
        const code = this.props.params.code
        let fetchString = [fetchURL, parent.url].join("/") + "?show_detail=1&date=" + this.props.selectedDate;
        await fetch(fetchString)
            .then((res) => res.json())
            .then((json) => {
                let siblings = json.children.filter(function(child) {
                    return child.code !== code;
                })
                this.setState({siblings: siblings})
            })
    }

    /**
     * If input is a base code ('MIGEL', 'AL', 'DRUG'), the method returns the base code in the given language,
     *  otherwise just returns input.
     * @param code
     * @returns {string|*}
     */
    displayCode(code, isBreadcrumbLabel){
        const {t} = this.props.translation
        if (["AL", "MIGEL", "DRUG"].includes(code)) {
            return isBreadcrumbLabel ? t(`LBL_${code}_LABEL`) : t(`LBL_${code}`)
        } else {
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
        const titleTag = ["MIGEL", "AL"].includes(catalog) ? this.displayCode(catalog, false) : "";

        return (
            <div>
                <Breadcrumb>
                    {this.state.parents.reverse().map((currElement, i) => {
                        return (
                            <Breadcrumb.Item
                                title={["MIGEL", "AL"].includes(currElement.code) ? titleTag : ""}
                                key={i}
                                className="breadLink"
                                onClick={() => {
                                    let {
                                        pathname,
                                        searchString
                                    } = getNavParams(currElement, language, catalog, resource_type)
                                    // No breadcrumb for DRUG catalog
                                    if (["MIGEL", "AL"].includes(catalog)) {
                                        navigate({pathname: pathname, search: searchString})
                                    }
                                }}>
                                {this.displayCode(currElement.code, true)}
                            </Breadcrumb.Item>
                        )})}
                    <BreadcrumbItem active>{this.displayCode(this.state.attributes["code"], true)}</BreadcrumbItem>
                </Breadcrumb>
                <h3>{this.displayCode(this.state.attributes["code"], false)}</h3>
                <p dangerouslySetInnerHTML={{__html: this.state.attributes["text"]}} />
                <CodeAttributesUnversionized
                    attributes={this.state.attributes}
                    catalog={catalog}
                    siblings={siblings}
                    language={language}
                    resourceType={resource_type}
                    code={code}
                />
            </div>
        )
    }
}

function withProps(Component) {
    return props => <Component {...props} navigation={useNavigate()} key={"unversionized_body"} params={useParams()} translation={useTranslation()}/>;
}

export default withProps(CodeBodyUnversionized);
