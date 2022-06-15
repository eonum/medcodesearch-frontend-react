import {Component} from "react";
import IcdSortService from "../../Services/icd-sort.service";
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
     * @param code_type
     * @param version
     * @param code
     * @param attributes
     * @returns {Promise<any>}
     */
    static async fetchInformations(language, code_type, version, code, attributes) {
        let newAttributes = attributes
        console.log('https://search.eonum.ch/' + language + "/" + code_type + "/" + version + "/" + code + "?show_detail=1")
        return await fetch('https://search.eonum.ch/' + language + "/" + code_type + "/" + version + "/" + code + "?show_detail=1")
                .then((res) => res.json())
                .then((json) => {
                    for(let attribute in attributes) {
                        newAttributes[attribute] = json[attribute]
                    }
                    if(version === code) {
                        newAttributes["children"] = IcdSortService(json["children"])
                    }
                })
            .then(() => {return newAttributes})
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
                {this.props.attributes}
            </div>
        )
    }
}
export default ICD;
