import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter as Router, Navigate, Route, Routes} from "react-router-dom";
import './index.css';
import App from './App';
import 'bootstrap/dist/css/bootstrap.min.css';
import Main from "./Components/Main/Main";
import CodeBodyVersionized from "./Components/Bodies/CodeBodyVersionized";
import CodeBodyUnversionized from "./Components/Bodies/CodeBodyUnversionized";

/**
 * Renders the whole application
 */
ReactDOM.render(
    // StrictMode renders components twice (on dev but not production), detecting problems / deprecations / warnings.
    <React.StrictMode>
        <Router>
            <Routes>
                <Route path="/" element={<App />}>
                    <Route path="/" element={<Navigate to="de/ICD/ICD10-GM-2022/icd_chapters/ICD10-GM-2022"/>}/>
                    <Route path="/" element={<Main/>}>
                        <Route path="/:language/:catalog/:resource_type/:code" element={<CodeBodyUnversionized/>}/>
                        <Route path="/:language/:catalog/:version/:resource_type/:code" element={<CodeBodyVersionized/>}/>
                    </Route>
                </Route>
            </Routes>
        </Router>
    </React.StrictMode>,
  document.getElementById('root')
);
