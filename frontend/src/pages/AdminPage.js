import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate, Link, Routes, Route } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import DashboardIcon from '@mui/icons-material/Dashboard';
import BallotIcon from '@mui/icons-material/Ballot';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import ListAltIcon from '@mui/icons-material/ListAlt';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import GitHubIcon from '@mui/icons-material/GitHub';
import AdminDashboard from './AdminDashboard';
import AdminViewElections from './AdminViewElections';
import AddElection from './AddElection';
import AdminResultsPage from './AdminResultsPage';

const AdminPage = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const navigate = useNavigate();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/login');
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
        <NavLinks $isMobileMenuOpen={isMobileMenuOpen}>
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
        <Sidebar $isSidebarOpen={isSidebarOpen}>
          <SidebarItem to="/admin/admin-dashboard">
            <DashboardIcon style={{ marginRight: '10px' }} /> Dashboard
          </SidebarItem>
          <SidebarItem to="/admin/admin-elections">
            <ListAltIcon style={{ marginRight: '10px' }} /> View Elections
          </SidebarItem>
          <SidebarItem to="/admin/add-election">
            <AddCircleIcon style={{ marginRight: '10px' }} /> Add New Election
          </SidebarItem>
          <SidebarItem to="/admin/admin-results">
            <BallotIcon style={{ marginRight: '10px' }} /> Results
          </SidebarItem>
        </Sidebar>
        <MainContent>
          <Routes>
            <Route path="admin-dashboard" element={<AdminDashboard />} />
            <Route path="admin-elections" element={<AdminViewElections />} />
            <Route path="add-election" element={<AddElection />} />
            <Route path="admin-results" element={<AdminResultsPage />} /> {/* Updated Path */}
          </Routes>
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

export default AdminPage;

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  background: linear-gradient(to bottom right, #f0f2f5, #ffffff);
  min-height: 100vh;
  padding-top: 80px;
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
    display: ${({ $isMobileMenuOpen }) => ($isMobileMenuOpen ? 'flex' : 'none')};
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
  padding: 20px;
  margin-top: 60px;

  @media (max-width: 768px) {
    flex-direction: column;
    padding: 10px;
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
  top: 120px; /* Start below the navbar */
  bottom: 0; /* Extend to the bottom */
  z-index: 999; /* Ensure it's above other content */
  
  @media (max-width: 768px) {
    width: ${({ $isSidebarOpen }) => ($isSidebarOpen ? '200px' : '0')};  /* Collapsible on mobile */
    display: ${({ $isSidebarOpen }) => ($isSidebarOpen ? 'block' : 'none')}; /* Hide by default on mobile */
    transition: width 0.3s ease; /* Smooth transition for opening and closing */
  }
`;

const SidebarItem = styled(Link)`
  display: flex;
  align-items: center;
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

const Footer = styled.footer`
  background-color: #f0f2f5;
  padding: 0px 0;
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
