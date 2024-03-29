import React, {Component} from "react";
import {INavigationHook} from "../../interfaces";
import {useNavigate} from "react-router-dom";
import {getNavParams} from "../../Utils";
import {useTranslation} from "react-i18next";

interface Props {
    codesArray: any,
    codesType: string,
    language: string,
    catalog: string,
    navigation: INavigationHook,
    resource_type?: string,
    translation: any,
    id?: string,
}

/**
 * Returns a unordered list of clickable codes (used for children or sibling, i.e. similar codes).
 * */
class ClickableCodesArray extends Component<Props>{
    /**
     * Render the ClickableCodesArray component
     * @returns {JSX.Element}
     */

    triggeringCodes(shortEntries) {
        if (shortEntries && this.props.catalog == 'Supplements') {
            return shortEntries[0].triggering_code ? shortEntries.map((c) => c.triggering_code) : undefined
        } else {
            return undefined
        }
    }

    render() {
        const {t} = this.props.translation
        let {navigation, language, catalog, resource_type} = this.props;
        let attribute = this.props.codesType
        let attributeValue = this.props.codesArray
        const triggeringCodes = this.triggeringCodes(this.props.codesArray)

        return (
            <div key={attribute} id={this.props.id}>
                <h5>{t("LBL_" + attribute.toUpperCase())}</h5>
                <ul>
                    {attributeValue.map((currElement, j) => (
                        <li key={j}>
                            <a key={attribute + "_" + j} className="link" onClick={() => {
                                let {pathname, searchString} = getNavParams(currElement, language, catalog, resource_type)
                                if (catalog != 'DRUG') {
                                    navigation({pathname: pathname, search: searchString})
                                }
                            }}>
                                {currElement.code + (triggeringCodes ? " (" + triggeringCodes[j] + ")" : "") + ": "}
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
    return props => <Component {...props} navigation={useNavigate()} translation={useTranslation()} />;
}

export default addProps(ClickableCodesArray);

