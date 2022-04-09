import React, {Component} from "react";
import ICDSortService from "../../Services/ICDSortService";
import RouterService from "../../Services/router.service";

class MiGeL extends Component {

    static goToChild(catalog, code, navigate, language) {
            navigate({
                pathname: "/" + language + "/" + catalog + "/migels/" + code,
                search: RouterService.getQueryVariable('query') === "" ? "" : "?query=" + RouterService.getQueryVariable('query')
            })
    }

    static async fetchInformations(language, catalog, version, code, categories) {
        console.log('inside')
        let newCategories = categories
        return await //Fetch(this.props.params.language, this.props.params.version, 'icd_chapters', this.props.params.version)
            fetch('https://search.eonum.ch/' + language + "/" + catalog.toUpperCase() + "/" + version + "/" + code + "/all")
                .then((res) => res.json())
                .then((json) => {
                    for(let category in categories) {
                        newCategories[category] = json[category]
                    }
                    if(version === code) {
                        newCategories["children"] = json["children"]
                    }
                })
                .then(() => {return newCategories})
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
export default MiGeL;
