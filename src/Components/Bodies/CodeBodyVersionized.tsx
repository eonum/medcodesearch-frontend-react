import {useNavigate, useParams} from "react-router-dom";
import React, { useState, useEffect } from "react";
import {Breadcrumb} from "react-bootstrap";
import {ICode, IShortEntry} from "../../interfaces";
import {fetchURL, getNavParams, initialCodeState} from "../../Utils";
import CodeAttributesVersionized from "../CodeAttributes/CodeAttributesVersionized";
import {useTranslation} from "react-i18next";

/**
 * Responsible for the body of the website, for catalogs with versions (i.e. ICD, CHOP, DRG, TARMED, TARDOC, REHA, ZE).
 */
const CodeBodyVersionized: React.FC = () => {
    const [codeState, setCodeState] = useState<ICode>(initialCodeState);
    const [breadcrumbParents, setBreadcrumbParents] = useState([]);
    const navigate = useNavigate();
    const params = useParams();
    const { t, i18n } = useTranslation();
    // Make translation language aware.
    useEffect(() => {
        i18n.changeLanguage(params.language);
    }, [params.language]);

    /**
     * Fetches information from the backend and does case distinction for top level code ('ALL' for arcgs and mdcs).
     */
    const fetchInformation = async () => {
        let { language, resource_type, code, version } = params;
        let codeForFetch = code;

        if ((resource_type === 'mdcs' && code === version) || (resource_type === 'arcgs' && code === version)) {
            codeForFetch = 'ALL';
        }

        // Fetch the detailed code information from the backend.
        const fetchString = [fetchURL, language, resource_type, version, codeForFetch].join("/") + "?show_detail=1";
        const detailedCode = await fetch(fetchString).then(res => res.json());

        // Update the attributes state with the fetched information.
        if (detailedCode !== null) {
            setCodeState(prev => ({ ...prev, attributes: detailedCode }));
        }
    };

    /**
     * Fetches code siblings, i.e. similar codes.
     * @param parent
     */
    const fetchSiblings = async (parent: IShortEntry) => {
        if (!parent) return;
        if (codeState.attributes.children === null && params.resource_type !== "partitions") {
            const response = await fetch([fetchURL, parent.url].join("/") + "?show_detail=1");
            const json = await response.json();
            const siblings = json.children.filter(child => child.code !== params.code);
            setCodeState(prev => ({ ...prev, siblings }));
        }
    };

    /**
     * Fetches the grandparent(s) of the component, i.e. the whole parent(s) chain up to the base code.     * @param parent
     */
    const fetchParentsChain = async (parent: IShortEntry) => {
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

    const internationalizeIcdBaseCode = (code: string) => {
        return code.replace("ICD10-GM", t("LBL_ICD_LABEL"))
    }

    const displayCode = (code: string, version: string, catalog: string) => {
        if (!code) return '';

        let breadcrumbRoot = version.replace("_", " ");
        let currentItem = code.includes("ICD10") ? internationalizeIcdBaseCode(code) : code.replace("_", " ");
        if (catalog == "SwissDRG") {
            breadcrumbRoot = "SwissDRG " + version.substring(1)
        } else if (catalog == "Supplements") {
            breadcrumbRoot = t('LBL_SUPPLEMENTS') + ' ' + version.substring(1)
        } else if (catalog == "Reha") {
            breadcrumbRoot = "ST Reha " + version.substring(5).replace("_", " ")
        } else if (catalog == "AmbGroup"){
            breadcrumbRoot = t('LBL_AMB_GROUP') + " " + version.substring(1)
        }

        return code == version ? breadcrumbRoot : currentItem
    }

    // First useEffect for initial data fetch
    useEffect(() => {
        const fetchData = async () => {
            setCodeState(initialCodeState);
            await fetchInformation();
        };
        fetchData();
    }, [params.language, params.version, params.code]);

    // Second useEffect for parent and sibling fetching
    useEffect(() => {
        const fetchParentAndSiblings = async () => {
            if (codeState.attributes?.parent) {
                await fetchSiblings(codeState.attributes.parent);
                await fetchParentsChain(codeState.attributes.parent);
            }
        };
        fetchParentAndSiblings();
    }, [codeState.attributes]);

    // Third useEffect for breadcrumb updates
    useEffect(() => {
        setBreadcrumbParents([...codeState.parents].reverse());
    }, [codeState.parents]);

    const { attributes, siblings } = codeState;
    const { catalog, version, language, resource_type } = params;

    return (
        <div>
            <Breadcrumb>
                {breadcrumbParents.map((element, i) => (
                    <Breadcrumb.Item
                        key={i}
                        onClick={() => {
                            const { pathname, searchString } = getNavParams(element, language, catalog);
                            navigate({ pathname, search: searchString });
                        }}
                        className="breadLink"
                    >
                        {displayCode(element.code, version, catalog)}
                    </Breadcrumb.Item>
                ))}
                <Breadcrumb.Item active>
                    {displayCode(attributes.code, version, catalog)}
                </Breadcrumb.Item>
            </Breadcrumb>
            <h3>{displayCode(attributes.code, version, catalog)}</h3>
            {version === attributes.code || attributes.code === "ALL" ?
                <p></p> :
                <p>{attributes.text}</p>
            }
            <CodeAttributesVersionized
                attributes={attributes}
                catalog={catalog}
                version={version}
                siblings={siblings}
                language={language}
                resourceType={resource_type}
            />
        </div>
    );
};

export default CodeBodyVersionized;