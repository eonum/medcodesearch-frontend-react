import React, { Component } from 'react';
import './footer.css';

/**
 * is the footer of the website and shows the copyright by eonum
 * @component
 */
class Footer extends Component {

    /**
     * renders the footer
     * @returns {JSX.Element}
     */
    render() { 
        return (
            <footer className='footer'> 
                <div className='footer-text'>
                    <p>copyright by <a className="link" href='http://eonum.ch' target='_blank' rel='noreferrer'>eonum</a></p>
                </div> 
            </footer>
        );
    }
}
 
export default Footer;
