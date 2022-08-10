import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom'
import './index.css';
import App from './App';
import 'bootstrap/dist/css/bootstrap.min.css';

/**
 * Renders the whole application
 */
// TODO: Use "createRoot" instead of "ReactDOM.render".
//  This will enable React 18, but also leads to failed tests. Thus this maybe needs some more time...
ReactDOM.render(
    // StrictMode renders components twice (on dev but not production), detecting problems / deprecations / warnings.
    <React.StrictMode>
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </React.StrictMode>,
    document.getElementById('root')
);
