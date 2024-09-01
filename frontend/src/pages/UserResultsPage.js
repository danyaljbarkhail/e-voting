import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { getResults } from '../services/resultsService';
import { Input, Spin, Badge, Progress } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

const UserResultsPage = () => {
  const [results, setResults] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchResults();
  }, []);

  const fetchResults = async () => {
    try {
      const data = await getResults();
      setResults(data);
    } catch (err) {
      setError('Failed to fetch results.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredResults = results.filter(result =>
    result.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Container>
      <Title>Election Results</Title>
      <SearchContainer>
        <StyledInput
          placeholder="Search results..."
          onChange={handleSearchChange}
          prefix={<SearchOutlined />}
        />
      </SearchContainer>
      {loading ? (
        <LoadingIndicator>
          <Spin size="large" />
        </LoadingIndicator>
      ) : error ? (
        <ErrorText>{error}</ErrorText>
      ) : (
        <>
          {filteredResults.length > 0 ? (
            <Grid>
              {filteredResults.map((result) => (
                <ResultCard key={result._id}>
                  <Badge.Ribbon
                    text={result.status === 'completed' ? 'Completed' : 'Ongoing'}
                    color={result.status === 'completed' ? '#ff4d4f' : '#1890ff'}
                  >
                    <CardContent>
                      <h3>{result.title}</h3>
                      <WinnerText>
                        {result.status === 'completed' ? 'Winner:' : 'Winner so far:'}{' '}
                        {result.winner || 'No votes yet'}
                      </WinnerText>
                      <CandidatesContainer>
                        {result.candidates.map((candidate) => {
                          const percentage = result.totalVotes > 0 ? (candidate.votes / result.totalVotes) * 100 : 0;
                          return (
                            <Candidate key={candidate._id}>
                              <CandidateName>{`${candidate.name}: ${candidate.votes} votes`}</CandidateName>
                              <Progress percent={percentage} status="active" />
                            </Candidate>
                          );
                        })}
                      </CandidatesContainer>
                    </CardContent>
                  </Badge.Ribbon>
                </ResultCard>
              ))}
            </Grid>
          ) : (
            <ErrorText>No results available.</ErrorText>
          )}
        </>
      )}
    </Container>
  );
};

export default UserResultsPage;

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

const SearchContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 20px;
  gap: 10px;
`;

const StyledInput = styled(Input)`
  width: 300px;
  border-radius: 5px;
  padding: 10px;
  font-size: 1rem;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
`;

const ResultCard = styled.div`
  background-color: white;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 15px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
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
`;

const CardContent = styled.div`
  padding: 20px;
  text-align: center;
`;

const WinnerText = styled.p`
  font-size: 1rem;
  color: #555;
  margin: 10px 0;
`;

const CandidatesContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`;

const Candidate = styled.div`
  width: 100%;
  margin-bottom: 10px;
`;

const CandidateName = styled.p`
  margin: 5px 0;
  font-size: 1rem;
  color: #333;
  text-align: left;
`;

const LoadingIndicator = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 50vh;
`;

const ErrorText = styled.p`
  color: #ff4d4f;
  text-align: center;
  font-size: 1.2rem;
`;
