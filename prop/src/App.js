import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import './style.css';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Anime from './pages/Anime';
import Drama from './pages/Drama';
import Favorites from './pages/Favorites';
import Login from './pages/Login';
import AdminPanel from './pages/AdminPanel';
import VideoModal from './components/VideoModal';

function AppContent() {
  const navigate = useNavigate();

  useEffect(() => {
    const userRole = localStorage.getItem('userRole');
    if (!userRole && window.location.pathname !== '/login') {
      navigate('/login');
    }
  }, [navigate]);

  return (
    <div className="App">
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="/" element={<Home />} />
        <Route path="/anime" element={<Anime />} />
        <Route path="/drama" element={<Drama />} />
        <Route path="/favorites" element={<Favorites />} />
      </Routes>
      <VideoModal />
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;