import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { getVoterElections, castVote } from '../services/electionService';
import { Button, Dropdown, Tooltip, Badge, Spin, Input, Menu, message } from 'antd';
import { ClockCircleOutlined } from '@ant-design/icons';

const VoterViewElections = () => {
  const [elections, setElections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [votedElections, setVotedElections] = useState([]);
  const [selectedCandidates, setSelectedCandidates] = useState({});

  useEffect(() => {
    fetchElections();
  }, []);

  const fetchElections = async () => {
    try {
      const data = await getVoterElections();
      setElections(data);
  
      const userVotedElections = data
        .filter(election => election.userHasVoted)
        .map(election => election._id);
      setVotedElections(userVotedElections);
    } catch (error) {
      console.error('Failed to fetch elections:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVote = async (electionId) => {
    const selectedCandidateId = selectedCandidates[electionId];
    if (!selectedCandidateId) {
      message.error('Please select a candidate before voting.');
      return;
    }
    try {
      await castVote(electionId, selectedCandidateId);
      message.success('You have successfully voted.');
      setVotedElections((prevVotedElections) => [...prevVotedElections, electionId]);
    } catch (error) {
      if (error.response && error.response.data.message === 'You have already voted in this election') {
        message.error('You have already voted in this election.');
        setVotedElections((prevVotedElections) => [...prevVotedElections, electionId]);
      } else {
        console.error('Error casting vote:', error);
        message.error('Failed to cast vote.');
      }
    }
  };

  const handleSelectCandidate = (electionId, candidateId) => {
    setSelectedCandidates({ ...selectedCandidates, [electionId]: candidateId });
  };

  const filteredElections = elections.filter((election) =>
    election.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Container>
      <Title>View Elections</Title>
      <Search
        placeholder="Search Elections"
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      {loading ? (
        <LoadingIndicator>
          <Spin size="large" />
        </LoadingIndicator>
      ) : (
        <Grid>
          {filteredElections.map((election) => (
            <ElectionCard key={election._id}>
              <Badge.Ribbon 
                text={election.status === 'completed' ? 'Completed' : 'Ongoing'} 
                color={election.status === 'completed' ? '#ff4d4f' : '#1890ff'}
              >
                <CardContent>
                  <h3>{election.title}</h3>
                  <p>{election.description}</p>
                  <Dropdown
                    overlay={
                      <Menu onClick={({ key }) => handleSelectCandidate(election._id, key)}>
                        {election.candidates.map((candidate) => (
                          <Menu.Item key={candidate._id}>{candidate.name}</Menu.Item>
                        ))}
                      </Menu>
                    }
                    trigger={['click']}
                  >
                    <SelectCandidateButton>Select Candidate</SelectCandidateButton>
                  </Dropdown>
                  {selectedCandidates[election._id] && (
                    <SelectedCandidate>
                      Selected Candidate: {election.candidates.find(c => c._id === selectedCandidates[election._id])?.name}
                    </SelectedCandidate>
                  )}
                  <TimerContainer>
                    <CountdownTimer>
                      <ClockCircleOutlined /> {election.timeLeft || 'Time Left'}
                    </CountdownTimer>
                  </TimerContainer>
                  {!votedElections.includes(election._id) ? (
                    <Tooltip title="Vote Now!">
                      <VoteButton onClick={() => handleVote(election._id)}>
                        Vote
                      </VoteButton>
                    </Tooltip>
                  ) : (
                    <VotedButton disabled>Voted</VotedButton>
                  )}
                </CardContent>
              </Badge.Ribbon>
            </ElectionCard>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default VoterViewElections;

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
  font-size: 2rem;
`;

const Search = styled(Input)`
  width: 100%;
  margin-bottom: 20px;
  padding: 10px;
  font-size: 1rem;
`;

const LoadingIndicator = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 50vh;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
`;

const ElectionCard = styled.div`
  background-color: white;
  border: 1px solid #ddd;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-5px);
  }

  h3 {
    margin: 0;
    font-size: 1.2rem;
    color: #333;
    text-align: center;
  }

  p {
    margin: 5px 0;
    font-size: 1rem;
    color: #555;
    text-align: center;
  }
`;

const CardContent = styled.div`
  padding: 20px;
  text-align: center;
`;

const TimerContainer = styled.div`
  margin-top: 10px;
  text-align: center;
`;

const CountdownTimer = styled.div`
  font-size: 16px;
  color: #999;
`;

const SelectCandidateButton = styled(Button)`
  margin-top: 10px;
  background-color: #1890ff;
  color: white;
  border: none;
  &:hover {
    background-color: #1070c4;
  }
`;

const SelectedCandidate = styled.p`
  margin: 10px 0;
  font-size: 1rem;
  color: #333;
`;

const VoteButton = styled(Button)`
  background-color: #28a745;
  color: white;
  border: none;
  &:hover {
    background-color: #218838;
  }
`;

const VotedButton = styled(Button)`
  background-color: gray;
  color: white;
  border: none;
  cursor: not-allowed;
`;

