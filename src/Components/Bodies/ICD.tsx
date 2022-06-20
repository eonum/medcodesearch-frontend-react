import React, {Component} from "react";
import RouterService from "../../Services/router.service";
import {Breadcrumb} from "react-bootstrap";

/**
 * responsible fot he ICD component and the pathname
 */

interface Props {
    attributes: any,
    text: any,
    title: any,
    parents: string
}

class ICD extends Component<Props> {
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
}
export default ICD;
