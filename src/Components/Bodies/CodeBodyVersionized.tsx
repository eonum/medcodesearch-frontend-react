import {useNavigate, useParams} from "react-router-dom";
import React, {useState, useEffect} from "react";
import {Breadcrumb} from "react-bootstrap";
import {IAttributes, IShortEntry} from "../../interfaces";
import {fetchURL, getNavParams, initialCodeState} from "../../Utils";
import CodeAttributesVersionized from "../CodeAttributes/CodeAttributesVersionized";
import {useTranslation} from "react-i18next";
import {toast} from "react-toastify";

/**
 * Responsible for the body of the website, for catalogs with versions (i.e. ICD, CHOP, DRG, TARMED, TARDOC, REHA, ZE).
 */
function CodeBodyVersionized() {
    const { language, catalog, resource_type, code, version } = useParams();
    const navigate = useNavigate();
    const { t } = useTranslation();

    const [attributes, setAttributes] = useState<IAttributes>(initialCodeState.attributes as IAttributes);
    const [siblings, setSiblings] = useState<IShortEntry[]>(initialCodeState.siblings);
    const [parents, setParents] = useState<IShortEntry[]>(initialCodeState.parents);

    /**
     * Does a case distinction for all the catalogs and set the string ready for fetching
     */
    async function fetchHelper(lang, res_type, cd, ver) {
        let fetchString = [fetchURL, lang, res_type, ver, cd].join("/") + "?show_detail=1";
        return await fetch(fetchString).then((res) => {
            if (!res.ok) throw new Error(`HTTP ${res.status}`)
            return res.json()
        })
    }

    /**
     * Fetch the information from the backend and return the attributes
     */
    async function fetchInformations(): Promise<IAttributes | null> {
        let codeForFetch = code;
        // Set base code for mdcs, since this is not equal to version but equal to 'ALL'.
        if (resource_type === 'mdcs' && code === version || resource_type === 'arcgs' && code === version) {
            codeForFetch = 'ALL'
        }
        try {
            const detailedCode = await fetchHelper(language, resource_type, codeForFetch, version)
            if (detailedCode !== null) {
                setAttributes(detailedCode)
            }
            return detailedCode
        } catch {
            toast.error(t('LBL_FETCH_ERROR'))
            return null
        }
    }

    /**
     * fetch the sibling of the component
     */
    async function fetchSiblings(attrs: IAttributes, parent: IShortEntry) {
        if (attrs.children === null && resource_type !== "partitions") {
            await fetch([fetchURL, parent.url].join("/") + "?show_detail=1")
                .then((res) => {
                    if (!res.ok) throw new Error(`HTTP ${res.status}`)
                    return res.json()
                })
                .then((json) => {
                    let sibs = json.children.filter(function(child) {
                        return child.code !== code;
                    })
                    setSiblings(sibs)
                })
                .catch(() => {
                    toast.error(t('LBL_FETCH_ERROR'))
                })
        }
    }

    /**
     * fetch the grandparent of the component
     */
    async function fetchGrandparents(parent: IShortEntry | null) {
        let parentsArr: IShortEntry[] = []
        while(parent) {
            parentsArr = [...parentsArr, parent]
            await fetch([fetchURL, parent.url].join("/") + "?show_detail=1")
                .then((res) => {
                    if (!res.ok) throw new Error(`HTTP ${res.status}`)
                    return res.json()
                })
                .then((json) => {
                    parent = json["parent"]
                })
                .catch(() => {
                    toast.error(t('LBL_FETCH_ERROR'))
                    parent = null
                })
        }
        setParents(parentsArr)
    }

    useEffect(() => {
        setAttributes(initialCodeState.attributes as IAttributes)
        setSiblings(initialCodeState.siblings)
        setParents(initialCodeState.parents)

        async function load() {
            const attrs = await fetchInformations()
            if (attrs?.parent) {
                await fetchSiblings(attrs, attrs.parent)
                await fetchGrandparents(attrs.parent)
            }
        }
        load()
    }, [language, version, code]); // eslint-disable-line

    function internationalizeIcdBaseCode(cd) {
        return cd.replace("ICD10-GM", t("LBL_ICD_LABEL"))
    }

    function displayCode(cd, ver, cat) {
        let currentItem;
        let breadcrumbRoot;
        if (cd) {
            breadcrumbRoot = ver.replace("_", " ")
            currentItem = attributes.code.includes("ICD10") ?
                internationalizeIcdBaseCode(cd) : cd.replace("_", " ")
            if (cat == "SwissDRG") {
                breadcrumbRoot = "SwissDRG " + ver.substring(1)
            } else if (cat == "Supplements") {
                breadcrumbRoot = t('LBL_SUPPLEMENTS') + ' ' + ver.substring(1)
            } else if (cat == "Reha") {
                breadcrumbRoot = "ST Reha " + ver.substring(5).replace("_", " ")
            } else if (cat == "AmbGroup"){
                breadcrumbRoot = t('LBL_AMB_GROUP') + " " + ver.substring(1)
            }
        } else {
            breadcrumbRoot = '';
            currentItem = '';
        }
        return cd == ver ? breadcrumbRoot : currentItem
    }

    /**
     * Render the body component
     * @returns {JSX.Element}
     */
    const currentCode = attributes.code;

    return (
        <div>
            <Breadcrumb>
                {parents.slice().reverse().map((currElement, i) => {
                    return (
                        <Breadcrumb.Item
                            key={i}
                            onClick={() => {
                                let {pathname, searchString} = getNavParams(currElement, language, catalog)
                                navigate({pathname: pathname, search: searchString})
                            }}
                            className="breadLink"
                        >
                            {displayCode(currElement.code, version, catalog)}
                        </Breadcrumb.Item>
                    );
                })}
                <Breadcrumb.Item active>
                    {displayCode(currentCode, version, catalog)}
                </Breadcrumb.Item>
            </Breadcrumb>
            <h3>{displayCode(currentCode, version, catalog)}</h3>
            {version == attributes.code || attributes.code == "ALL" ?
                <p></p> : <p>{attributes.text}</p>}
            <CodeAttributesVersionized
                attributes={attributes}
                catalog={catalog}
                version={version}
                siblings={siblings}
                language={language}
                resourceType={resource_type}
            />
        </div>
    )
}

export default CodeBodyVersionized;
