import React, {Component} from "react";
import RouterService from "../../Services/router.service";

class MiGeL extends Component {

    static goToChild(catalog, code, navigate, language) {
            navigate({
                pathname: "/" + language + "/" + catalog + "/migels/" + code,
                search: RouterService.getQueryVariable('query') === "" ? "" : "?query=" + RouterService.getQueryVariable('query')
            })
    }

    static async fetchInformations(language, catalog, version, code) {
        if (code === "all") {
            return null
        } else {
            return await fetch('https://search.eonum.ch/' + language + "/" + version + "/" + catalog.toUpperCase() + "/" + code)
                .then((res) => res.json())
                .then((json) => {
                    return json
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
export default MiGeL;
