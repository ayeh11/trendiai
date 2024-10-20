import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import NavBar from './components/NavBar';
import Footer from './components/Footer';
import TrendAnalysis from './components/TrendAnalysis';
import VideoCreation from './components/VideoCreation';
import Trending from './views/Trending';
import CreateTemplates from './views/CreateTemplates';
import Home from './views/Home';
import About from './views/About';
import Login from './views/Login';
import CreateAcc from './views/CreateAcc';
import './App.css';
import './style.css'

function App() {
  return (
    <Router>
      <div className="app-container">
        <NavBar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login />} />
          <Route path="/trending" element={<Trending />} />
          <Route path="/trend-analysis/:tiktokName" element={<TrendAnalysis />} />
          <Route path="/upload/:tiktokName" element={<VideoCreation />} />
          <Route path="/createtemplates" element={<CreateTemplates />} />
          <Route path="/createacc" element={<CreateAcc />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
