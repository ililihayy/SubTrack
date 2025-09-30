import React from 'react';
import { Routes, Route, NavLink } from 'react-router-dom';
import RandomPage from './pages/RandomPage';
import DataPage from './pages/DataPage';

const App = () => {
  return (
    <div className="container">
      <nav className="navbar">
        <NavLink to="/" end className={({ isActive }) => `navlink ${isActive ? 'active' : ''}`}>Random</NavLink>
        <NavLink to="/data" className={({ isActive }) => `navlink ${isActive ? 'active' : ''}`}>Data</NavLink>
      </nav>
      <div className="panel">
        <Routes>
          <Route path="/" element={<RandomPage />} />
          <Route path="/data" element={<DataPage />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;


