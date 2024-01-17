import React from 'react'
import {useNavigate} from 'react-router-dom'
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { ROUTES } from '../../../Routes/Routing';

function HeaderNoToken() {

  const {PRIVATE, PUBLIC } = ROUTES
  const navigate = useNavigate()

  const redirectToHome = () => {
    navigate(PUBLIC.GUEST_ROUTE.HOME)
  }

  return (
    <Navbar collapseOnSelect expand="lg" className="bg-body-tertiary">
      <Container>
        <Navbar.Brand onClick={redirectToHome}><span className='text-primary display-6'>Ease</span><span className='text-warning display-6'>Inn</span></Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="ms-auto">
            
              <NavDropdown.Item onClick={()=>{
                navigate(PUBLIC.GUEST_ROUTE.LOG_IN)
              }}>Login</NavDropdown.Item>
              
            
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default HeaderNoToken;
