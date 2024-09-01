import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { getElections, getCandidates, castVote } from '../services/voteService';
import { useNavigate, Link } from 'react-router-dom'; // Import Link from react-router-dom
import FavoriteIcon from '@mui/icons-material/Favorite';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import GitHubIcon from '@mui/icons-material/GitHub';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';

const VotePage = () => {
  const [elections, setElections] = useState([]);
  const [selectedElection, setSelectedElection] = useState('');
  const [candidates, setCandidates] = useState([]);
  const [selectedCandidate, setSelectedCandidate] = useState('');
  const [message, setMessage] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchElections();
  }, []);

  useEffect(() => {
    if (selectedElection) {
      fetchCandidates(selectedElection);
    }
  }, [selectedElection]);

  const fetchElections = async () => {
    try {
      const data = await getElections();
      setElections(data);
    } catch (error) {
      setMessage('Failed to load elections');
    }
  };

  const fetchCandidates = async (electionId) => {
    try {
      const data = await getCandidates(electionId);
      setCandidates(data);
    } catch (error) {
      setMessage('Failed to load candidates');
    }
  };

  const handleVote = async (e) => {
    e.preventDefault();
    try {
      await castVote(selectedElection, selectedCandidate);
      setMessage('Vote cast successfully!');
    } catch (error) {
      setMessage('Failed to cast vote.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/login');
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <PageContainer>
      <Navbar>
        <LogoContainer>
          <img src="/logo.png" alt="Your Logo" />
        </LogoContainer>
        <MenuIconWrapper onClick={toggleMobileMenu}>
          {isMobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
        </MenuIconWrapper>
        <NavLinks isMobileMenuOpen={isMobileMenuOpen}>
          <NavLink to="/">Home</NavLink>
          <NavLink to="/about">About Us</NavLink>
          <NavLink to="/contact">Contact</NavLink>
          <LogoutButton onClick={handleLogout}>Logout</LogoutButton>
        </NavLinks>
      </Navbar>
      <Content>
        <SidebarButton onClick={toggleSidebar}>
          <MenuIcon style={{ color: '#ffffff' }} />
        </SidebarButton>
        <Sidebar isSidebarOpen={isSidebarOpen}>
          <SidebarItem to="/vote">Voting</SidebarItem>
          <SidebarItem to="/results">Results</SidebarItem>
        </Sidebar>
        <MainContent isSidebarOpen={isSidebarOpen}>
          <h1>Vote in Elections</h1>
          {message && <Message>{message}</Message>}
          <ElectionContainer>
            {elections.map((election) => (
              <ElectionBox
                key={election._id}
                onClick={() => setSelectedElection(election._id)}
                selected={selectedElection === election._id}
              >
                {election.title}
              </ElectionBox>
            ))}
          </ElectionContainer>
          {selectedElection && (
            <>
              <h2>Candidates</h2>
              <CandidateContainer>
                {candidates.map((candidate) => (
                  <CandidateBox
                    key={candidate._id}
                    onClick={() => setSelectedCandidate(candidate._id)}
                    selected={selectedCandidate === candidate._id}
                  >
                    {candidate.name}
                  </CandidateBox>
                ))}
              </CandidateContainer>
              <CustomButton onClick={handleVote}>Vote</CustomButton>
            </>
          )}
        </MainContent>
      </Content>
      <Footer>
        <FooterContent>
          <FooterText>
            Project made with <FavoriteIcon fontSize="small" /> by Danyal Jabarkhail
          </FooterText>
          <SocialIcons>
            <SocialIcon href="https://facebook.com/danyaljabarkhail" target="_blank">
              <FacebookIcon fontSize="large" />
            </SocialIcon>
            <SocialIcon href="https://instagram.com/danyaljabarkhail" target="_blank">
              <InstagramIcon fontSize="large" />
            </SocialIcon>
            <SocialIcon href="https://github.com/danyaljabarkhail" target="_blank">
              <GitHubIcon fontSize="large" />
            </SocialIcon>
          </SocialIcons>
        </FooterContent>
      </Footer>
    </PageContainer>
  );
};

export default VotePage;

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  background: linear-gradient(to bottom right, #f0f2f5, #ffffff);
  min-height: 100vh;
  padding-top: 80px; /* Ensures space for the fixed navbar */
  box-sizing: border-box;
`;

const Navbar = styled.nav`
  width: 96%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 50px;
  background-color: #ffffff;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  position: fixed;
  top: 0;
  z-index: 1000;

  @media (max-width: 768px) {
    padding: 10px 20px;
  }
`;

const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;

  img {
    height: 60px;
  }
`;

const MenuIconWrapper = styled.div`
  display: none;
  cursor: pointer;

  @media (max-width: 768px) {
    display: block;
  }
`;

const NavLinks = styled.div`
  display: flex;
  gap: 30px;
  align-items: center;

  @media (max-width: 768px) {
    display: ${({ isMobileMenuOpen }) => (isMobileMenuOpen ? 'flex' : 'none')};
    position: fixed;
    top: 60px;
    left: 0;
    right: 0;
    background-color: #ffffff;
    flex-direction: column;
    gap: 20px;
    padding: 20px 0;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  }
`;

const NavLink = styled(Link)`
  text-decoration: none;
  font-size: 1rem;
  color: #1a0f91;
  font-weight: bold;
  &:hover {
    color: #7d97f4;
    text-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
  }

  @media (max-width: 768px) {
    font-size: 0.9rem;
  }
`;

const LogoutButton = styled.button`
  background-color: #1a0f91;
  color: #ffffff;
  border: none;
  padding: 10px 20px;
  border-radius: 25px;
  cursor: pointer;
  font-weight: bold;
  &:hover {
    background-color: #7d97f4;
  }

  @media (max-width: 768px) {
    padding: 8px 16px;
    font-size: 0.8rem;
  }
`;

const Content = styled.div`
  display: flex;
  flex-grow: 1;
  margin-top: 60px; /* Adjust for the fixed navbar */
  padding: 20px;

  @media (max-width: 768px) {
    flex-direction: column;
    padding: 10px;
    margin-top: 60px;
  }
`;

const SidebarButton = styled.div`
  position: fixed;
  left: 0;
  top: 110px;
  background-color: #1a0f91;
  padding: 10px;
  border-radius: 0 5px 5px 0;
  cursor: pointer;
  z-index: 1000;

  @media (min-width: 768px) {
    display: none;
  }
`;

const Sidebar = styled.div`
  width: 200px;  /* Fixed width for desktop */
  height: 60vh; /* Full height for the sidebar */
  background-color: #1a0f91; /* Background color */
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1); /* Add shadow for depth */
  border-radius: 0 8px 8px 0; /* Rounded corners on the right side */
  padding-top: 40px; /* Padding at the top */
  overflow: hidden; /* Prevent overflow content */
  position: fixed; /* Fix the position to the left side */
  left: 0; /* Align to the left */
  top: 110px; /* Start below the navbar */
  bottom: 0; /* Extend to the bottom */
  z-index: 999; /* Ensure it's above other content */
  
  @media (max-width: 768px) {
    width: ${({ isSidebarOpen }) => (isSidebarOpen ? '200px' : '0')};  /* Collapsible on mobile */
    display: ${({ isSidebarOpen }) => (isSidebarOpen ? 'block' : 'none')}; /* Hide by default on mobile */
    transition: width 0.3s ease; /* Smooth transition for opening and closing */
  }
`;


const SidebarItem = styled(Link)`
  display: block;
  margin-bottom: 20px;
  font-size: 1.2rem;
  color: #ffffff;
  text-decoration: none;
  padding: 10px 20px;
  &:hover {
    color: #007bff;
    background-color: #ffffff20;
    border-radius: 5px;
  }
`;

const MainContent = styled.div`
  flex-grow: 1;
  padding: 20px;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  margin-left: 200px; /* Fixed margin to accommodate the sidebar on desktop */
  transition: margin-left 0.3s ease;

  @media (max-width: 768px) {
    margin-left: 0; /* No margin on mobile */
    padding: 10px;
  }
`;

const ElectionContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: center;
  width: 100%; /* Ensure it takes full width of MainContent */
  margin-top: 20px; /* Space from the top content */
`;

const ElectionBox = styled.div`
  flex: 1 1 30%;
  padding: 20px;
  background-color: ${({ selected }) => (selected ? '#007bff' : '#f0f2f5')};
  color: ${({ selected }) => (selected ? '#ffffff' : '#3f3d56')};
  text-align: center;
  cursor: pointer;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  &:hover {
    background-color: #007bff;
    color: #ffffff;
  }

  @media (max-width: 768px) {
    flex: 1 1 100%;
  }
`;

const CandidateContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  margin-top: 20px;
  justify-content: center;
`;

const CandidateBox = styled.div`
  flex: 1 1 30%;
  padding: 20px;
  background-color: ${({ selected }) => (selected ? '#007bff' : '#f0f2f5')};
  color: ${({ selected }) => (selected ? '#ffffff' : '#3f3d56')};
  text-align: center;
  cursor: pointer;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  &:hover {
    background-color: #007bff;
    color: #ffffff;
  }

  @media (max-width: 768px) {
    flex: 1 1 100%;
  }
`;

const CustomButton = styled.button`
  background-color: #1a0f91;
  color: #ffffff;
  padding: 10px 20px;
  margin-top: 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  &:hover {
    background-color: #7d97f4;
  }
`;

const Message = styled.p`
  color: green;
  text-align: center;
`;

const Footer = styled.footer`
  background-color: #f0f2f5;
  padding: 20px 0;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
  margin-top: auto;
  position: sticky;
  bottom: 0;
`;

const FooterContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const FooterText = styled.p`
  color: #1a0f91;
  font-size: 1rem;
  display: flex;
  align-items: center;
  margin-bottom: 10px;

  svg {
    margin-left: 5px;
    color: red;
  }
`;

const SocialIcons = styled.div`
  display: flex;
  gap: 15px;
`;

const SocialIcon = styled.a`
  color: #1a0f91;
  transition: color 0.3s;

  &:hover {
    color: #7d97f4;
  }

  svg {
    font-size: 1.5rem;
  }
`;
