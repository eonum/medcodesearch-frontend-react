import React, {useEffect, useState} from "react";
import {Button, Form, FormControl} from "react-bootstrap";
import './Searchbar.css';
import {BsSearch} from "react-icons/bs";
import {createSearchParams, useNavigate} from "react-router-dom";
import RouterService from "../../Services/router.service";
import {fetchURL} from "../../Utils";
import {INavigationHook} from "../../interfaces";
import dateFormat from "dateformat"
import {useTranslation} from "react-i18next";

const resourceTypeByBtn = {
    "SwissDRG": 'drgs',
    "ICD": 'icds',
    "CHOP": 'chops',
    "TARMED": 'tarmeds',
    "MIGEL": 'migels',
    "AL": 'laboratory_analyses',
    "DRUG": 'drugs',
    'AmbGroup': 'amb_groups'
}

interface Props {
    language: string,
    selectedButton: string,
    version: string,
    selectedDate: string,
    updateSearchResults: { (searchResult: string | object): void },
    navigation: INavigationHook
    translation: any
}

/**
 * Searchbar of the website. Responsible for fetching and updating search results by input query.
 * @component
 */
const Searchbar: React.FunctionComponent<Props> = props =>  {
    // Init searchTerm.
    const [searchTerm, setSearchTerm] = useState<string>(RouterService.getQueryVariable('query'));
    const navigate = useNavigate();
    const {t} = useTranslation();

    // Set search term and update search results when first mounted or whenever search term, lang, selected button,
    // version or selected date changes.
    useEffect(() => {
        let date = '';
        if (props.selectedButton === 'MIGEL' || props.selectedButton === 'AL'){
            if(props.selectedDate !== dateFormat(new Date(), "dd.mm.yyyy")){
                date = 'date=' + props.selectedDate + '&'
            }
        }
        let searchURL = [
            fetchURL,
            props.language,
            resourceTypeByBtn[props.selectedButton],
            convertButtonToBackendVersion(props.selectedButton),
            'search?' + date + 'highlight=1&search='+ searchTerm
        ].join("/")
        // Fetch an update search results.
        const fetchData = async () => {
            fetch(searchURL)
                .then((res) => {
                    if(res.ok) {
                        return res.json()
                    }
                })
                .then((json) => {
                    props.updateSearchResults("reset") //reset parent array
                    if(json.length === 0 && searchTerm !== "") {
                        props.updateSearchResults("empty")
                    }
                    for(let i = 0; i < json.length; i++) {
                        let obj = json[i];
                        props.updateSearchResults(obj);
                    }
                })
        }
        // call the function
        fetchData()
    },[props.language, props.selectedButton, props.version, props.selectedDate, searchTerm])

    /**
     * Navigate to new url and update search term depending on query input.
     * @param queryString
     */
    function handleSearch(queryString) {
        let date = '';
        if (queryString.target.value === "") {
            navigate({search: ""});
        } else {
            if (props.selectedButton === 'MIGEL' || props.selectedButton === 'AL'
                || props.selectedButton === 'DRUG') {
                if (props.selectedDate !==  dateFormat(new Date(), "dd.mm.yyyy")) {
                    date = 'date=' + props.selectedDate + '&'
                }
            }
            navigate({search: date + createSearchParams({query: queryString.target.value.replace(/\+/g, ' ')}).toString()});
        }
        setSearchTerm(RouterService.getQueryVariable('query'));
    }

    /**
     * takes the chosen button name and returns the corresponding resource_type and version joined by "/".
     * @param chosenBtn
     * @returns {string}
     */
    function convertButtonToBackendVersion(chosenBtn) {
        let versionized = ['MIGEL', 'AL', 'DRUG'].includes(chosenBtn) ? false : true
        return versionized ? props.version : chosenBtn
    }

    // Return the searchbar JSX.
    return (
        <Form className="d-flex">
            <FormControl
                onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                        e.preventDefault()
                    }
                }}
                onChange={handleSearch}
                type="search"
                placeholder={t("LBL_SEARCH_PLACEHOLDER")}
                defaultValue={searchTerm}
                className="me-2"
                aria-label="Search"
                id={"searchbarInput"}
            />
            <Button id="btn-go">
                <BsSearch/>
            </Button>
        </Form>
    )
}

export default Searchbar;
