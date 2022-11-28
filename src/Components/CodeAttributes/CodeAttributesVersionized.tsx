import React, {Component} from "react";
import {IAttributes, INavigationHook, IShortEntry} from "../../interfaces";
import getTranslationHash from "../../Services/translation.service";
import {getNavParams, skippableAttributes} from "../../Utils";
import {useLocation, useNavigate} from "react-router-dom";

interface Props {
    attributes: IAttributes,
    catalog: string,
    siblings: IShortEntry[],
    language: string,
    navigation: INavigationHook
}

interface ICodeAttributesUnversionized {
}

/**
 * Responsible for the attributes of a code, for catalogs with versions (i.e. ICD, CHOP, DRG, TARMED).
 */
class CodeAttributesVersionized extends Component<Props, ICodeAttributesUnversionized>{
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
     * looks in the given code for exclusions
     * @param code
     */
    searchExclusion(code) {
        let navigate = this.props.navigation
        navigate({search: "?query=" + code})
    }

    /**
     * Returns a unordered list of clickable codes (used for subordinate or similar codes).
     */
    clickableCodesArray(translateJson, attribute, attributeValue) {
        return <div key={attribute}>
            <h5>{translateJson["LBL_" + attribute.toUpperCase()]}</h5>
            <ul>
                {attributeValue.map((val, j) => (
                    <li key={j}><a key={attribute + "_" + j} className="link" onClick={() => {
                        let navigate = this.props.navigation;
                        let language = this.props.language;
                        let catalog = this.props.catalog;
                        let {pathname, searchString} = getNavParams(val, language, catalog)
                        navigate({
                            pathname: pathname,
                            search: searchString
                        })
                    }}>{val.code}: </a>
                        <span key={"code_text"} dangerouslySetInnerHTML={{__html: val.text}}/></li>
                ))}
            </ul>
        </div>
    }

    renderCodeMapping(mappingFields, attributes, translateJson) {
        for(var j = 0; j < mappingFields.length; j++) {
            var field = mappingFields[j];
            if (attributes[field] != null) {
                // is this a non-trivial mapping?
                if(attributes[field].length > 1 ||
                    attributes[field].length == 1 && (
                        (attributes[field][0]['code'] != attributes['code'] ||
                            attributes[field][0]['text'] != attributes['text']))) {
                    return
                        <div key={"mapping_pre_succ" + j}>
                            <h5>{translateJson["LBL_" + field.toUpperCase()]}</h5>
                            <ul>
                                {attributes[field].map((child,i) => (
                                    <li key={child + "_" + i}><b>{child.code}</b>{" " +  child.text}</li>
                                ))}
                            </ul>
                        </div>
                }
            }
        }
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

        // Use filter to select attributes we want to display, i.e not in skippable attributes and value not null,
        // undefined or empty.
        let enabledAttributes = Object.keys(attributes)
            .filter((key) => !skippableAttributes.includes(key))
            .filter((key) => !["", null, undefined].includes(attributes[key]))
            .filter((key) => attributes[key].length)
            .reduce((obj, key) => {
                return Object.assign(obj, {
                    [key]: attributes[key]
                });
            }, {});


        return (
            <>
                {Object.keys(enabledAttributes).map(attribute => (
                        <div key={attribute}>
                            <h5>{translateJson["LBL_" + attribute.toUpperCase()]}</h5>
                            {typeof enabledAttributes[attribute] === 'object' ?
                                <>
                                    <ul>
                                        {enabledAttributes[attribute].map((val, j) => (
                                            ["exclusions", "supplement_codes"].includes(attribute) ?
                                                this.lookingForLink(val, j, attribute) :
                                                <li key={attribute + "_" + j}><p dangerouslySetInnerHTML={{__html: val}}/></li>
                                        ))}
                                    </ul>
                                </> :
                                <>
                                    <div key={attribute}>
                                        <p dangerouslySetInnerHTML={{__html: attributes[attribute]}}/>
                                    </div>
                                </>}
                        </div>))}
                {mappingFields.map((field, j) => (
                    attributes[field] != null &&
                    (attributes[field].length > 1 ||
                    attributes[field].length == 1 && (
                        (attributes[field][0]['code'] != attributes['code'] ||
                            attributes[field][0]['text'] != attributes['text']))) &&
                    <div key={"mapping_pre_succ" + j}>
                        <h5>{translateJson["LBL_" + field.toUpperCase()]}</h5>
                        <ul>
                            {attributes[field].map((child,i) => (
                                <li key={child + "_" + i}><b>{child.code}</b>{" " +  child.text}</li>
                            ))}
                        </ul>
                    </div>
                ))}
                {attributes.predecessors && attributes.predecessors.length == 0 && !attributes['children'] &&
                    <div className="vertical-spacer alert alert-warning">
                        <h5>{translateJson["LBL_NEW_CODE"]}</h5>
                    </div>
                }
                {children && this.clickableCodesArray(translateJson, 'children', children)}
                {siblings.length > 0 && !children && this.clickableCodesArray(translateJson, "siblings", siblings)}
            </>
        );
    }
}

function addProps(Component) {
    return props => <Component {...props} navigation={useNavigate()} />;
}

export default addProps(CodeAttributesVersionized);

