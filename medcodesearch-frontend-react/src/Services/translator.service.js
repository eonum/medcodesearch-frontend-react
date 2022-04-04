import React, {Component} from "react";

class TranslatorService extends Component{

    static searchNoMatch(language) {
        switch(language) {
            case 'de':
                return "Die Suche erzielte keinen Treffer."
            case 'en':
                return "The search did not match."
            case 'it':
                return "La ricerca ha prodotto alcun risultato."
            case 'fr':
                return "La recherche n'a produit aucun résultat."
        }
    }

    static translateCategory(category, language) {
        switch(category) {
            case "exclusions":
                switch(language) {
                    case 'de':
                        return "Exklusionen"
                    case 'en':
                        return "Exclusions"
                    case 'it':
                        return "Esclusioni"
                    case 'fr':
                        return "Exclusions"
                } break;
            case "inclusions":
                switch(language) {
                    case 'de':
                        return "Inklusionen"
                    case 'en':
                        return "Inclusions"
                    case 'it':
                        return "Inclusioni"
                    case 'fr':
                        return "Inclusions"
                } break;
            case "note":
                switch(language) {
                    case 'de':
                        return "Hinweis"
                    case 'en':
                        return "Note"
                    case 'it':
                        return "Nota"
                    case 'fr':
                        return "Remarque"
                } break;
            case "coding_hint":
                switch(language) {
                    case 'de':
                        return "Codierungs-Hinweis"
                    case 'en':
                        return "Coding Note"
                    case 'it':
                        return "Nota di codifica"
                    case 'fr':
                        return "Remarque sur le codage"
                } break;
            case "synonyms":
                switch(language) {
                    case 'de':
                        return "Synonyme"
                    case 'en':
                        return "Synonyms"
                    case 'it':
                        return "Sinonimi"
                    case 'fr':
                        return "Synonymes"
                } break;
            case "usage":
                switch(language) {
                    case 'de':
                        return "Verwendung"
                    case 'en':
                        return "usage"
                    case 'it':
                        return "utilizzo"
                    case 'fr':
                        return "usage"
                } break;
            case "children":
                switch(language) {
                    case 'de':
                        return "Untergeordnete Codes"
                    case 'en':
                        return "Subordinate codes"
                    case 'it':
                        return "Elementi subordinati"
                    case 'fr':
                        return "Eléments subordonnés"
                }
        }
    }
}
export default TranslatorService;
