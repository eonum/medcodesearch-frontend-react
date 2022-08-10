import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom'
import './index.css';
import App from './App';
import 'bootstrap/dist/css/bootstrap.min.css';

/**
 * Renders the whole application
 */

// TODO: render app here and move <Router /> part to app
//  (see casematch or https://github.com/eonum/medlandscape/blob/master/src/index.js for examples)
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    // StrictMode renders components twice (on dev but not production), detecting problems / deprecations / warnings.
    <React.StrictMode>
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </React.StrictMode>,
);
