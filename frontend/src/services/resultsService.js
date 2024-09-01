import axios from 'axios';

// Function to get election results
export const getResults = async () => {
  try {
    // Retrieve the token from localStorage
    const token = localStorage.getItem('token');

    if (!token) {
      throw new Error('No token found. Please log in again.');
    }

    // Set up the configuration for the request
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    // Make the API request to the correct endpoint
    const response = await axios.get('https://e-voting-backend.onrender.com/api/votes/results', config);

    return response.data;
  } catch (error) {
    if (error.response) {
      // Server responded with a status other than 2xx
      console.error('Failed to fetch results:', error.response.status, error.response.data.message);
    } else if (error.request) {
      // Request was made but no response received
      console.error('No response received from server:', error.request);
    } else {
      // Something else happened
      console.error('Error during fetching results:', error.message);
    }
    throw error;
  }
};
