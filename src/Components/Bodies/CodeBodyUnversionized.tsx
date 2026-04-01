import {useNavigate, useParams} from "react-router-dom";
import React, {useState, useEffect} from "react";
import {Breadcrumb, BreadcrumbItem} from "react-bootstrap";
import {IAttributes, IShortEntry} from "../../interfaces";
import {fetchURL, getNavParams, initialCodeState} from "../../Utils";
import CodeAttributesUnversionized from "../CodeAttributes/CodeAttributesUnversionized";
import { useTranslation } from 'react-i18next';
import {toast} from "react-toastify";

interface Props {
    selectedDate: string,
}

/**
 * Responsible for the body of the website, for catalogs without versions (i.e. MIGEL, AL, DRUG)
 */
function CodeBodyUnversionized({ selectedDate }: Props) {
    const { language, catalog, resource_type, code } = useParams();
    const navigate = useNavigate();
    const { t } = useTranslation();

    const [attributes, setAttributes] = useState<IAttributes>(initialCodeState.attributes as IAttributes);
    const [siblings, setSiblings] = useState<IShortEntry[]>(initialCodeState.siblings);
    const [parents, setParents] = useState<IShortEntry[]>(initialCodeState.parents);

    /**
     * Does a case distinction for all the catalogs and set the string ready for fetching
     */
    async function fetchHelper(lang, res_type, cd, cat) {
        let fetchString = [fetchURL, lang, res_type, cat, cd].join("/") +
            "?show_detail=1&date=" + selectedDate;
        return await fetch(fetchString).then((res) => {
            if (!res.ok) throw new Error(`HTTP ${res.status}`)
            return res.json()
        })
    }

    /**
     * Fetch the information from the backend and return the attributes
     */
    async function fetchInformations(): Promise<IAttributes | null> {
        let codeForFetch = code === 'all' ? catalog : code;
        try {
            const newAttributes = await fetchHelper(
                language,
                catalog === 'AL' ? 'laboratory_analyses' : resource_type,
                codeForFetch,
                catalog)
            if (newAttributes !== null) {
                setAttributes(newAttributes)
            }
            return newAttributes
        } catch {
            toast.error(t('LBL_FETCH_ERROR'))
            return null
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

    /**
     * fetch the sibling of the component
     */
    async function fetchSiblings(parent: IShortEntry) {
        let fetchString = [fetchURL, parent.url].join("/") + "?show_detail=1&date=" + selectedDate;
        await fetch(fetchString)
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

    useEffect(() => {
        setAttributes(initialCodeState.attributes as IAttributes)
        setSiblings(initialCodeState.siblings)
        setParents(initialCodeState.parents)

        async function load() {
            const attrs = await fetchInformations()
            if (attrs?.parent) {
                await fetchSiblings(attrs.parent)
            }
            await fetchGrandparents(attrs?.parent ?? null)
        }
        load()
    }, [language, code, catalog, selectedDate]); // eslint-disable-line

    /**
     * If input is a base code ('MIGEL', 'AL', 'DRUG'), the method returns the base code in the given language,
     *  otherwise just returns input.
     */
    function displayCode(cd, isBreadcrumbLabel) {
        if (["AL", "MIGEL", "DRUG"].includes(cd)) {
            return isBreadcrumbLabel ? t(`LBL_${cd}_LABEL`) : t(`LBL_${cd}`)
        } else {
            return cd
        }
    }

    /**
     * Render the CodeBodyUnversionized component
     * @returns {JSX.Element}
     */
    const titleTag = ["MIGEL", "AL"].includes(catalog) ? displayCode(catalog, false) : "";

    return (
        <div>
            <Breadcrumb>
                {parents.slice().reverse().map((currElement, i) => {
                    return (
                        <Breadcrumb.Item
                            title={["MIGEL", "AL"].includes(currElement.code) ? titleTag : ""}
                            key={i}
                            className="breadLink"
                            onClick={() => {
                                let {
                                    pathname,
                                    searchString
                                } = getNavParams(currElement, language, catalog, resource_type)
                                // No breadcrumb for DRUG catalog
                                if (["MIGEL", "AL"].includes(catalog)) {
                                    navigate({pathname: pathname, search: searchString})
                                }
                            }}>
                            {displayCode(currElement.code, true)}
                        </Breadcrumb.Item>
                    )})}
                <BreadcrumbItem active>{displayCode(attributes["code"], true)}</BreadcrumbItem>
            </Breadcrumb>
            <h3>{displayCode(attributes["code"], false)}</h3>
            <p dangerouslySetInnerHTML={{__html: attributes["text"]}} />
            <CodeAttributesUnversionized
                attributes={attributes}
                catalog={catalog}
                siblings={siblings}
                language={language}
                resource_type={resource_type}
                code={code}
            />
        </div>
    )
}

export default CodeBodyUnversionized;
