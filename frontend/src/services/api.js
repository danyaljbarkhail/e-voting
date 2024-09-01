import axios from 'axios';

// Create an Axios instance with a base URL and default headers
const API = axios.create({
  baseURL: 'https://e-voting-backend.onrender.com/api', // Ensure this matches your backend base URL
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to automatically set the Authorization header
API.interceptors.request.use(
  (config) => {
    // Retrieve the token from localStorage
    const token = localStorage.getItem('token');
    if (token) {
      // If token exists, add it to the Authorization header
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config; // Return the modified config
  },
  (error) => {
    // Handle request error here
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle errors globally
API.interceptors.response.use(
  (response) => response, // If the response is successful, return the response
  (error) => {
    // Handle errors globally
    if (error.response) {
      // Server responded with a status other than 2xx
      console.error('API error response:', error.response.data);
    } else if (error.request) {
      // The request was made but no response was received
      console.error('API error request:', error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('API error message:', error.message);
    }
    return Promise.reject(error); // Re-throw the error for further handling
  }
);

export default API;
