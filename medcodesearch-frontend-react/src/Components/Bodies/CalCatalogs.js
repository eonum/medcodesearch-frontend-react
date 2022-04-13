import React, {Component} from "react";

class CalCatalogs extends Component {



    static async fetchInformations(language, catalog, version, code) {
        catalog = catalog.toUpperCase();
        if (code === "all" && code !== 'AL') {
            return null
        } else {
            if (version === 'AL'){
                catalog = catalog + "/" + catalog;
                code = '?show_detail=1'
            }
            return await fetch('https://search.eonum.ch/' + language + "/" + version + "/" + catalog + "/" + code)
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
            </div>
        )
    }
}
export default CalCatalogs;
