import React, { useState } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import GitHubIcon from '@mui/icons-material/GitHub';

const AboutPage = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
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
          <SignButton to="/login">Sign In</SignButton>
          <SignUpButton to="/register">Sign Up</SignUpButton>
        </NavLinks>
      </Navbar>

      <ContentWrapper>
        <Section>
          <h1>About Us</h1>
          <p>
            Welcome to our online voting platform. We strive to provide a secure and transparent voting experience. Our platform allows voters to participate in elections from anywhere and enables administrators to manage elections seamlessly.
          </p>
        </Section>

        <Section>
          <h1>Project Information</h1>
          <p>This project was created by Danyal Jabarkhail.</p>
          <p>Reg No: 20PWBCS0814</p>
          <p>As a semester project for the Web Development course under the supervision of Sir Mohammad.</p>
        </Section>
      </ContentWrapper>

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
    </PageContainer>
  );
};

export default AboutPage;

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  min-height: 100vh;
  background: linear-gradient(to bottom right, #f0f2f5, #ffffff);
  position: relative;
  padding-top: 80px; /* Ensures space for the fixed navbar */

  @media (max-width: 768px) {
    padding-top: 100px; /* Increased padding for smaller screens */
    justify-content: flex-start;
  }
`;

const Navbar = styled.nav`
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
    right: 0;
    background-color: #ffffff;
    width: 200px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    flex-direction: column;
    gap: 20px;
    padding: 20px 0;
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
    background-color: #7d97f4;
    color: #ffffff;
  }

  @media (max-width: 768px) {
    padding: 8px 16px;
    font-size: 0.8rem;
  }
`;

const SignUpButton = styled(SignButton)`
  background-color: #1a0f91;
  color: #ffffff;
  &:hover {
    background-color: #7d97f4;
    color: #ffffff;
  }

  @media (max-width: 768px) {
    padding: 8px 16px;
    font-size: 0.8rem;
  }
`;

const ContentWrapper = styled.div`
  padding: 80px 20px 50px;
  width: 100%;
  max-width: 1000px;
  text-align: center;
  flex-grow: 1;

  @media (max-width: 768px) {
    padding: 60px 20px 50px;
  }
`;

const Section = styled.div`
  margin-bottom: 40px;

  h1 {
    color: #1a0f91;
    font-size: 2.5rem;
    margin-bottom: 20px;

    @media (max-width: 768px) {
      font-size: 2rem;
    }
  }

  p {
    color: #666666;
    line-height: 1.6;
    max-width: 800px;
    margin: 0 auto;

    @media (max-width: 768px) {
      font-size: 1rem;
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
    color: #7d97f4;
  }

  svg {
    font-size: 1.5rem;
  }
`;
