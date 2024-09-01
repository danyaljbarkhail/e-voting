import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { getVoterElections } from '../services/electionService'; // Use the correct function
import { useNavigate } from 'react-router-dom';

const UserDashboard = () => {
  const [elections, setElections] = useState([]);
  const [error, setError] = useState(null);
  const [userName, setUserName] = useState('User'); // State to hold the user's name
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = () => {
      // Fetch the user's name from local storage or any other storage you're using
      const name = localStorage.getItem('userName'); // Assumes userName is stored in localStorage
      if (name) {
        setUserName(name);
      }
    };

    const fetchData = async () => {
      try {
        const data = await getVoterElections(); // Call the correct function
        setElections(data);
      } catch (err) {
        console.error('Error fetching voter elections:', err); // Log the actual error
        setError('Failed to fetch dashboard data.');
      }
    };

    fetchUserData(); // Call the function to fetch user data
    fetchData();
  }, []);

  // Function to determine the status of an election
  const getStatus = (endTime) => {
    const currentTime = new Date();
    const end = new Date(endTime);
    return currentTime < end ? 'In Progress' : 'Completed';
  };

  // Function to get color based on status
  const getStatusColor = (status) => {
    return status === 'In Progress' ? '#36a2eb' : '#ff6384';
  };

  return (
    <DashboardWrapper>
      <Header>
        <h1>Welcome, {userName}</h1> {/* Display the user's name */}
      </Header>

      {error ? <Error>{error}</Error> : (
        <>
          <StatsContainer>
            <StatCard style={{ border: '2px solid #ff6384', boxShadow: '0 3px 10px rgba(255, 99, 132, 0.1)' }}>
              <StatTitle>Completed Elections</StatTitle>
              <StatValue style={{ color: '#ff6384' }}>
                {elections.filter((election) => getStatus(election.endTime) === 'Completed').length}
              </StatValue>
            </StatCard>
            <StatCard style={{ border: '2px solid #36a2eb', boxShadow: '0 3px 10px rgba(54, 162, 235, 0.1)' }}>
              <StatTitle>Active Elections</StatTitle>
              <StatValue style={{ color: '#36a2eb' }}>
                {elections.filter((election) => getStatus(election.endTime) === 'In Progress').length}
              </StatValue>
            </StatCard>
          </StatsContainer>

          <SectionTitle>Active Elections</SectionTitle>
          <ActiveElectionsTable>
            <thead>
              <tr>
                <th>Election Name</th>
                <th>Description</th>
                <th>Candidates</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {elections.map((election) => {
                const status = getStatus(election.endTime);
                return (
                  <tr key={election._id}>
                    <td>{election.title}</td>
                    <td>{election.description}</td>
                    <td>{election.candidates.map((c) => c.name).join(', ')}</td>
                    <td style={{ color: getStatusColor(status) }}>{status}</td>
                  </tr>
                );
              })}
            </tbody>
          </ActiveElectionsTable>
        </>
      )}
    </DashboardWrapper>
  );
};

export default UserDashboard;

// Styled Components

const DashboardWrapper = styled.div`
  padding: 0px;
  background-color: #f0f2f5;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-sizing: border-box;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  max-width: 1000px;
  margin-bottom: 15px;
  h1 {
    font-size: 1.8rem;
    color: #333;
    font-weight: bold;
  }
`;

const StatsContainer = styled.div`
  display: flex;
  gap: 15px;
  width: 100%;
  max-width: 1000px;
  margin-bottom: 15px;
`;

const StatCard = styled.div`
  background-color: white;
  flex: 1;
  padding: 12px;
  border-radius: 8px;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.05);
  text-align: center;
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-4px);
  }
`;

const StatTitle = styled.h3`
  margin: 0;
  font-size: 0.9rem;
  color: #666;
  font-weight: 600;
`;

const StatValue = styled.p`
  margin: 10px 0;
  font-size: 1.8rem;
  font-weight: bold;
`;

const SectionTitle = styled.h2`
  font-size: 1.3rem;
  color: #333;
  margin-bottom: 10px;
  width: 100%;
  max-width: 1000px;
  font-weight: 700;
  text-align: left;
`;

const ActiveElectionsTable = styled.table`
  width: 100%;
  max-width: 1000px;
  background-color: white;
  border-collapse: collapse;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.05);
  margin-bottom: 15px;

  th, td {
    padding: 10px;
    text-align: left;
    border-bottom: 1px solid #f0f0f0;
  }

  th {
    background-color: #007bff;
    color: white;
    text-transform: uppercase;
    font-weight: bold;
    font-size: 0.9rem;
  }

  td {
    color: #333;
    font-size: 0.85rem;
  }

  tr:hover {
    background-color: #f1f5f9;
  }
`;

const Error = styled.p`
  color: red;
  font-size: 1rem;
  margin: 20px 0;
`;
