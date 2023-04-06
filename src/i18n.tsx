import i18next from "i18next";
import { initReactI18next} from "react-i18next";

// Import translation files
import translationDe from "./assets/translations/de.json"
import translationFr from "./assets/translations/fr.json"
import translationIt from "./assets/translations/it.json"
import translationEn from "./assets/translations/en.json"


const resources = {
    de: {
        translation: translationDe
    },
    fr: {
        translation: translationFr
    },
    it: {
        translation: translationIt
    },
    en: {
        translation: translationEn
    }
}

// Initialize i18next
i18next
.use(initReactI18next)
.init({
    fallbackLng: 'de',
    resources,
    lng: "de",
});

export default i18next
