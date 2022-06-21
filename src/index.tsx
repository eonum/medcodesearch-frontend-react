import React from 'react';
import ReactDOM from 'react-dom/client';
import {BrowserRouter as Router, Navigate, Route, Routes} from "react-router-dom";
import './index.css';
import App from './App';
import 'bootstrap/dist/css/bootstrap.min.css';
import Main from "./Components/Main/Main";
import CodeBodyUnversionized from "./Components/Bodies/CodeBodyUnversionized";
import CodeBodyVersionized from "./Components/Bodies/CodeBodyVersionized";
import reportWebVitals from './reportWebVitals';


/**
 * Renders the whole application
 */
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <React.StrictMode>
        <Router>
            <Routes>
                <Route path="/" element={<App/>}>
                    <Route path="/" element={<Navigate to="de/ICD/ICD10-GM-2022/icd_chapters/ICD10-GM-2022"/>}/>
                    <Route path="/" element={<Main/>}>
                        <Route path="/:language/:catalog/:resource_type/:code" element={<CodeBodyUnversionized/>}/>
                        <Route path="/:language/:catalog/:version/:resource_type/:code" element={<CodeBodyVersionized/>}/>
                    </Route>
                </Route>
            </Routes>
        </Router>
    </React.StrictMode>,
);

// TODO: Do we need this? Maybe for Matomo?
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
