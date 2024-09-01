import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { getElections, deleteElection } from '../services/electionService';
import { Button, Dropdown, Tooltip, Badge, Spin, Input, Menu, message } from 'antd';
import { ClockCircleOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const AdminViewElections = () => {
  const [elections, setElections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchElections();
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

  const handleDeleteElection = async (electionId) => {
    try {
      await deleteElection(electionId);
      setElections(elections.filter((election) => election._id !== electionId));
      message.success('Election deleted successfully.');
    } catch (error) {
      console.error('Failed to delete election:', error);
      message.error('Failed to delete election.');
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

  const sortedElections = [...filteredElections].sort((a, b) => {
    const isCompletedA = calculateRemainingTime(a.endTime) === 'Election Ended';
    const isCompletedB = calculateRemainingTime(b.endTime) === 'Election Ended';
    return isCompletedA - isCompletedB;
  });

  return (
    <Container>
      <Title>Manage Elections</Title>
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
              <StyledCard key={election._id}>
                <Badge.Ribbon text={isCompleted ? 'Completed' : 'Ongoing'} color={isCompleted ? '#ff4d4f' : '#1890ff'}>
                  <CardBody>
                    <CardHeader>
                      <ElectionTitle>{election.title}</ElectionTitle>
                    </CardHeader>
                    <CardDescription>{election.description}</CardDescription>
                    <TimerContainer>
                      {!isCompleted && (
                        <CountdownTimer>
                          <ClockCircleOutlined /> {remainingTime}
                        </CountdownTimer>
                      )}
                    </TimerContainer>
                    <ActionButtons>
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
                        <ViewCandidatesButton>
                          <EyeOutlined /> View Candidates
                        </ViewCandidatesButton>
                      </Dropdown>
                      <Tooltip title="Delete Election">
                        <DeleteButton onClick={() => handleDeleteElection(election._id)}>
                          <DeleteOutlined /> Delete
                        </DeleteButton>
                      </Tooltip>
                    </ActionButtons>
                  </CardBody>
                </Badge.Ribbon>
              </StyledCard>
            );
          })}
        </Grid>
      )}
    </Container>
  );
};

export default AdminViewElections;

// Styled Components

const Container = styled.div`
  padding: 20px;
  background-color: #f4f4f4;
  min-height: 100vh;
`;

const Title = styled.h1`
  text-align: center;
  margin-bottom: 20px;
  color: #333;
`;

const Search = styled(Input.Search)`
  margin-bottom: 20px;
  width: 100%;
  max-width: 400px;
  margin: 0 auto 20px;
  display: block;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
`;

const StyledCard = styled.div`
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-5px);
  }
`;

const CardBody = styled.div`
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
`;

const CardHeader = styled.div`
  margin-bottom: 10px;
`;

const ElectionTitle = styled.h3`
  margin: 0;
  font-size: 1.5rem;
  color: #333;
  text-align: center;
`;

const CardDescription = styled.p`
  color: #666;
  margin-bottom: 20px;
  text-align: justify;
`;

const TimerContainer = styled.div`
  margin-top: 10px;
  text-align: center;
`;

const CountdownTimer = styled.div`
  font-size: 16px;
  color: #555;
`;

const ViewCandidatesButton = styled(Button)`
  background-color: #1890ff;
  color: white;
  border: none;
  width: 100%;
  margin-top: 10px;
  &:hover {
    background-color: #1070c4;
  }
`;

const DeleteButton = styled(Button)`
  background-color: #ff4d4f;
  color: #fff;
  border: none;
  width: 100%;
  margin-top: 10px;
  &:hover {
    background-color: #d4363a;
  }
`;

const ActionButtons = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 20px;
  gap: 10px;
`;

const LoadingIndicator = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100px;
`;
