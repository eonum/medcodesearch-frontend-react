import {useNavigate, useParams} from "react-router-dom";
import React, { useState, useEffect } from "react";
import {Breadcrumb, BreadcrumbItem} from "react-bootstrap";
import { ICode, IShortEntry } from "../../interfaces";
import { fetchURL, getNavParams, initialCodeState } from "../../Utils";
import CodeAttributesUnversionized from "../CodeAttributes/CodeAttributesUnversionized";
import { useTranslation } from 'react-i18next';

interface Props {
    selectedDate: string,
}

/**
 * Responsible for the body of the website, for catalogs without versions (i.e. MIGEL, AL, DRUG)
 */
const CodeBodyUnversionized: React.FC<Props> = ({ selectedDate }) => {
    const [codeState, setCodeState] = useState<ICode>(initialCodeState);
    const navigate = useNavigate();
    const params = useParams();
    const { t } = useTranslation();

    /**
     * Fetches information from the backend and does case distinction for top level code (which is given by 'DRUG',
     * 'MIGEL' or 'AL', i.e. the catalog).
     * */
    const fetchInformation = async () => {
        const { language, code, resource_type, catalog } = params;
        const codeForFetch = code === 'all' ? catalog : code;

        const fetchString = [
            fetchURL,
            language,
            catalog === 'AL' ? 'laboratory_analyses' : resource_type,
            catalog,
            codeForFetch
        ].join("/") + "?show_detail=1&date=" + selectedDate;

        const response = await fetch(fetchString);
        const newAttributes = await response.json();

        if (newAttributes !== null) {
            setCodeState(prev => ({ ...prev, attributes: newAttributes }));
        }
    }


    /**
     * Fetches the grandparent(s) of the component, i.e. the whole parent(s) chain up to the base code.
     * @param parent
     */
    const fetchParentChain = async (parent: IShortEntry) => {
        let parents = [];
        let currentParent = parent;

        while (currentParent) {
            parents = [...parents, currentParent];
            const response = await fetch([fetchURL, currentParent.url].join("/") + "?show_detail=1");
            const json = await response.json();
            currentParent = json["parent"];
        }

        setCodeState(prev => ({ ...prev, parents }));
    };

    /**
     * Fetches code siblings, i.e. similar codes.
     * @param parent
     */
    const fetchSiblings = async (parent: any) => {
        if (!parent) return;

        const fetchString = [fetchURL, parent.url].join("/") + "?show_detail=1&date=" + selectedDate;
        const response = await fetch(fetchString);
        const json = await response.json();
        const siblings = json.children.filter(child => child.code !== params.code);
        setCodeState(prev => ({ ...prev, siblings }));
    };

    /**
     * Converts the code into the given language if it is a base code, i.e. if 'MIGEL', 'AL', 'DRUG'.
     * Use label or full translation, based on if it is used for the breadcrumb or not.
     * If not a base code, return the code as is.
     * @param code
     */
    const displayCode = (code: string, isBreadcrumbLabel: boolean) => {
        if (["AL", "MIGEL", "DRUG"].includes(code)) {
            return isBreadcrumbLabel ? t(`LBL_${code}_LABEL`) : t(`LBL_${code}`);
        }
        return code;
    };

    useEffect(() => {
        const fetchData = async () => {
            setCodeState(initialCodeState);
            await fetchInformation();
            await fetchSiblings(codeState.attributes["parent"]);
            await fetchParentChain(codeState.attributes["parent"]);
        };
        fetchData();
    }, [params.language, params.code, params.catalog, selectedDate]);

    const { attributes, siblings, parents } = codeState;
    const { language, catalog, resource_type, code } = params;
    const titleTag = ["MIGEL", "AL"].includes(catalog) ? displayCode(catalog, false) : "";

    return (
        <div>
            <Breadcrumb>
                {parents.reverse().map((element, i) => (
                        <Breadcrumb.Item
                            title={["MIGEL", "AL"].includes(element.code) ? titleTag : ""}
                            key={i}
                            className="breadLink"
                            onClick={() => {
                                let {
                                    pathname,
                                    searchString
                                } = getNavParams(element, language, catalog, resource_type)
                                // No breadcrumb for DRUG catalog
                                if (["MIGEL", "AL"].includes(catalog)) {
                                    navigate({pathname: pathname, search: searchString})
                                }
                            }}>
                            {displayCode(element.code, true)}
                        </Breadcrumb.Item>
                    ))}
                <BreadcrumbItem active>{displayCode(attributes["code"], true)}</BreadcrumbItem>
            </Breadcrumb>
            <h3>{displayCode(attributes["code"], false)}</h3>
            <p dangerouslySetInnerHTML={{ __html: attributes["text"] }} />
            <CodeAttributesUnversionized
                attributes={attributes}
                catalog={catalog}
                siblings={siblings}
                language={language}
                resourceType={resource_type}
                code={code}
            />
        </div>
    );
};

export default CodeBodyUnversionized;
