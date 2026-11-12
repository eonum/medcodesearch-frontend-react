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
 * StrictMode is enabled in development but disabled during E2E (Playwright) tests.
 * In React 18, StrictMode double-invokes effects in development to surface side-effect bugs.
 * This causes E2E tests to time out waiting for data that gets refetched after the second
 * invocation resets component state. Setting VITE_E2E=true (done by the webServer command in
 * playwright.config.ts) replaces StrictMode with a plain Fragment so effects run once,
 * matching production behaviour. StrictMode has no effect in production builds regardless.
 */
const root = createRoot(document.getElementById('root') as HTMLElement);
const isE2E = import.meta.env.VITE_E2E === 'true';
// StrictMode is the recommended wrapper for React 18 apps — keep it enabled during development.
const Wrapper = isE2E ? React.Fragment : React.StrictMode;

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
