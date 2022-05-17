import {Component} from "react";
import ICDSortService from "../../Services/ICDSortService";
import RouterService from "../../Services/router.service";
import {Breadcrumb} from "react-bootstrap";

/**
 * responsible fot he ICD component and the pathname
 */
class ICD extends Component {

    /**
     * navigate to the child component
     * @param code
     * @param navigate
     * @param version
     * @param language
     */
    static goToChild(code, navigate, version, language) {
        if(code.match(/^ICD10-GM-[0-9][0-9][0-9][0-9]|[XVI]+$/)) {
            navigate({pathname: "/" + language + "/ICD/" + version + "/icd_chapters/" + code,
                search: RouterService.getQueryVariable('query') === "" ? "" : "?query=" + RouterService.getQueryVariable('query')})
        } else if (code.match(/^[A-Z][0-9][0-9]\.?[0-9]?[0-9]?$/)){
            navigate({pathname: "/" + language + "/ICD/" + version + "/icds/" + code,
                search: RouterService.getQueryVariable('query') === "" ? "" : "?query=" + RouterService.getQueryVariable('query')})
        }
        else {
            navigate({pathname: "/" + language + "/ICD/" + version + "/icd_groups/" + code,
                search: RouterService.getQueryVariable('query') === "" ? "" : "?query=" + RouterService.getQueryVariable('query')})
        }
    }

    /**
     *  Fetch the ICD in the correct language and version
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
                        newCategories["children"] = ICDSortService(json["children"])
                    }
                })
            .then(() => {return newCategories})
    }

    /**
     * Render the CHOP component
     * @returns {JSX.Element}
     */
    render() {
        return (
            <div>
                <Breadcrumb>
                    {this.props.parents}
                    <Breadcrumb.Item active>{this.props.title.replace("_", " ")}</Breadcrumb.Item>
                </Breadcrumb>
                <h3>{this.props.title}</h3>
                <p>{this.props.text}</p>
                {this.props.categories}
            </div>
        )
    }
}
export default ICD;
