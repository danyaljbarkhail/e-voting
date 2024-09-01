// services/electionService.js

import API from './api';

// Get the token from localStorage
const getToken = () => localStorage.getItem('token');

// Set the Authorization header for all requests
const setAuthHeader = () => {
  const token = getToken();
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

// Fetch elections for voters
export const getVoterElections = async () => {
  try {
    const response = await API.get('/elections/voter/elections', setAuthHeader());
    return response.data;
  } catch (error) {
    console.error('Error fetching elections from API:', error.response ? error.response.data : error.message);
    throw error;
  }
};

// Create a new election
export const createElection = async (electionData) => {
  try {
    const response = await API.post('/elections', electionData, setAuthHeader());
    return response.data;
  } catch (error) {
    console.error('Error creating election:', error);
    throw error; // Re-throw the error to handle it in the component
  }
};

// Fetch all elections
export const getElections = async () => {
  try {
    const response = await API.get('/elections', setAuthHeader());
    return response.data;
  } catch (error) {
    console.error('Error fetching elections from API:', error.response ? error.response.data : error.message);
    throw error;
  }
};

// Update an election
export const updateElection = async (id, electionData) => {
  const response = await API.put(`/elections/${id}`, electionData, setAuthHeader());
  return response.data;
};

// Delete an election
export const deleteElection = async (id) => {
  const response = await API.delete(`/elections/${id}`, setAuthHeader());
  return response.data;
};

// Cast a vote
export const castVote = async (electionId, candidateId) => {
  try {
    const response = await API.post(
      `/elections/${electionId}/vote`,
      { candidateId },
      setAuthHeader()
    );
    return response.data;
  } catch (error) {
    console.error('Error casting vote:', error.response ? error.response.data : error.message);
    throw error;
  }
};
