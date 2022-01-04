import React from "react";
import ReactDOM from "react-dom";
import Terms from "./Terms_frontEnd";
import Maps from "./maps_frontEnd";
import Sentiment from "./Sentiment_frontEnd";

import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";


ReactDOM.render(
  <React.StrictMode>
    <Router>
      <div>
        <p>
          <Link to='/map'>Maps</Link>
        </p>
        <p>
          <Link to='/sentiment'>Sent</Link>
        </p>
        <p>
          <Link to='/terms'>Terms</Link>
        </p>
        <p>
          <Link to='/stream'>Stream</Link>
        </p>
      </div>
      <Routes>
        {/*<Route path='/' element={<App/>}/>*/}
        <Route path='/map' element={<Maps/>}/>
        <Route path='/sentiment' element={<Sentiment/>}/>
        <Route path='/terms' element={<Terms/>}/>
        {/*<Route path='/stream' element={<Streaming/>}/>*/}
      </Routes>
    </Router>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
//reportWebVitals();
