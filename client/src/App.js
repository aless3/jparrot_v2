import React, { Component } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Terms from "./components/TermsFrontEnd";
import Maps from "./components/MapsFrontEnd";
import Keyword from "./components/KeywordFrontEnd";
import Streaming from './components/Streaming';
import "./navlink.css";


class App extends Component {
  render() {
    return (
    <Router>
        <div>
          <nav className="navbar navbar-expand-lg navbar-light bg-light w-30 p-2 mx-auto">
          <ul className="navbar-nav mx-auto ">
            <li><Link to={'/'} className="nav-link"> Home </Link></li>
            <li><Link to={'/map'} className="nav-link">Mappe</Link></li>
            <li><Link to={'/terms'} className="nav-link">Terms</Link></li>
            <li><Link to={'/stream'} className="nav-link">Stream</Link></li>
          </ul>
          </nav>
         
          <Routes>
            <Route path='/' element={<Keyword/>}/>
            <Route path='/map' element={<Maps/>}/>
            <Route path='/terms' element={<Terms/>}/>
            <Route path='/stream' element={<Streaming/>}/>
            <Route path='/streaming' element={<Streaming />} />
          </Routes>
        </div>
      </Router>  
    );
  }
}

export default App;
