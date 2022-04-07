import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter as Router, Navigate, Redirect, Route, Routes, useParams} from "react-router-dom";
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import 'bootstrap/dist/css/bootstrap.min.css';
import Main from "./Components/Main/Main";
import ICD from "./Components/ICD/ICD";
import DRG from "./Components/ICD/DRG";
import CHOP from "./Components/ICD/CHOP";
import TARMED from "./Components/ICD/TARMED";
import { ButtonGroup } from 'react-bootstrap';
import Body from "./Components/ICD/Body";

ReactDOM.render(
    <Router>
        <Routes>
            <Route path="/" element={<App />}>
                <Route exact path="/" element={<Navigate to="de/ICD/ICD10-GM-2022/icd_chapters/ICD10-GM-2022"/>}/>
                <Route path="/" element={<Main/>}>
                    <Route path="/:language/:category/:version/:catalog/:code" element={<Body/>}/>
                    <Route path="/:language/:category/:version/:catalog/:code" element={<ButtonGroup/>}/>
                </Route>
            </Route>
        </Routes>
    </Router>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
