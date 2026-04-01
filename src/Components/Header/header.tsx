import React, {useEffect} from 'react';
import './header.css'
import {IUpdateStateByArg} from "../../interfaces";
import {useTranslation} from "react-i18next";

interface Props {
    changeLanguage: IUpdateStateByArg,
    activeLanguage: string,
}

const buttons = ['de', 'fr', 'it', 'en']

/**
 * is the header of the website, which is responsible for language changes
 * @component
 */
function Header({ changeLanguage, activeLanguage }: Props) {
    const { i18n } = useTranslation();

    /**
     * Change the language and update i18n.
     * @param lang
     */
    function updateLanguage(lang) {
        changeLanguage(lang)
        i18n.changeLanguage(lang)
    }

    /**
     * If the component mounted, look for a change in the language
     */
    useEffect(() => {
        if (activeLanguage !== 'de') {
            updateLanguage(activeLanguage)
        }
    }, []); // eslint-disable-line

    /**
     * render full header for the website
     * @returns {JSX.Element}
     */
    return (
        <header className='header'>
            <div className='language-selection'>
                {buttons.map(buttonLabel =>
                    <button onClick={() => updateLanguage(buttonLabel)}
                            key={buttonLabel}
                            className= "language-btn"
                            id={buttonLabel === activeLanguage ? "activeLan" : ""}
                            >
                       {buttonLabel}
                    </button>)}
            </div>
        </header>
    );
}

export default Header;
