import React from 'react';
import './footer.css';

/**
 * footer of the website, shows the copyright by eonum
 * @component
 */
const Footer: React.FC = () => {

    /**
     * renders the footer
     * @returns {JSX.Element}
     */
    return (
        <footer className='footer'>
            <div className='footer-text'>
                <p>
                    copyright by <a
                    className="link"
                    href='https://eonum.ch'
                    target='_blank'
                    rel='noreferrer'
                >
                    eonum
                </a> 2024 | <a
                    className="link"
                    href='https://eonum.ch/de/kontakt/'
                    target='_blank'
                    rel='noreferrer'
                >
                    contact
                </a>
                </p>
            </div>
        </footer>
    );
}

export default Footer;
