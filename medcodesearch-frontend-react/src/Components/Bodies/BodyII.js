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
            categories: {},
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
        await this.fetchSiblings(this.state.categories["parent"])
        await this.fetchGrandparents(this.state.categories["parent"])
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
                    categories: {},
                    siblings: []
                })
                await this.fetchInformations()
                await this.fetchSiblings(this.state.categories["parent"])
                await this.fetchGrandparents(this.state.categories["parent"])
            }
    }

    /**
     * Does a case distinction for all the catalogs and set the string ready for fetching
     * @param language
     * @param catalog
     * @param version
     * @param code
     * @returns {Promise<null|any>}
     */
    async fetchHelper(language, catalog, version, code) {
        catalog = catalog.toUpperCase();
        if(code === "all") {
            code = catalog
        }
        if (code === "all" && code !== 'AL') {
            return null
        } else {
            if (version === 'AL'){
                catalog = catalog + "/" + catalog;
                code = '?show_detail=1'
            }
            return await fetch('https://search.eonum.ch/' + language + "/" + version + "/" + catalog + "/" + code + "?show_detail=1")
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
        let newCategories, versions;
        if (this.props.params.category === "MIGEL") {
            versions = 'migels'
        }else if (this.props.params.category === "AL") {
            versions = 'laboratory_analyses';
        }else if (this.props.params.category === "DRUG") {
            versions = 'drugs'
        }
        newCategories = await this.fetchHelper(this.props.params.language, this.props.params.category, versions, this.props.params.code)
        if (newCategories !== null) {
            this.setState({categories: newCategories})
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
        if(this.props.params.category === "MIGEL") {
            MIGEL.goToChild(child.code, navigate, this.props.params.language)
        } else if(this.props.params.category === "AL") {
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
        let categories = []
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
        for(let category in this.state.categories) {
            if(this.state.categories[category] !== null && this.state.categories[category] !== undefined) {
                if(this.state.categories[category].length > 0 && category === "limitation") {
                    categories.push (
                        <div key={i}>
                            <h5>{translateJson["LBL_" + category.toUpperCase()]}</h5>
                            <p dangerouslySetInnerHTML={{__html: this.state.categories[category]}}/>
                        </div>
                    )
                } else if(this.state.categories[category].length > 0 && category !== "children" && category !== "text" && category !== "rev" &&
                    category !== "code" && category !== "version" && category !== "valid_to" && category !== "valid_from" && category !== "auth_holder_nr"
                    && category !== "atc_code" && category !== "pharma_form" && category !== "package_code" && category!=="auth_number") {
                    categories.push(
                        <div key={i}>
                            <p><span><strong>{translateJson["LBL_" + category.toUpperCase()]}: </strong> </span><span dangerouslySetInnerHTML={{__html: this.state.categories[category]}}/></p>
                        </div>
                    )
                }
            }
            i += 1
        }
        if(this.state.categories["children"] && this.state.categories["children"].length > 0) {
            categories.push(
                <div key={i}>
                    <h5>{translateJson["LBL_CHILDREN"]}</h5>
                    <ul>
                        {this.state.categories["children"].map((child, i) => (
                            <li key={i}><a key={"link to child: " + i} className="link" onClick={() => {this.goToChild(child)}}>{child.code}: </a>
                                <span key={"child text"} dangerouslySetInnerHTML={{__html: child.text}}/></li>
                        ))}
                    </ul>
                </div>
            )
        }
        if(this.state.siblings.length > 0 && !this.state.categories["children"]) {
            categories.push(
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
                    <BreadcrumbItem active>{this.extractLabel(this.state.categories["code"])}</BreadcrumbItem>
                </Breadcrumb>
                <h3>{this.extractLabel(this.state.categories["code"])}</h3>
                <p dangerouslySetInnerHTML={{__html: this.state.categories["text"]}} />
                {categories}
            </div>
        )
    }
}

export default function(props) {
    const navigation = useNavigate();
    const location = useLocation();
    return <BodyII {...props} navigation={navigation} location={location} params={useParams()}/>
}
