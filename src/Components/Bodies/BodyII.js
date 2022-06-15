import {useLocation, useNavigate, useParams} from "react-router-dom";
import React, {Component} from "react";
import MIGEL from "./MIGEL";
import AL from "./AL";
import {Breadcrumb, BreadcrumbItem} from "react-bootstrap";
import findJsonService from "../../Services/find-json.service";

/**
 * Responsible for the body of the website, if Body doesn't fit
 */
class BodyII extends Component {
    constructor(props) {
        super(props);
        this.state = {
            attributes: {},
            siblings: [],
            parents: []
        }
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
    async componentDidUpdate(prevProps: Readonly<P>, prevState: Readonly<S>, snapshot: SS) {
            if (prevProps.params.language !== this.props.params.language ||
                prevProps.params.code !== this.props.params.code ||
                prevProps.params.catalog !== this.props.params.catalog) {
                this.setState({
                    attributes: {},
                    siblings: []
                })
                await this.fetchInformations()
                await this.fetchSiblings(this.state.attributes["parent"])
                await this.fetchGrandparents(this.state.attributes["parent"])
            }
    }

    /**
     * Does a case distinction for all the catalogs and set the string ready for fetching
     * @param language
     * @param code_type
     * @param version
     * @param code
     * @returns {Promise<null|any>}
     */
    async fetchHelper(language, code_type, version, code) {
        code_type = code_type.toUpperCase();
        if(code === "all") {
            code = code_type
        }
        if (code === "all" && code !== 'AL') {
            return null
        } else {
            if (version === 'AL'){
                code_type = code_type + "/" + code_type;
                code = '?show_detail=1'
            }
            return await fetch('https://search.eonum.ch/' + language + "/" + version + "/" + code_type + "/" + code + "?show_detail=1")
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
        if(this.state.children == null && parent) {
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
     * navigates to the child component
     * @param child
     */
    goToChild(child) {
        let navigate = this.props.navigation
        if(this.props.params.catalog === "MIGEL") {
            MIGEL.goToChild(child.code, navigate, this.props.params.language)
        } else if(this.props.params.catalog === "AL") {
            AL.goToChild(child.code, navigate, this.props.params.language)
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
     * Render the BodyII component
     * @returns {JSX.Element}
     */
    render() {
        let translateJson = findJsonService(this.props.params.language)
        let attributes_html = []
        let parentBreadCrumbs = []
        if(this.state.parents && this.state.parents.length > 0){
            for(let i=this.state.parents.length-1; i>=0; i--){
                parentBreadCrumbs.push(<Breadcrumb.Item
                    key={i}
                    onClick={() => this.goToChild(this.state.parents[i])}
                    className="breadLink"
                >{this.extractLabel(this.state.parents[i].code)}</Breadcrumb.Item>)
            }
        }
        let i = 1;
        for(let attribute in this.state.attributes) {
            if(this.state.attributes[attribute] !== null && this.state.attributes[attribute] !== undefined) {
                if(this.state.attributes[attribute].length > 0 && attribute === "limitation") {
                    attributes_html.push (
                        <div key={i}>
                            <h5>{translateJson["LBL_" + attribute.toUpperCase()]}</h5>
                            <p dangerouslySetInnerHTML={{__html: this.state.attributes[attribute]}}/>
                        </div>
                    )
                } else if(this.state.attributes[attribute].length > 0 && attribute !== "children" && attribute !== "text" && attribute !== "rev" &&
                    attribute !== "code" && attribute !== "version" && attribute !== "valid_to" && attribute !== "valid_from" && attribute !== "auth_holder_nr"
                    && attribute !== "atc_code" && attribute !== "pharma_form" && attribute !== "package_code" && attribute!=="auth_number") {
                    attributes_html.push(
                        <div key={i}>
                            <p><span><strong>{translateJson["LBL_" + attribute.toUpperCase()]}: </strong> </span><span dangerouslySetInnerHTML={{__html: this.state.attributes[attribute]}}/></p>
                        </div>
                    )
                }
            }
            i += 1
        }
        if(this.state.attributes["children"] && this.state.attributes["children"].length > 0) {
            attributes_html.push(
                <div key={i}>
                    <h5>{translateJson["LBL_CHILDREN"]}</h5>
                    <ul>
                        {this.state.attributes["children"].map((child, i) => (
                            <li key={i}><a key={"link to child: " + i} className="link" onClick={() => {this.goToChild(child)}}>{child.code}: </a>
                                <span key={"child text"} dangerouslySetInnerHTML={{__html: child.text}}/></li>
                        ))}
                    </ul>
                </div>
            )
        }
        if(this.state.siblings.length > 0 && !this.state.attributes["children"]) {
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
    return <BodyII {...props} navigation={NAVIGATION} location={LOCATION} params={useParams()}/>
}
