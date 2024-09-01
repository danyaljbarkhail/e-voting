// src/pages/AddElection.js

import React, { useState } from 'react';
import styled from 'styled-components';
import { createElection } from '../services/electionService';
import { Button, Input, Alert, Spin, Card } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';

const AddElection = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [endTime, setEndTime] = useState(dayjs());
  const [candidates, setCandidates] = useState(['']);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleAddCandidate = () => {
    setCandidates([...candidates, '']);
  };

  const handleCandidateChange = (index, value) => {
    const updatedCandidates = [...candidates];
    updatedCandidates[index] = value;
    setCandidates(updatedCandidates);
  };

  const handleRemoveCandidate = (index) => {
    const updatedCandidates = candidates.filter((_, i) => i !== index);
    setCandidates(updatedCandidates);
  };

  const handleCreateElection = async (e) => {
    e.preventDefault();
    if (!title || !description || !endTime || candidates.some((candidate) => !candidate)) {
      setError('Please fill in all fields.');
      return;
    }

    if (dayjs(endTime).isBefore(dayjs())) {
      setError('End time must be in the future.');
      return;
    }

    setLoading(true);
    try {
      await createElection({ title, description, endTime, candidates });
      setTitle('');
      setDescription('');
      setEndTime(dayjs());
      setCandidates(['']);
      setError(null);
      setSuccess(true);
    } catch (error) {
      setError('Failed to create election.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <StyledCard>
        <Title>Add New Election</Title>
        {error && <StyledAlert message={error} type="error" showIcon closable onClose={() => setError(null)} />}
        {success && <StyledAlert message="Election created successfully!" type="success" showIcon closable />}
        <StyledForm onSubmit={handleCreateElection}>
          <StyledInput
            placeholder="Election Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <StyledInput
            placeholder="Election Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <StyledDateTimePicker
              label="End Time"
              value={endTime}
              onChange={(newValue) => setEndTime(newValue)}
              renderInput={(params) => <Input {...params} />}
            />
          </LocalizationProvider>
          {candidates.map((candidate, index) => (
            <CandidateContainer key={index}>
              <StyledInput
                placeholder={`Candidate ${index + 1}`}
                value={candidate}
                onChange={(e) => handleCandidateChange(index, e.target.value)}
                style={{ marginBottom: '10px' }}
              />
              {index > 0 && (
                <RemoveButton onClick={() => handleRemoveCandidate(index)} type="danger">
                  Remove
                </RemoveButton>
              )}
            </CandidateContainer>
          ))}
          <AddCandidateButton onClick={handleAddCandidate} icon={<PlusOutlined />} type="dashed">
            Add Candidate
          </AddCandidateButton>
          <SubmitButton type="primary" htmlType="submit" loading={loading}>
            {loading ? <Spin /> : 'Create Election'}
          </SubmitButton>
        </StyledForm>
      </StyledCard>
    </Container>
  );
};

export default AddElection;

// Styled Components
const Container = styled.div`
  padding: 0px;
  background-color: #f4f6f9;
  min-height: 0vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const StyledCard = styled(Card)`
  width: 100%;
  max-width: 600px;
  padding: 0px;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h1`
  text-align: center;
  color: #1a202c;
  margin-bottom: 20px;
`;

const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const StyledInput = styled(Input)`
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #d9d9d9;
  font-size: 16px;
`;

const StyledDateTimePicker = styled(DateTimePicker)`
  width: 100%;
  margin-bottom: 20px;
`;

const CandidateContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const AddCandidateButton = styled(Button)`
  margin-top: 10px;
  background-color: #007bff;
  color: white;
  &:hover {
    background-color: #0056b3;
  }
`;

const RemoveButton = styled(Button)`
  color: red;
  border-color: red;
  &:hover {
    color: #ff4d4f;
    border-color: #ff4d4f;
  }
`;

const SubmitButton = styled(Button)`
  margin-top: 20px;
  width: 100%;
  background-color: #28a745;
  color: white;
  &:hover {
    background-color: #218838;
  }
`;

const StyledAlert = styled(Alert)`
  margin-bottom: 20px;
`;

