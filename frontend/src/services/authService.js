import API from './api'; // Import the configured Axios instance

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

// Register user with improved error handling
export const register = async (name, email, password) => {
  try {
    const response = await API.post('/auth/register', { name, email, password });
    return response.data;
  } catch (error) {
    console.error('Registration error:', error.response ? error.response.data : error.message);
    throw error; // Re-throw the error for further handling in the calling code
  }
};

// Login user with improved error handling
export const login = async (email, password) => {
  try {
    const response = await API.post('/auth/login', { email, password });
    return response.data;
  } catch (error) {
    console.error('Login error:', error.response ? error.response.data : error.message);
    throw error; // Re-throw the error for further handling in the calling code
  }
};
