import React, {Component} from "react";
import RouterService from "../../Services/router.service";
import {Breadcrumb} from "react-bootstrap";

/**
 * responsible for the AL Component and the pathname
 */
class DRG extends Component {

    /**
     * etch the DRG in the correct language and version
     * @param language
     * @param resource_type
     * @param version
     * @param code
     * @param attributes
     * @returns {Promise<any>}
     */
    static async fetchInformations(language, resource_type, version, code, attributes) {
        let codeForSearch;
        let cat = 'mdcs';
        let newAttributes = attributes
        if (resource_type !==  'mdcs'){
            cat = resource_type;
        }
        if (version === code){
            codeForSearch = '/ALL'
        }
        else {
            codeForSearch = '/' + code;
        }

        return await fetch('https://search.eonum.ch/' + language + "/" + cat+ "/" + version + codeForSearch + "?show_detail=1")
                .then((res) => res.json())
                .then((json) => {
                        for (let attribute in attributes) {
                            newAttributes[attribute] = json[attribute]
                        }}
                    )
                .then(() => {return newAttributes})
    }

    /**
     * navigate to the child component
     * @param child
     * @param navigate
     * @param version
     * @param language
     */
    static goToChild(child, navigate, version, language) {
        if (child.code.match(/^[A-Z][A-Z][A-Z]\s\w+$/)){ // for example MDC 03 or MDC PRE or MDC a3
            let searchCode = child.code.split(' ');
            navigate({pathname: "/" + language + "/SwissDRG/" + version + "/mdcs/" + searchCode[1],
                search: RouterService.getQueryVariable('query') === "" ? "" : "?query=" + RouterService.getQueryVariable('query')})
        } else if (child.code.match(/^V[0-9]?[0-9].[0-9]$/)) { // for example V11.0
            navigate({
                pathname: "/" + language + "/SwissDRG/" + version + "/mdcs/" + child.code,
                search: RouterService.getQueryVariable('query') === "" ? "" : "?query=" + RouterService.getQueryVariable('query')
            })
        } else if(child.code.match(/[P|p]artition/) || child.code.match(/[P|p]artizione/)){ // for example C_A
            child.code = child.url.split("/")[child.url.split("/").length-1];
            navigate({pathname: "/" + language + "/SwissDRG/" + version + "/partitions/" + child.code,
                search: RouterService.getQueryVariable('query') === "" ? "" : "?query=" + RouterService.getQueryVariable('query')})
        } else if(child.code.match(/^[A-Z][0-9][0-9]$/)){ // for example C60
            navigate({pathname: "/" + language + "/SwissDRG/" + version + "/adrgs/" + child.code,
                search: RouterService.getQueryVariable('query') === "" ? "" : "?query=" + RouterService.getQueryVariable('query')})
        } else if (child.code.match(/^[A-Z][0-9][0-9][A-Z]$/)){ // for example C60A
            navigate({pathname: "/" + language + "/SwissDRG/" + version + "/drgs/" + child.code,
                search: RouterService.getQueryVariable('query') === "" ? "" : "?query=" + RouterService.getQueryVariable('query')})
        }
    }

    /**
     * Render the DRG component
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
export default DRG;
