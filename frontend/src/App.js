// src/App.js

import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AdminPage from './pages/AdminPage';
import UserPage from './pages/UserPage';
import AdminResultsPage from './pages/AdminResultsPage';
import UserResultsPage from './pages/UserResultsPage';
import UserDashboard from './pages/UserDashboard';
import AdminDashboard from './pages/AdminDashboard'; 
import PrivateRoute from './PrivateRoute';
import AdminViewElections from './pages/AdminViewElections';
import VoterViewElections from './pages/VoterViewElections';
import AddElection from './pages/AddElection';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Admin Routes */}
        <Route path="/admin/*" element={<PrivateRoute role="admin"><AdminPage /></PrivateRoute>}>
          <Route path="admin-dashboard" element={<AdminDashboard />} />
          <Route path="admin-elections" element={<AdminViewElections />} />
          <Route path="add-election" element={<AddElection />} />
          <Route path="admin-results" element={<AdminResultsPage />} /> {/* Updated Path */}
        </Route>

        {/* User Routes */}
        <Route path="/user/*" element={<PrivateRoute role="voter"><UserPage /></PrivateRoute>}>
          <Route path="user-dashboard" element={<UserDashboard />} />
          <Route path="user-elections" element={<VoterViewElections />} />
          <Route path="user-results" element={<UserResultsPage />} /> {/* Updated Path */}
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
