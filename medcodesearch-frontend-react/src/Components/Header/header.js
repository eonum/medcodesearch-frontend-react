import React, { Component } from 'react';
import './header.css'

class Header extends Component {

    constructor(props) {
        super(props);
        this.state = {
            languagePrev: 'de',
            language: 'de'
        };
        this.updateLanguage = this.updateLanguage.bind(this);
    }
    buttons = ['de', 'fr', 'it', 'en']

    updateLanguage(lang) {
        this.props.language(lang)
        this.setState({languagePrev: this.state.language, language: lang})
    }
    componentDidMount() {
        if(this.state.language !== this.props.activeLangugage){
            this.updateLanguage(this.props.activeLangugage)
        }
    }

    render() {
        return (
                <header className='header'>
                    <div className='language-selection'>
                        {this.buttons.map(buttonLabel =>
                            <button onClick={this.updateLanguage.bind(null, buttonLabel)}
                                    key={buttonLabel}
                                    className= "language-btn"
                                    id={buttonLabel === this.state.language ? "activeLan" : ""}
                                    >
                               {buttonLabel}
                            </button>)}
                    </div>
                </header>
        );
    }
}
 
export default Header;
