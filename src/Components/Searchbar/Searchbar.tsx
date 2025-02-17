import React, { useState, useEffect, useCallback } from "react";
import { Button, Form, FormControl } from "react-bootstrap";
import './Searchbar.css';
import { BsSearch } from "react-icons/bs";
import { createSearchParams, useNavigate, useLocation } from "react-router-dom";
import { RouterService } from "../../Services/router.service";
import { fetchURL } from "../../Utils";
import dateFormat from "dateformat";
import { useTranslation } from "react-i18next";

const resourceTypeByBtn = {
    "SwissDRG": 'drgs',
    "ICD": 'icds',
    "CHOP": 'chops',
    "TARMED": 'tarmeds',
    "TARDOC": 'tardocs',
    "MIGEL": 'migels',
    "AL": 'laboratory_analyses',
    "DRUG": 'drugs',
    'AmbGroup': 'amb_groups',
    'Reha': 'rcgs',
    'Supplements': 'supplements'
}

interface Props {
    language: string;
    selectedButton: string;
    version: string;
    selectedDate: string;
    updateSearchResults: (searchResult: object) => void;
    maxResults: number;
    updateDisplayNoSearchResultsMessage: (displayMessage: boolean) => void;
    updateMaximumResultsReached: (maxResultsReached: boolean) => void;
}

const Searchbar: React.FC<Props> = ({
                                        language,
                                        selectedButton,
                                        version,
                                        selectedDate,
                                        updateSearchResults,
                                        maxResults,
                                        updateDisplayNoSearchResultsMessage,
                                        updateMaximumResultsReached
                                    }) => {

    const navigate = useNavigate();
    const location = useLocation();

    const { t } = useTranslation();
    // Init empty searchTerm.
    const [searchTerm, setSearchTerm] = useState("");

    // Define function to retrieve the current version from the chosen btn.
    // If the catalog is versionized, current version for the chosen button is returned, else we just return the button.
    // The function is recreated if the version changes.
    const getCurrentVersionFromButton = useCallback((chosenBtn: string) => {
        const versionized = !['MIGEL', 'AL', 'DRUG'].includes(chosenBtn);
        return versionized ? version : chosenBtn;
    }, [version]);

    // Define function to fetch the search results from the backend.
    // The function is recreated if any of the dependencies change, i.e. language, selectedButton, selectedDate,
    // maxResults, getCurrentVersionFromButton, updateSearchResults, updateDisplayNoSearchResultsMessage and
    // updateMaximumResultsReached.
    const performSearch = useCallback(async (term: string) => {
        setSearchTerm(term);
        let date = '';

        if ((selectedButton === 'MIGEL' || selectedButton === 'AL') &&
            selectedDate !== dateFormat(new Date(), "dd.mm.yyyy")) {
            date = `date=${selectedDate}&`;
        }

        const searchURL = [
            fetchURL,
            language,
            resourceTypeByBtn[selectedButton],
            getCurrentVersionFromButton(selectedButton),
            `search?${date}highlight=1&skip_sort_by_code=1&max_results=${maxResults}&search=${term}`
        ].join("/");

        try {
            const res = await fetch(searchURL);
            if (res.ok) {
                const json = await res.json();
                if (json.length === 0 && term !== "") {
                    updateDisplayNoSearchResultsMessage(true);
                } else {
                    updateSearchResults(json);
                    updateDisplayNoSearchResultsMessage(false);
                    updateMaximumResultsReached(json.length < maxResults || json.length === 100);
                }
            }
        } catch (error) {
            console.error('Search fetch error:', error);
        }
    }, [
        language,
        selectedButton,
        selectedDate,
        maxResults,
        getCurrentVersionFromButton,
        updateSearchResults,
        updateDisplayNoSearchResultsMessage,
        updateMaximumResultsReached
    ]);

    // Define function to handle the searchbar input change.
    // The function is recreated if dependencies selectedButton or selectedDate change.
    // navigate needs to be in the dependencies array because React's dependency rules require including all external
    // values used inside useCallback.
    const handleSearchInputChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
        let date = '';
        if (e.target.value === "") {
            navigate({ search: "" });
        } else {
            if ((selectedButton === 'MIGEL' || selectedButton === 'AL' || selectedButton === 'DRUG') &&
                selectedDate !== dateFormat(new Date(), "dd.mm.yyyy")) {
                date = `date=${selectedDate}&`;
            }
            navigate({
                search: date + createSearchParams({
                    query: e.target.value.replace(/\+/g, ' ')
                }).toString()
            });
        }
    }, [navigate, selectedButton, selectedDate]);

// Add effect to watch for URL search parameter changes
    useEffect(() => {
        const query = RouterService.getParamValue('query');
        setSearchTerm(query);
        performSearch(query);
    }, [location.search, performSearch]); // Add location.search as dependency

    return (
        <Form className="d-flex">
            <FormControl
                onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                        e.preventDefault();
                    }
                }}
                onChange={handleSearchInputChange}
                type="search"
                placeholder={t("LBL_SEARCH_PLACEHOLDER")}
                defaultValue={searchTerm}
                className="me-2"
                aria-label="Search"
                id="searchbarInput"
            />
            <Button id="btn-go">
                <BsSearch />
            </Button>
        </Form>
    );
};

export default Searchbar;
