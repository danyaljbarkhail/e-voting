// ManageElections.js

import React, { useState, useEffect } from 'react';
import { getElections, deleteElection } from '../services/electionService';
import { Button } from '@mui/material';

const ManageElections = () => {
  const [elections, setElections] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchElections();
  }, []);

  const fetchElections = async () => {
    try {
      const data = await getElections();
      setElections(data);
    } catch (error) {
      setError('Failed to fetch elections.');
    }
  };

  const handleDeleteElection = async (id) => {
    try {
      await deleteElection(id);
      setElections(elections.filter((election) => election._id !== id));
    } catch (error) {
      setError('Failed to delete election.');
    }
  };

  return (
    <div>
      <h2>Manage Elections</h2>
      {error && <p>{error}</p>}
      <ul>
        {elections.map((election) => (
          <li key={election._id}>
            {election.title}
            <Button variant="outlined" color="secondary" onClick={() => handleDeleteElection(election._id)}>Delete</Button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ManageElections;
