import {Component} from "react";
import RouterService from "../../Services/router.service";

/**
 * responsible for the AL Component and the pathname
 */
class DRG extends Component {
    /**
     * navigate to the child component
     * @param code
     * @param navigate
     * @param version
     * @param language
     * @param url
     */
    static goToChild(code, navigate, version, language, url) {
        if (code.match(/^[A-Z][A-Z][A-Z]\s\w+$/)){ // for example MDC 03 or MDC PRE or MDC a3
            let searchCode = code.split(' ');
            navigate({pathname: "/" + language + "/SwissDRG/" + version + "/mdcs/" + searchCode[1],
                search: RouterService.getQueryVariable('query') === "" ? "" : "?query=" + RouterService.getQueryVariable('query')})
        } else if (code.match(/^V[0-9]?[0-9].[0-9]$/)) { // for example V11.0
            navigate({
                pathname: "/" + language + "/SwissDRG/" + version + "/mdcs/" + code,
                search: RouterService.getQueryVariable('query') === "" ? "" : "?query=" + RouterService.getQueryVariable('query')
            })
        } else if(code.match(/[P|p]artition/) || code.match(/[P|p]artizione/)){ // for example C_A
            code = url.split("/")[url.split("/").length-1];
            navigate({pathname: "/" + language + "/SwissDRG/" + version + "/partitions/" + code,
                search: RouterService.getQueryVariable('query') === "" ? "" : "?query=" + RouterService.getQueryVariable('query')})
        } else if(code.match(/^[A-Z][0-9][0-9]$/)){ // for example C60
            navigate({pathname: "/" + language + "/SwissDRG/" + version + "/adrgs/" + code,
                search: RouterService.getQueryVariable('query') === "" ? "" : "?query=" + RouterService.getQueryVariable('query')})
        } else if (code.match(/^[A-Z][0-9][0-9][A-Z]$/)){ // for example C60A
            navigate({pathname: "/" + language + "/SwissDRG/" + version + "/drgs/" + code,
                search: RouterService.getQueryVariable('query') === "" ? "" : "?query=" + RouterService.getQueryVariable('query')})
        }
    }
}
export default DRG;
