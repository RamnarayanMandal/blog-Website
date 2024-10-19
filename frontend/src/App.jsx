import React from 'react';
import './App.css';

import { BlockHomePage } from './component/BlockHomePage';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { BlogDetails } from './component/Blog/BlogDetails';
import { Navbar } from './component/Navbar';

function App() {
  return (
    <Router>
      <Navbar/>
      <Routes>
        <Route path="/" element={<BlockHomePage />} />
        <Route path="/blog-details" element={<BlogDetails />} />
      </Routes>
    </Router>
  );
}

export default App;
