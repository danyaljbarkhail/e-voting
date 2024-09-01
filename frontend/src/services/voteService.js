// voteService.js

import API from './api'; // Import your API configuration

// Helper function to get the token from localStorage
const getToken = () => localStorage.getItem('token');

// Helper function to set the Authorization header
const setAuthHeader = () => {
  const token = getToken();
  console.log('Token:', token);  // Log the token to ensure it’s being fetched correctly
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

// Fetch all elections
export const getElections = async () => {
  try {
    const response = await API.get('/elections', setAuthHeader());
    return response.data;
  } catch (error) {
    console.error('Error fetching elections:', error);
    throw error; // Throwing the error to be caught by the calling function
  }
};

// Fetch candidates for a specific election
export const getCandidates = async (electionId) => {
  try {
    const response = await API.get(`/candidates?electionId=${electionId}`, setAuthHeader());
    return response.data;
  } catch (error) {
    console.error('Error fetching candidates:', error);
    throw error;
  }
};

// Cast a vote
export const castVote = async (electionId, candidateId) => {
  try {
    const response = await API.post('/votes', { electionId, candidateId }, setAuthHeader());
    return response.data;
  } catch (error) {
    console.error('Error casting vote:', error);
    throw error;
  }
};

// Removed the `getVoters` function since it does not have a corresponding backend route.
