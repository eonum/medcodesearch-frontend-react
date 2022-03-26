import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter as Router, Navigate, Route, Routes, useParams} from "react-router-dom";
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import 'bootstrap/dist/css/bootstrap.min.css';
import Main from "./Components/Main/Main";

ReactDOM.render(
    <Router>
        <Routes>
            <Route exact path="/" element={<App />}>
                <Route path=":language/:category/:version/:catalog/:version" element={<Main/>}/>
            </Route>
        </Routes>
    </Router>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
