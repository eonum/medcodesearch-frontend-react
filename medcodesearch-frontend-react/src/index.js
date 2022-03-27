import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter as Router, Navigate, Redirect, Route, Routes, useParams} from "react-router-dom";
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import 'bootstrap/dist/css/bootstrap.min.css';
import Main from "./Components/Main/Main";

ReactDOM.render(
    <Router>
        <Routes>
            <Route path="/" element={<App />}>
                <Route exact path="/" element={<Navigate to="de/ICD/ICD10-GM-2022/icd_chapters/ICD10-GM-2022"/>}/>
                <Route path=":language/:category/:version/:catalog/:version" element={<Main/>}/>
                <Route path=":code/detail" element={"Detail works"}/>
            </Route>
        </Routes>
    </Router>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
