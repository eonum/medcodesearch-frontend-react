import React, { Component } from 'react';
import './header.css'

class Header extends Component {
    state = {};

    buttons = ['de', 'fr', 'it', 'en']

    render() { 
        return (
                <header className='header'>
                    <div className='language-selection'>
                        {this.buttons.map(buttonLabel =>
                            <button key={buttonLabel} className='language-btn'>
                               {buttonLabel}
                            </button>)}
                    </div>
                </header>
        );
    }
}
 
export default Header;
