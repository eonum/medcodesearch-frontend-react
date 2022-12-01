import React, {Component} from "react";
import {IAttributes, INavigationHook, IShortEntry} from "../../interfaces";
import getTranslationHash from "../../Services/translation.service";
import {collectEnabledAttributes, getNavParams, versionsWithoutMappingInfos} from "../../Utils";
import {useNavigate} from "react-router-dom";
import ClickableCodesArray from "./ClickableCodesArray";

interface Props {
    attributes: IAttributes,
    catalog: string,
    version: string,
    siblings: IShortEntry[],
    language: string,
    navigation: INavigationHook
}

/**
 * Responsible for the attributes of a code, for catalogs with versions (i.e. ICD, CHOP, DRG, TARMED).
 */
class CodeAttributesVersionized extends Component<Props>{
    constructor(props) {
        super(props);
    }

    /**
     * Looks if the given string has a pattern which indicates a link
     * @param aString
     * @param index
     * @returns {JSX.Element}
     */
    lookingForLink(aString, index, attribute) {
        let results = []
        const codeRegex = new RegExp(/[{(](([A-Z\d]{1,3}\.?){1,3})(-(([A-Z\d]{1,3}\.?){1,3})?)?[})]/g);
        let matches = aString.match(codeRegex)
        if(matches) {
            let firstIndex = aString.indexOf(matches[0])
            for (let i = 0; i < matches.length; i++) {
                matches[i] = matches[i].substring(1, matches[i].length - 1);
                let arr = matches[i].split("-")
                if(arr.length > 1 && arr[1] !== "") {
                    results.push(<span key={attribute + "_" + index}>(<a onClick={() => {
                        this.searchExclusion(arr[0].replace(/\.$/, ''))
                    }} className="link">{arr[0].replace(/\.$/, '')}</a>-<a onClick={() => {
                        this.searchExclusion(arr[1].replace(/\.$/, ''))
                    }} className="link">{arr[1].replace(/\.$/, '')}</a>) </span>)
                } else {
                    results.push(<span key={attribute + "_" + index}>(<a onClick={() => {
                        this.searchExclusion(arr[0].replace(/\.$/, ''))
                    }} className="link">{arr[0].replace(/\.$/, '')}</a>) </span>)
                }
            }
            return <li key={`${attribute}_link_${index}`}>{aString.substring(0, firstIndex)} {results}</li>
        } else {
            return <li key={`${attribute}_link_${index}`}>{aString}</li>
        }
    }

    /**
     * Looks for exclusions in the given code.
     * @param code
     */
    searchExclusion(code) {
        let navigate = this.props.navigation
        navigate({search: "?query=" + code})
    }

    /**
     * Render the CodeAttributesVersionized component
     * @returns {JSX.Element}
     */
    render() {
        let translateJson = getTranslationHash(this.props.language);
        let attributes = this.props.attributes;
        let children = attributes.children;
        let siblings = this.props.siblings;
        // Define mapping fields for predecessor & new code code info.
        let mappingFields = ['predecessors', 'successors'];
        let enabledAttributes = collectEnabledAttributes(attributes)
        let showNewCodeInfo = ['CHOP', 'ICD'].includes(this.props.catalog) &&
            !versionsWithoutMappingInfos.includes(this.props.version) &&
            attributes.predecessors &&
            attributes.predecessors.length == 0 &&
            !attributes['children']

        return (
            <>
                {// Render enabled attributes (they can be lists, date and strings.
                    Object.keys(enabledAttributes).map(attribute => (
                        <div key={attribute}>
                            <h5>{translateJson["LBL_" + attribute.toUpperCase()]}</h5>
                            {typeof enabledAttributes[attribute] === 'object' ?
                                <ul>
                                    {enabledAttributes[attribute].map((val, j) => (
                                        ["exclusions", "supplement_codes"].includes(attribute) ?
                                            this.lookingForLink(val, j, attribute) :
                                            <li key={attribute + "_" + j}><p dangerouslySetInnerHTML={{__html: val}}/>
                                            </li>
                                    ))}
                                </ul> :
                                <div key={attribute}>
                                    <p dangerouslySetInnerHTML={{__html: attributes[attribute]}}/>
                                </div>
                            }
                        </div>))}
                {// Add mapping information (predecessor / successor information.
                    mappingFields.map((field, j) => (
                        attributes[field] != null &&
                        (attributes[field].length > 1 ||
                            attributes[field].length == 1 && (
                                (attributes[field][0]['code'] != attributes['code'] ||
                                    attributes[field][0]['text'] != attributes['text']))) &&
                        <div key={"mapping_pre_succ" + j}>
                            <h5>{translateJson["LBL_" + field.toUpperCase()]}</h5>
                            <ul>
                                {attributes[field].map((child, i) => (
                                    <li key={child + "_" + i}><b>{child.code}</b>{" " + child.text}</li>
                                ))}
                            </ul>
                        </div>
                    ))}
                {// Add new code information.
                    showNewCodeInfo &&
                    <div className="vertical-spacer alert alert-warning">
                        <h5>{translateJson["LBL_NEW_CODE"]}</h5>
                    </div>
                }
                {children &&
                    <ClickableCodesArray
                        codesArray={children}
                        codesType={'children'}
                        language={this.props.language}
                        catalog={this.props.catalog}
                    />}
                {siblings.length > 0 && !children &&
                    <ClickableCodesArray
                        codesArray={siblings}
                        codesType={'siblings'}
                        language={this.props.language}
                        catalog={this.props.catalog}
                    />}
            </>
        );
    }
}

function addProps(Component) {
    return props => <Component {...props} navigation={useNavigate()} />;
}

export default addProps(CodeAttributesVersionized);

