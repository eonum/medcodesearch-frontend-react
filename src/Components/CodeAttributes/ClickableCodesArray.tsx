import React, {Component} from "react";
import {INavigationHook, IShortEntry} from "../../interfaces";
import getTranslationHash from "../../Services/translation.service";
import {useNavigate} from "react-router-dom";
import RouterService from "../../Services/router.service";
import {getNavParams} from "../../Utils";

interface Props {
    codesArray: any,
    codesType: string,
    language: string,
    catalog: string,
    navigation: INavigationHook,
    resource_type?: string
}

/**
 * Returns a unordered list of clickable codes (used for children or sibling, i.e. similar codes).
 * */
class ClickableCodesArray extends Component<Props>{
    constructor(props) {
        super(props);
    }

    /**
     * Render the ClickableCodesArray component
     * @returns {JSX.Element}
     */
    render() {
        let translateJson = getTranslationHash(this.props.language);
        let {navigation, language, catalog, resource_type} = this.props;
        let attribute = this.props.codesType
        let attributeValue = this.props.codesArray
        return (
            <div key={attribute}>
                <h5>{translateJson["LBL_" + attribute.toUpperCase()]}</h5>
                <ul>
                    {attributeValue.map((currElement, j) => (
                        <li key={j}>
                            <a key={attribute + "_" + j} className="link" onClick={() => {
                                let {pathname, searchString} = getNavParams(currElement, language, catalog, resource_type)
                                if (catalog != 'DRUG') {
                                    navigation({pathname: pathname, search: searchString})
                                }
                            }}>
                                {currElement.code + ": "}
                            </a>
                            <span key={"code_text"} dangerouslySetInnerHTML={{__html: currElement.text}}/>
                        </li>
                    ))}
                </ul>
            </div>
        );
    }
}

function addProps(Component) {
    return props => <Component {...props} navigation={useNavigate()} />;
}

export default addProps(ClickableCodesArray);

