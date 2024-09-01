import React, { useState } from 'react';
import styled from 'styled-components';
import { Button } from '@mui/material';
import { Link } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import GitHubIcon from '@mui/icons-material/GitHub';

const HomePage = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <HomeContainer>
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
          <SignButton to="/login">Sign In</SignButton>
          <SignUpButton to="/register">Sign Up</SignUpButton>
        </NavLinks>
      </Navbar>
      <HeroSection>
        <HeroText>
          <h1>E-VOTING System</h1>
          <p>Experience a secure, transparent, and convenient way to participate in elections. Our eVoting system is designed to make the voting process simple and accessible for everyone.</p>
          <CustomButton variant="contained" component={Link} to="/register">
            Get started!
          </CustomButton>
        </HeroText>
        <HeroImage>
          <img src="/voting.svg" alt="Voting Illustration" />
        </HeroImage>
      </HeroSection>
      <Footer>
        <FooterContent>
          <FooterText>
            Project made with <FavoriteIcon fontSize="small" /> by Danyal Jabarkhail
          </FooterText>
          <SocialIcons>
            <SocialIcon href="https://facebook.com/danyal.jabarkhail" target="_blank">
              <FacebookIcon fontSize="large" />
            </SocialIcon>
            <SocialIcon href="https://www.instagram.com/danicaptures2022/" target="_blank">
              <InstagramIcon fontSize="large" />
            </SocialIcon>
            <SocialIcon href="https://github.com/danyaljbarkhail" target="_blank">
              <GitHubIcon fontSize="large" />
            </SocialIcon>
          </SocialIcons>
        </FooterContent>
      </Footer>
    </HomeContainer>
  );
};

export default HomePage;

const HomeContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  background: linear-gradient(to bottom right, #f0f2f5, #ffffff);
  min-height: 100vh;
  justify-content: space-between;
  position: relative;
  padding-top: 80px; /* Ensures space for the fixed navbar */

  @media (max-width: 768px) {
    padding-top: 100px; /* Increased padding for smaller screens */
  }
`;

const Navbar = styled.div`
  width: 100%;
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
    color: #7d97f4; /* Hover color */
    text-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
  }

  @media (max-width: 768px) {
    font-size: 0.9rem;
  }
`;

const SignButton = styled(Link)`
  text-decoration: none;
  padding: 10px 20px;
  border-radius: 25px;
  color: #1a0f91;
  font-weight: bold;
  background-color: #ffffff;
  border: 2px solid #1a0f91;
  transition: background-color 0.3s, color 0.3s;

  &:hover {
    background-color: #7d97f4; /* Hover color */
    color: #ffffff;
  }

  @media (max-width: 768px) {
    padding: 8px 16px;
    font-size: 0.8rem;
  }
`;

const SignUpButton = styled(SignButton)`
  background-color: #1a0f91; /* Primary button color */
  color: #ffffff;
  &:hover {
    background-color: #7d97f4; /* Hover color */
    color: #ffffff;
  }

  @media (max-width: 768px) {
    padding: 8px 16px;
    font-size: 0.8rem;
  }
`;

const HeroSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 50px;
  text-align: left;
  width: 100%;
  max-width: 1200px;

  @media (max-width: 768px) {
    flex-direction: column;
    padding: 20px;
    text-align: center;
  }
`;

const HeroText = styled.div`
  flex: 1;
  h1 {
    font-size: 3rem;
    margin-bottom: 20px;
    color: #1a0f91;
  }
  p {
    font-size: 1.2rem;
    margin-bottom: 30px;
    color: #666666;
  }

  @media (max-width: 768px) {
    h1 {
      font-size: 2.5rem;
    }
    p {
      font-size: 1rem;
    }
  }
`;

const HeroImage = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  img {
    width: 60%; /* Adjusted image size */
    height: auto;
  }

  @media (max-width: 768px) {
    margin-top: 20px;
  }
`;

const CustomButton = styled(Button)`
  && {
    background-color: #1a0f91; /* Primary button color */
    color: #ffffff;
    padding: 10px 30px;
    font-size: 1rem;
    border-radius: 30px;
    transition: background-color 0.3s;

    &:hover {
      background-color: #7d97f4; /* Hover color */
    }
  }
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
    color: #7d97f4; /* Hover color */
  }

  svg {
    font-size: 1.5rem;
  }
`;
