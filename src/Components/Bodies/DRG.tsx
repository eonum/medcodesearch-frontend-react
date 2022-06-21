import {Component} from "react";
import RouterService from "../../Services/router.service";

/**
 * responsible for the AL Component and the pathname
 */
class DRG extends Component {
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
}
export default DRG;
