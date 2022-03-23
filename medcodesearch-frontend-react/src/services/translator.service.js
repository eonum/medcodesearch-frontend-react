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
}
export default TranslatorService;
