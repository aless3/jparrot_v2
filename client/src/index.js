import React from "react";
import ReactDOM from "react-dom";
import Terms from "./components/TermsFrontEnd";
import Maps from "./components/MapsFrontEnd";
import Keyword from "./components/KeywordFrontEnd";
import Streaming from './components/Streaming';

import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

import "core-js/stable";
import "regenerator-runtime/runtime";

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <div>
        <p>
          <Link to='/'>Keyword</Link>
        </p>

        <p>
          <Link to='/map'>Map</Link>
        </p>

        <p>
          <Link to='/terms'>Terms</Link>
        </p>

        <p>
          <Link to='/stream'>Stream</Link>
        </p>
      </div>
      <Routes>
        <Route path='/' element={<Keyword/>}/>
        <Route path='/map' element={<Maps/>}/>
        <Route path='/terms' element={<Terms/>}/>
        <Route path='/stream' element={<Streaming/>}/>
        <Route path='/streaming' element={<Streaming />} />
      </Routes>
    </Router>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
//reportWebVitals();
