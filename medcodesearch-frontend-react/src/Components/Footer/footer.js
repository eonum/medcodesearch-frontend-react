import React, { Component } from 'react';
import './footer.css';

class Footer extends Component {
    render() { 
        return (
            <footer className='footer'> 
                <div className='footer-text'>
                    <p>copyright by <a className="link" href='http://eonum.ch' target='_blank'>eonum</a></p>
                </div> 
            </footer>
        );
    }
}
 
export default Footer;
