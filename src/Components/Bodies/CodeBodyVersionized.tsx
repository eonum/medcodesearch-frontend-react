import {useNavigate, useParams} from "react-router-dom";
import React, {Component} from "react";
import {Breadcrumb} from "react-bootstrap";
import {ICode, INavigationHook, IParamTypes} from "../../interfaces";
import {fetchURL, getNavParams, initialCodeState} from "../../Utils";
import CodeAttributesVersionized from "../CodeAttributes/CodeAttributesVersionized";
import {useTranslation} from "react-i18next";

interface Props {
    params: IParamTypes,
    navigation: INavigationHook,
    translation: any
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
        let fetchString = [fetchURL, language, resource_type, version, code].join("/") + "?show_detail=1";
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
        let codeForFetch = code;
        // Set base code for mdcs, since this is not equal to version but equal to 'ALL'.
        if (resource_type === 'mdcs' && code === version) {
            codeForFetch = 'ALL'
        }
        detailedCode = await this.fetchHelper(language, resource_type, codeForFetch, catalog, version)
        if (detailedCode !== null) {
            this.setState({attributes: detailedCode})
        }
    }

    /**
     * fetch the sibling of the component
     * @param parent
     * @returns {Promise<void>}
     */
    async fetchSiblings(parent) {
        const code = this.props.params.code
        if(this.state.attributes.children === null && this.props.params.resource_type !== "partitions") {
            await fetch([fetchURL, parent.url].join("/") + "?show_detail=1")
                .then((res) => res.json())
                .then((json) => {
                    let siblings = json.children.filter(function(child) {
                        return child.code !== code;
                    })
                    this.setState({siblings: siblings})
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
            await fetch([fetchURL, parent.url].join("/") + "?show_detail=1")
                .then((res) => res.json())
                .then((json) => {
                    parent = json["parent"]
                })
        }
        this.setState({parents: parents})
    }

    internationalizeIcdBaseCode(code) {
        const {t} = this.props.translation
        return code.replace("ICD10-GM", t("LBL_ICD_LABEL"))
    }

    /**
     * Render the body component
     * @returns {JSX.Element}
     */
    render() {
        let {language, catalog, version, resource_type} = this.props.params
        let siblings = this.state.siblings;
        let navigate = this.props.navigation;
        let title;
        if (this.state.attributes.code) {
            title = this.state.attributes.code.includes("ICD10") ?
                this.internationalizeIcdBaseCode(this.state.attributes.code) :
                this.state.attributes.code.replace("_", " ")
        } else {
            title = "";
        }
        return (
            <div>
                <Breadcrumb>
                    {this.state.parents.reverse().map((currElement, i) => {
                        return(
                            <Breadcrumb.Item key={i} onClick={() => {
                                let {pathname, searchString} = getNavParams(currElement, language, catalog)
                                navigate({pathname: pathname, search: searchString})
                            }} className="breadLink">
                                {currElement.code.includes("ICD10") ?
                                    this.internationalizeIcdBaseCode(currElement.code) : currElement.code}
                            </Breadcrumb.Item>);
                    })}
                    <Breadcrumb.Item active>{title}</Breadcrumb.Item>
                </Breadcrumb>
                <h3>{title}</h3>
                <p>{this.state.attributes.text}</p>
                <CodeAttributesVersionized
                    attributes={this.state.attributes}
                    catalog={catalog}
                    version={version}
                    siblings={siblings}
                    language={language}
                    resourceType={resource_type}
                />
            </div>
        )
    }
}

function addProps(Component) {
    return props => <Component {...props} navigation={useNavigate()} key={"versionized_body"} params={useParams()} translation={useTranslation()}/>;
}

export default addProps(CodeBodyVersionized);
