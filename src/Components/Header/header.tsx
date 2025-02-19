import React from 'react';
import './header.css'
import {IUpdateStateByArg} from "../../interfaces";
import {useTranslation} from "react-i18next";

interface Props {
    changeLanguage: IUpdateStateByArg,
    activeLanguage: string,
}

/**
 * header of the website, responsible for language changes
 * @component
 */
const Header: React.FC<Props> = ({ changeLanguage, activeLanguage }) => {
    const { i18n } = useTranslation();
    const buttons = ['de', 'fr', 'it', 'en']

    const handleLanguageChange = (lang: string) => {
        changeLanguage(lang);
        i18n.changeLanguage(lang);
    };

    return (
        <header className='header'>
            <div className='language-selection'>
                {buttons.map(buttonLabel => (
                    <button
                        onClick={() => handleLanguageChange(buttonLabel)}
                        key={buttonLabel}
                        className="language-btn"
                        id={buttonLabel === activeLanguage ? "activeLan" : ""}
                    >
                        {buttonLabel}
                    </button>
                ))}
            </div>
        </header>
    );
}

export default Header;
