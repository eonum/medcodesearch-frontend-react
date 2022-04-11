import React, {Component} from "react";
import RouterService from "../../Services/router.service";

class DRUG extends Component {



    static async fetchInformations(language, catalog, version, code) {
        if (code === "all") {
            return null
        } else {
            return await fetch('https://search.eonum.ch/' + language + "/" + version + "/" + catalog.toUpperCase() + "/" + code)
                .then((res) => {
                    return res.json()
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
export default DRUG;
