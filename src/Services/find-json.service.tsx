import deJson from "../assets/translations/de.json";
import frJson from "../assets/translations/fr.json";
import itJson from "../assets/translations/it.json";
import enJson from "../assets/translations/en.json";
/**
 * looks for the correct language file
 * @param language
 * @returns {{LANGUAGE: string, LBL_NO_RESULTS: string, LBL_BACK_SEARCH: string, LBL_CHILDREN: string, LBL_SEARCH_PLACEHOLDER: string, LBL_EXCLUSIONS: string, LBL_INCLUSIONS: string, LBL_DESCRIPTIONS: string, LBL_RELEVANT_CODES: string, LBL_NOTE: string, LBL_NOTES: string, LBL_CODING_HINT: string, LBL_SUPPLEMENT_CODES: string, LBL_USAGE: string, LBL_SYNONYMS: string, LBL_SELECT_LANGUAGE: string, LBL_CATALOG_LANGUAGE_NOT_AVAILABLE: string, LBL_BACK: string, LBL_FAVORITE_TITLE: string, LBL_FAVORITE_NOELEMENTS: string, LBL_ELEMENT_ADDED: string, LBL_ELEMENT_REMOVED: string, LBL_FAVORITE_ELEMENT: string, LBL_IS_FAVORITE: string, LBL_SIBLINGS: string, LBL_REDIRECT_CASEMATCH: string, LBL_REDIRECT_SWISSDRG: string, LBL_ANALOGOUS_CODE_TEXT: string, LBL_PREDECESSORS: string, LBL_SUCCESSORS: string, LBL_NEW_CODE: string, LBL_REG_op: string, LBL_REG: string, LBL_MED_INTERPRET: string, LBL_TECH_INTERPRET: string, LBL_SUBSTANCE_NAME: string, LBL_FIELD_OF_APP: string, LBL_LIMITATION: string, LBL_FACULTY: string, LBL_ACTIVE_SUBSTANCES: string, LBL_ATC_CODE: string, LBL_UNIT: string, LBL_COMMENT: string, LBL_GROUPS: string, LBL_BLOCKS: string}}
 */
function findJsonService(language) {
    switch (language) {
        case "de":
            return deJson
        case "fr":
            return frJson
        case "it":
            return itJson
        case "en":
            return enJson
        default:
            return deJson
    }
}
export default findJsonService
