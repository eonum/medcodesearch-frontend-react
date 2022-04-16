import React, {Component} from "react";
import RouterService from "../../Services/router.service";
import CodeSortService from "../../Services/CodeSortService";

class TARMED extends Component {

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
                    }
                })
                .then(() => {return newCategories})
    }


    render() {
        return (
            <div key={this.props.title}>
                <h3>{this.props.title.replace("_", " ")}</h3>
                <p>{this.props.text}</p>
                {this.props.categories}
            </div>
        )
    }

    static goToChild(oldCode, code, navigate, version, language) {
        if(code.match(/^[0-9][0-9]$/)) {
            navigate({pathname: "/" + language + "/TARMED/" + version + "/tarmed_chapters/" + code,
                search: RouterService.getQueryVariable('query') === "" ? "" : "?query=" + RouterService.getQueryVariable('query')})
        } else {
            navigate({pathname: "/" + language + "/TARMED/" + version + "/tarmeds/" + code,
                search: RouterService.getQueryVariable('query') === "" ? "" : "?query=" + RouterService.getQueryVariable('query')})
        }
    }
}
export default TARMED;
