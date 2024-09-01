import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children, role }) => {
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('role');

  console.log('Token:', token); // Debug log
  console.log('User Role:', userRole); // Debug log
  console.log('Expected Role:', role); // Debug log

  // If there's no token, redirect to login page
  if (!token) {
    console.log('No token found, redirecting to login.');
    return <Navigate to="/login" />;
  }

  // If the role is specified and doesn't match the user's role, redirect to home or unauthorized page
  if (role && role !== userRole) {
    console.log(`Role mismatch: User role is ${userRole}, but expected role is ${role}. Redirecting to home.`);
    return <Navigate to="/" />;
  }

  // If token is valid and roles match (if specified), render the children components
  return children;
};

export default PrivateRoute;
