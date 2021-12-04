import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import Maps from "./maps_frontEnd";
import Tweet from "./Tweet.js";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Links from "./link";

//import reportWebVitals from "./reportWebVitals";

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <div>
        <p>
          <Link to='/'>term cloud</Link>
        </p>
        <p>
          <Link to='/map'>Mapps</Link>
        </p>
      </div>
      <Routes>
        <Route path='/' element={<App />}></Route>
        <Route path='/map' element={<Maps />}></Route>
      </Routes>
    </Router>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
//reportWebVitals();
