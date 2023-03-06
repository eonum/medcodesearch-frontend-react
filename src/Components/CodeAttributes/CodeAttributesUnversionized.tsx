import React, {Component} from "react";
import {IAttributes, INavigationHook, IShortEntry} from "../../interfaces";
import getTranslationHash from "../../Services/translation.service";
import {collectEnabledAttributes, collectAttributesSl} from "../../Utils";
import {useNavigate} from "react-router-dom";
import dateFormat from "dateformat";
import ClickableCodesArray from "./ClickableCodesArray";

interface Props {
    attributes: IAttributes,
    catalog: string,
    siblings: IShortEntry[],
    language: string,
    resource_type: string,
    code: string,
    navigation: INavigationHook
}

/**
 * Responsible for the attributes of a code, for catalogs without versions (i.e. MiGeL, AL, Drugs).
 */
class CodeAttributesUnversionized extends Component<Props>{
    constructor(props) {
        super(props);
    }

    /**
     * Render the CodeAttributesUnversionized component
     * @returns {JSX.Element}
     */
    render() {
        let translateJson = getTranslationHash(this.props.language);
        let attributes = this.props.attributes;
        let children = attributes.children;
        let siblings = this.props.siblings;
        let terminal = attributes.terminal;
        let enabledAttributes = collectEnabledAttributes(attributes)
        let slAttributes = collectAttributesSl(attributes, translateJson)
        let noCodeError = Object.keys(enabledAttributes).includes("error")

        return (
            noCodeError ?
                <div>{translateJson["LBL_NO_CODE"]}</div> :
                <>
                    {// Render enabled attributes (they can be lists, date and strings.
                        Object.keys(enabledAttributes).map(attribute => (
                            <div key={attribute}>
                                <h5>{translateJson["LBL_" + attribute.toUpperCase()]}</h5>
                                {typeof enabledAttributes[attribute] === 'object' ?
                                    <ul id={attribute + "_attribute_value"}>
                                        {enabledAttributes[attribute].map((val, j) => (
                                            <li key={attribute + "_" + j}><p dangerouslySetInnerHTML={{__html: val}}/>
                                            </li>
                                        ))}
                                    </ul> :
                                    <div key={attribute} id={attribute + "_attribute_value"}>
                                        <p dangerouslySetInnerHTML={{__html: attributes[attribute]}}/>
                                    </div>}
                            </div>))}
                    {// Add last seeding date and valid from if terminal
                        terminal &&
                        ['updated_at', 'valid_from', 'valid_to'].map( attribute => (
                            <div key={attribute}>
                                <h5>{translateJson["LBL_" + attribute.toUpperCase()]}</h5>
                                <p> {dateFormat(new Date(attributes[attribute]), "dd.mm.yyyy")}</p>
                            </div>
                        ))
                    }
                    {// Add swissmedic number for drugs.
                        this.props.catalog === "DRUG" && this.props.code != 'all' &&
                        <div key={"swissmedic_nr"}>
                            <h5>{translateJson["LBL_SWISSMEDIC_NR"]}</h5>
                            <p> {attributes.auth_number + attributes.package_code} </p>
                        </div>
                    }
                    {this.props.catalog === "DRUG" && this.props.code != 'all' &&
                        <>
                            <h5>{translateJson["LBL_SL_INFOS"]}</h5>
                            {// Add SL deprecation warning.
                                !attributes["is_currently_in_sl"] &&
                                <div className="vertical-spacer alert alert-warning" key={"is_currently_in_sl"}>
                                    {translateJson["LBL_REMOVED_FROM_SL"]}
                                </div>}
                            { // Add SL infos.
                                <ul id={"SL_infos"}>
                                    {Object.keys(slAttributes).map(attributeName => (
                                        <li key={attributeName} id={"SL_" + attributeName}>
                                            {attributeName.match(/date/i) ?
                                                <p>{translateJson["LBL_" + attributeName.toUpperCase()] + ": "
                                                    + dateFormat(new Date(slAttributes[attributeName]), "dd.mm.yyyy")}
                                                </p> :
                                                <p>{translateJson["LBL_" + attributeName.toUpperCase()] + ": "
                                                    + (typeof slAttributes[attributeName] === 'boolean' ?
                                                        translateJson["LBL_" + slAttributes[attributeName]
                                                            .toString().toUpperCase()] :
                                                        slAttributes[attributeName])}
                                                </p>
                                            }
                                        </li>
                                    ))}
                                </ul>
                            }
                        </>
                    }
                    {children &&
                        <ClickableCodesArray
                            codesArray={children}
                            codesType={'children'}
                            language={this.props.language}
                            catalog={this.props.catalog}
                            resource_type={this.props.resource_type}
                        />}
                    {siblings.length > 0 && !children &&
                        <ClickableCodesArray
                            codesArray={siblings}
                            codesType={'siblings'}
                            language={this.props.language}
                            catalog={this.props.catalog}
                            resource_type={this.props.resource_type}
                        />}
            </>
        );
    }
}

function addProps(Component) {
    return props => <Component {...props} navigation={useNavigate()} />;
}

export default addProps(CodeAttributesUnversionized);

