import deJson from "../assets/translations/de.json";
import frJson from "../assets/translations/fr.json";
import itJson from "../assets/translations/it.json";
import enJson from "../assets/translations/en.json";

/**
 * Returns the correct language file.
 * @param language
 * @returns: translation hash, f.e. {"LANGUAGE": "Deutsch","LBL_NO_RESULTS": "Die Suche erzielte keinen Treffer.",...}
 */
function getTranslationHash(language) {
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

export default getTranslationHash
