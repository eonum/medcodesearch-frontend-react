import React from 'react';
import './footer.css';

/**
 * is the footer of the website and shows the copyright by eonum
 * @component
 */
function Footer() {
    return (
        <footer className='footer'>
            <div className='footer-text'>
                <p>copyright by <a className="link" href='https://eonum.ch/de/blog/medcodesearch-ergaenzung-des-suchdienstes-mit-migel-analysenliste-al-sowie-medikamente-gtin/' target='_blank' rel='noreferrer'>eonum</a> 2022 | <a className="link" href='https://eonum.ch/de/kontakt/' target='_blank' rel='noreferrer'>contact</a></p>
            </div>
        </footer>
    );
}

export default Footer;
