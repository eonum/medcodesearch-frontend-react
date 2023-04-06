import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom'
import './index.css';
import App from './App';
import 'bootstrap/dist/css/bootstrap.min.css';
import {ToastContainer} from "react-toastify"
import 'react-toastify/dist/ReactToastify.css';
import './i18n'
import {I18nextProvider} from "react-i18next"
import i18n from "./i18n";

/**
 * Renders the whole application
 */
// TODO: Use "createRoot" instead of "ReactDOM.render".
//  This will enable React 18, but also leads to failed tests. Thus this maybe needs some more time...
ReactDOM.render(
    // StrictMode renders components twice (on dev but not production), detecting problems / deprecations / warnings.
    <React.StrictMode>
        <I18nextProvider i18n={i18n}>
            <ToastContainer hideProgressBar={true}/>
            <BrowserRouter>
                <App />
            </BrowserRouter>
        </I18nextProvider>
    </React.StrictMode>,
    document.getElementById('root')
);
