import React, { Component } from 'react';
import './header.css'
import {IUpdateStateByArg} from "../../interfaces";

interface Props {
    changeLanguage: IUpdateStateByArg,
    activeLanguage: string
}

interface IHeader {
    languagePrev: string,
    language: string
}

/**
 * is the header of the website, which is responsible for language changes
 * @component
 */
class Header extends Component<Props, IHeader> {

    buttons = ['de', 'fr', 'it', 'en']

    /**
     * Constructor sets the default language and calls the updateLanguage to look for changes
     * @param props
     */
    constructor(props) {
        super(props);
        this.state = {
            languagePrev: 'de',
            language: 'de'
        };
        this.updateLanguage = this.updateLanguage.bind(this);
    }

    /**
     * Change the languagePrev state to the current language
     * @param lang
     */
    // TODO: I don't really get the use of this function.
    updateLanguage(lang) {
        this.props.changeLanguage(lang)
        this.setState({languagePrev: this.state.language, language: lang})
    }

    /**
     * If the compounent mounted componentDidMount() looks for a change in the language
     */
    componentDidMount() {
        if(this.state.language !== this.props.activeLanguage){
            this.updateLanguage(this.props.activeLanguage)
        }
    }

    /**
     * render full header for the website
     * @returns {JSX.Element}
     */
    render() {
        return (
                <header className='header'>
                    <div className='language-selection'>
                        {this.buttons.map(buttonLabel =>
                            <button onClick={this.updateLanguage.bind(null, buttonLabel)}
                                    key={buttonLabel}
                                    className= "language-btn"
                                    id={buttonLabel === this.props.activeLanguage ? "activeLan" : ""}
                                    >
                               {buttonLabel}
                            </button>)}
                    </div>
                </header>
        );
    }
}


export default Header;
