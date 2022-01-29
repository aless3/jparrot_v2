import React, { Component } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Maps from "./components/MapsFrontEnd";
import Keyword from "./components/KeywordFrontEnd";
import Streaming from "./components/Streaming";
import Competition from "./components/CompetitionFrontEnd";

import "./navlink.css";

class App extends Component {
  render() {
    return (
      <Router>
        <div>
          <nav className='navbar navbar-expand-lg navbar-light bg-light w-30 p-2 mx-auto'>
            <ul className='navbar-nav mx-auto '>
              <li>
                <Link to={"/"} className='nav-link'>
                  {" "}
                  Home{" "}
                </Link>
              </li>
              <li>
                <Link to={"/map"} className='nav-link'>
                  Maps
                </Link>
              </li>
              <li>
                <Link to={"/stream"} className='nav-link'>
                  Stream
                </Link>
              </li>
              <li>
                <Link to={"/competition"} className='nav-link'>
                  Competition
                </Link>
              </li>
            </ul>
          </nav>

          <Routes>
            <Route path='/' element={<Keyword />} />
            <Route path='/map' element={<Maps />} />
            <Route path='/stream' element={<Streaming />} />
            <Route path='/competition' element={<Competition />} />
          </Routes>
        </div>
      </Router>
    );
  }
}

export default App;
