import {useLocation, useNavigate, useParams} from "react-router-dom";
import React, {Component} from "react";
import MIGEL from "./MIGEL";
import AL from "./AL";
import deJson from "../../assets/translations/de.json";
import frJson from "../../assets/translations/fr.json";
import itJson from "../../assets/translations/it.json";
import enJson from "../../assets/translations/en.json";
import {Breadcrumb, BreadcrumbItem} from "react-bootstrap";

class BodyII extends Component {
    constructor(props) {
        super(props);
        this.state = {
            categories: {},
            siblings: [],
            parents: []
        }
    }

    async componentDidMount() {
        await this.fetchInformations()
        await this.fetchSiblings(this.state.categories["parent"])
        await this.fetchGrandparents(this.state.categories["parent"])
    }

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

    goToChild(child) {
        let navigate = this.props.navigation
        if(this.props.params.category === "MIGEL") {
            MIGEL.goToChild(child.code, navigate, this.props.params.language)
        } else if(this.props.params.category === "AL") {
            AL.goToChild(child.code, navigate, this.props.params.language)
        }
    }
    findJson(language) {
        switch (language) {
            case "de":
                return deJson
            case "fr":
                return frJson
            case "it":
                return itJson
            case "en":
                return enJson
        }
    }

    render() {
        let translateJson = this.findJson(this.props.params.language)
        let categories = []
        let parentBreadCrumbs = []
        if(this.state.parents && this.state.parents.length > 0){
            for(let i=this.state.parents.length-1; i>=0; i--){
                parentBreadCrumbs.push(<Breadcrumb.Item
                    key={i}
                    onClick={() => this.goToChild(this.state.parents[i])}
                    className="breadLink"
                >{this.state.parents[i].code}</Breadcrumb.Item>)
            }
        }
        for(let category in this.state.categories) {
            if(this.state.categories[category] !== null && this.state.categories[category] !== undefined) {
                if(this.state.categories[category].length > 0 && category === "limitation") {
                    categories.push (
                        <div>
                            <h5>{translateJson["LBL_" + category.toUpperCase()]}</h5>
                            <p dangerouslySetInnerHTML={{__html: this.state.categories[category]}}/>
                        </div>
                    )
                } else if(this.state.categories[category].length > 0 && category !== "children" && category !== "text" && category !== "rev" &&
                    category !== "code" && category !== "version" && category !== "valid_to" && category !== "valid_from" && category !== "auth_holder_nr" && category !== "atc_code") {
                    categories.push(
                        <div>
                            <p><span><strong>{translateJson["LBL_" + category.toUpperCase()]}: </strong> </span><span dangerouslySetInnerHTML={{__html: this.state.categories[category]}}/></p>
                        </div>
                    )
                } else if((category === "children") && this.state.categories[category].length > 0) {
                    categories.push(
                        <div>
                            <h5>{translateJson["LBL_" + category.toUpperCase()]}</h5>
                            <ul>
                                {this.state.categories[category].map((child, i) => (
                                    <li><a className="link" onClick={() => {this.goToChild(child)}}>{child.code}: </a>
                                        <span dangerouslySetInnerHTML={{__html: child.text}}/></li>
                                ))}
                            </ul>
                        </div>
                    )
                }
            }
        }
        if(this.state.siblings.length > 0 && !this.state.categories["children"]) {
            categories.push(
                <div>
                    <h5>{translateJson["LBL_SIBLINGS"]}</h5>
                    <ul>
                        {this.state.siblings.map((child, i) => (
                            <li><a className="link" onClick={() => {this.goToChild(child)}}>{child.code}: </a>
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
                    <BreadcrumbItem active>{this.state.categories["code"]}</BreadcrumbItem>
                </Breadcrumb>
                <h3>{this.state.categories["code"]}</h3>
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
