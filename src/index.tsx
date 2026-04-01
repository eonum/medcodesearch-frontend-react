import React from 'react';
import { createRoot } from 'react-dom/client';
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
 * Renders the whole application.
 *
 * StrictMode is enabled in development but disabled during Cypress tests.
 * In React 18, StrictMode double-invokes effects in development to surface side-effect bugs.
 * This causes Cypress tests to time out waiting for data that gets refetched after the second
 * invocation resets component state. Setting REACT_APP_CYPRESS=true (done in the
 * start-test-server script) replaces StrictMode with a plain Fragment so effects run once,
 * matching production behaviour. StrictMode has no effect in production builds regardless.
 */
const root = createRoot(document.getElementById('root') as HTMLElement);
const isCypress = process.env.REACT_APP_CYPRESS === 'true';
// StrictMode is the recommended wrapper for React 18 apps — keep it enabled during development.
const Wrapper = isCypress ? React.Fragment : React.StrictMode;

root.render(
    <Wrapper>
        <I18nextProvider i18n={i18n}>
            <ToastContainer hideProgressBar={true}/>
            <BrowserRouter>
                <App />
            </BrowserRouter>
        </I18nextProvider>
    </Wrapper>
);
