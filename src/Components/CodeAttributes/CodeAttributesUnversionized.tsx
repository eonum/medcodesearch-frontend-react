import React, {Component} from "react";
import {IAttributes, INavigationHook, IShortEntry} from "../../interfaces";
import getTranslationHash from "../../Services/translation.service";
import {collectEnabledAttributes, getNavParams} from "../../Utils";
import {useNavigate} from "react-router-dom";
import RouterService from "../../Services/router.service";
import dateFormat from "dateformat";
import ClickableCodesArray from "./ClickableCodesArray";
import {languages} from "../../Services/catalog-version.service";

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

        // TODO: only display valid_from for terminal codes
        return (
            <>
                {Object.keys(enabledAttributes).map(attribute => (
                        <div key={attribute}>
                            <h5>{translateJson["LBL_" + attribute.toUpperCase()]}</h5>
                            {typeof enabledAttributes[attribute] === 'object' ?
                                <>
                                    <ul>
                                        {enabledAttributes[attribute].map((val, j) => (
                                            <li key={attribute + "_" + j}><p dangerouslySetInnerHTML={{__html: val}}/></li>
                                        ))}
                                    </ul>
                                </> :
                                <>
                                    <div key={attribute}>
                                        <p dangerouslySetInnerHTML={{__html:
                                                ['updated_at', 'valid_from'].includes(attribute) ?
                                                    dateFormat(new Date(attributes[attribute]), "dd.mm.yyyy") :
                                                    attributes[attribute]}}/>
                                    </div>
                                </>}
                        </div>))}
                {// Add swissmedic number for drugs.
                    this.props.catalog === "DRUG" && this.props.code != 'all' &&
                    <div key={"swissmedic_nr"}>
                        <h5>{translateJson["LBL_SWISSMEDIC_NR"]}</h5>
                        <p> {attributes.auth_number + attributes.package_code} </p>
                    </div>
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

