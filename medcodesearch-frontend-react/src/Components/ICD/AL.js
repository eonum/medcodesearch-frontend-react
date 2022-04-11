import React, {Component} from "react";
import RouterService from "../../Services/router.service";

class AL extends Component {

    static goToChild(catalog, code, navigate, language) {
        navigate({
            pathname: "/" + language + "/" + catalog + "/als/" + code,
            search: RouterService.getQueryVariable('query') === "" ? "" : "?query=" + RouterService.getQueryVariable('query')
        })
    }

    static async fetchInformations(language, catalog, version, code, categories) {
        if (code === "all") {
            return null
        } else {
            let newCategories = categories
            return await fetch('https://search.eonum.ch/' + language + "/" + version + "/" + catalog.toUpperCase() + "/" + code)
                .then((res) => res.json())
                .then((json) => {
                    for (let category in categories) {
                        newCategories[category] = json[category]
                    }
                    if (version === code) {
                        newCategories["children"] = json["children"]
                    }
                })
                .then(() => {
                    return newCategories
                })
        }
    }

    render() {
        return (
            <div>
                <h3>{this.props.title}</h3>
                <p>{this.props.text}</p>
                {this.props.categories}
            </div>
        )
    }
}
export default AL;
