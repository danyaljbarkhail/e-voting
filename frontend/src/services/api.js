import axios from 'axios';

const API = axios.create({
  baseURL: 'https://e-voting-backend.onrender.com/api', // Ensure this matches your backend base URL
  headers: {
    'Content-Type': 'application/json',
  },
});

export default API;
