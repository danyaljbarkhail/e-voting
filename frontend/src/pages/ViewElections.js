// src/pages/ViewElections.js

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { getElections, deleteElection } from '../services/electionService'; // Import deleteElection service
import { Button, Dropdown, Tooltip, Badge, Spin, Input, Menu } from 'antd';
import { ClockCircleOutlined, DeleteOutlined } from '@ant-design/icons'; // Import DeleteOutlined icon
import { useNavigate } from 'react-router-dom';

const ViewElections = ({ isAdmin }) => {
  const [elections, setElections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchElections();
    const intervalId = setInterval(() => {
      fetchElections();
    }, 1000); // Update the timer every second

    return () => clearInterval(intervalId); // Clear interval on component unmount
  }, []);

  const fetchElections = async () => {
    try {
      const data = await getElections();
      setElections(data);
    } catch (error) {
      console.error('Failed to fetch elections:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVote = (electionId) => {
    // Add voting logic here
    console.log('Vote for election:', electionId);
  };

  const handleResultsClick = (electionId) => {
    navigate(`/admin/results/${electionId}`);
  };

  const handleDeleteElection = async (electionId) => {
    try {
      await deleteElection(electionId);
      setElections(elections.filter((election) => election._id !== electionId)); // Update state after deletion
    } catch (error) {
      console.error('Failed to delete election:', error);
    }
  };

  const filteredElections = elections.filter((election) =>
    election.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const calculateRemainingTime = (endTime) => {
    const now = new Date();
    const timeDiff = new Date(endTime) - now;
    if (timeDiff <= 0) {
      return 'Election Ended';
    }
    const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);
    return `${days}d ${hours}h ${minutes}m ${seconds}s`;
  };

  // Sort elections: ongoing at top, then completed
  const sortedElections = [...filteredElections].sort((a, b) => {
    const isCompletedA = calculateRemainingTime(a.endTime) === 'Election Ended';
    const isCompletedB = calculateRemainingTime(b.endTime) === 'Election Ended';
    return isCompletedA - isCompletedB; // ongoing before completed
  });

  return (
    <Container>
      <Title>View Elections</Title>
      <Search
        placeholder="Search Elections"
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{ marginBottom: '20px' }}
      />
      {loading ? (
        <LoadingIndicator>
          <Spin size="large" />
        </LoadingIndicator>
      ) : (
        <Grid>
          {sortedElections.map((election) => {
            const remainingTime = calculateRemainingTime(election.endTime);
            const isCompleted = remainingTime === 'Election Ended';

            return (
              <ElectionCard key={election._id} status={isCompleted ? 'completed' : 'ongoing'}>
                <Badge.Ribbon text={isCompleted ? 'Completed' : 'Ongoing'} color={isCompleted ? '#ff4d4f' : '#1890ff'}>
                  <CardContent>
                    <h3>{election.title}</h3>
                    <p>{election.description}</p>
                    <Dropdown
                      overlay={
                        <Menu>
                          {election.candidates.map((candidate, index) => (
                            <Menu.Item key={index}>{`Candidate ${index + 1}: ${candidate.name}`}</Menu.Item>
                          ))}
                        </Menu>
                      }
                      trigger={['click']}
                    >
                      <Button>View Candidates</Button>
                    </Dropdown>
                    <TimerContainer>
                      {!isCompleted ? (
                        <CountdownTimer>
                          <ClockCircleOutlined /> {remainingTime}
                        </CountdownTimer>
                      ) : (
                        <ResultButton onClick={() => handleResultsClick(election._id)}>Results</ResultButton>
                      )}
                    </TimerContainer>
                    {!isAdmin && !isCompleted && (
                      <Tooltip title="Vote Now!">
                        <VoteButton onClick={() => handleVote(election._id)}>Vote</VoteButton>
                      </Tooltip>
                    )}
                    {isAdmin && (
                      <Tooltip title="Delete Election">
                        <DeleteButton onClick={() => handleDeleteElection(election._id)}>
                          <DeleteOutlined />
                        </DeleteButton>
                      </Tooltip>
                    )}
                  </CardContent>
                </Badge.Ribbon>
              </ElectionCard>
            );
          })}
        </Grid>
      )}
    </Container>
  );
};

export default ViewElections;

// Styled Components
const Container = styled.div`
  padding: 20px;
  background-color: #f4f6f9;
  min-height: 100vh;
`;

const Title = styled.h1`
  text-align: center;
  color: #1a202c;
  margin-bottom: 20px;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
`;

const ElectionCard = styled.div`
  background-color: ${(props) => (props.status === 'ongoing' ? '#fff' : '#f5f5f5')};
  border: 1px solid ${(props) => (props.status === 'ongoing' ? '#1890ff' : '#ff4d4f')};
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  text-align: center;
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-5px);
  }
`;

const CardContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const TimerContainer = styled.div`
  margin: 20px 0;
`;

const CountdownTimer = styled.div`
  font-size: 1.2em;
  color: #ff4d4f;
`;

const VoteButton = styled(Button)`
  background-color: #28a745;
  color: #fff;
  border: none;
  margin-top: 10px;
  transition: background-color 0.3s;

  &:hover {
    background-color: #218838;
  }
`;

const ResultButton = styled(Button)`
  background-color: #007bff;
  color: #fff;
  border: none;
  margin-top: 10px;
  transition: background-color 0.3s;

  &:hover {
    background-color: #0056b3;
  }
`;

const DeleteButton = styled(Button)`
  background-color: #ff4d4f;
  color: #fff;
  border: none;
  margin-top: 10px;
  transition: background-color 0.3s;

  &:hover {
    background-color: #c82333;
  }
`;

const LoadingIndicator = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 50vh;
`;

const DropdownContent = styled.div`
  padding: 10px;
  background-color: #fff;
  border-radius: 5px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
`;

const Search = styled(Input)`
  width: 300px;
  margin: 0 auto;
  display: block;
`;
