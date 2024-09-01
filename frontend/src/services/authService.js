import API from './api';

// Helper function to get the token from localStorage
const getToken = () => localStorage.getItem('token');

// Helper function to set the Authorization header
export const setAuthHeader = () => {
  const token = getToken();
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

// Function to check if the user is an admin
export const isAdmin = () => {
  const role = localStorage.getItem('role');
  return role === 'admin';
};

// Register user
export const register = async (name, email, password) => {
  const response = await API.post('/auth/register', { name, email, password });
  return response.data;
};

// Login user
export const login = async (email, password) => {
  const response = await API.post('/auth/login', { email, password });
  return response.data;
};
