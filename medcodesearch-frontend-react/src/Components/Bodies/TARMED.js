import React, {Component} from "react";
import RouterService from "../../Services/router.service";
import CodeSortService from "../../Services/CodeSortService";
import {Breadcrumb} from "react-bootstrap";

/**
 * responsible for the TARMED component and the pathname
 */
class TARMED extends Component {

    /**
     * Fetch the TARMED in the correct language and version
     * @param language
     * @param catalog
     * @param version
     * @param code
     * @param categories
     * @returns {Promise<any>}
     */
    static async fetchInformations(language, catalog, version, code, categories) {
        let newCategories = categories
        return await fetch('https://search.eonum.ch/' + language + "/" + catalog + "/" + version + "/" + code + "?show_detail=1")
                .then((res) => res.json())
                .then((json) => {
                    for(let category in categories) {
                        newCategories[category] = json[category]
                    }
                    if(version === code) {
                        newCategories["children"] = CodeSortService(json["children"])
                    }})
            .then(() => {return newCategories})
    }

    /**
     * navigate to the child component
     * @param code
     * @param navigate
     * @param version
     * @param language
     */
    static goToChild(code, navigate, version, language) {
        if(code.match(/^TARMED_[0-9][0-9].[0-9][0-9]$|^[0-9][0-9]$/)) {
            navigate({pathname: "/" + language + "/TARMED/" + version + "/tarmed_chapters/" + code,
                search: RouterService.getQueryVariable('query') === "" ? "" : "?query=" + RouterService.getQueryVariable('query')})
        } else {
            navigate({pathname: "/" + language + "/TARMED/" + version + "/tarmeds/" + code,
                search: RouterService.getQueryVariable('query') === "" ? "" : "?query=" + RouterService.getQueryVariable('query')})
        }
    }

    /**
     * Render the TARMED component
     * @returns {JSX.Element}
     */
    render() {
        return (
            <div>
                <Breadcrumb>
                    {this.props.parents}
                    <Breadcrumb.Item active>{this.props.title.replace("_", " ")}</Breadcrumb.Item>
                </Breadcrumb>
                <h3>{this.props.title.replace("_", " ")}</h3>
                <p>{this.props.text}</p>
                {this.props.categories}
            </div>
        )
    }
}
export default TARMED;
