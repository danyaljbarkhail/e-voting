import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { getResults } from '../services/resultsService';
import { Input, Spin, Button, Tooltip, Badge, Progress } from 'antd';
import { SearchOutlined, DownloadOutlined } from '@ant-design/icons';
import { saveAs } from 'file-saver';

const AdminResultsPage = () => {
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

  const handleExport = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + results.map(result => 
          `${result.title},${result.winner || 'No votes yet'},` 
          + result.candidates.map(c => `${c.name}: ${c.votes}`).join('; ')
        ).join('\n');

    const encodedUri = encodeURI(csvContent);
    saveAs(encodedUri, 'results.csv');
  };

  return (
    <Container>
      <Title>Admin Results Page</Title>
      <SearchContainer>
        <StyledInput
          placeholder="Search results..."
          onChange={handleSearchChange}
          prefix={<SearchOutlined />}
        />
        <Tooltip title="Export Results">
          <ExportButton icon={<DownloadOutlined />} onClick={handleExport}>
            Export
          </ExportButton>
        </Tooltip>
      </SearchContainer>

      {loading ? (
        <LoadingIndicator>
          <Spin size="large" />
        </LoadingIndicator>
      ) : error ? (
        <ErrorText>{error}</ErrorText>
      ) : filteredResults.length > 0 ? (
        <Grid>
          {filteredResults.map((result) => (
            <ResultCard key={result._id}>
              <Badge.Ribbon text={result.status === 'completed' ? 'Completed' : 'Ongoing'} color={result.status === 'completed' ? '#ff4d4f' : '#1890ff'}>
                <CardContent>
                  <h3>{result.title}</h3>
                  <p>
                    {result.status === 'completed' ? 'Winner:' : 'Winner so far:'} {result.winner || 'No votes yet'}
                  </p>
                  {result.candidates.map((candidate) => {
                    const percentage = result.totalVotes > 0 ? (candidate.votes / result.totalVotes) * 100 : 0;
                    return (
                      <div key={candidate._id} style={{ width: '100%', marginBottom: '10px' }}>
                        <p>{`${candidate.name}: ${candidate.votes} votes`}</p>
                        <Progress percent={percentage} status="active" />
                      </div>
                    );
                  })}
                </CardContent>
              </Badge.Ribbon>
            </ResultCard>
          ))}
        </Grid>
      ) : (
        <ErrorText>No results available.</ErrorText>
      )}
    </Container>
  );
};

export default AdminResultsPage;

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

const ExportButton = styled(Button)`
  background-color: #1890ff;
  color: white;
  border: none;
  border-radius: 5px;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #1070c4;
  }
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
  }

  p {
    margin: 5px 0;
    font-size: 1rem;
    color: #555;
  }
`;

const CardContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
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
