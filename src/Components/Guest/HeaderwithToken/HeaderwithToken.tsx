import React from 'react'
import {useNavigate} from 'react-router-dom'
import { useDispatch } from 'react-redux';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import NavDropdown from 'react-bootstrap/NavDropdown';
import {ROUTES} from '../../../Routes/Routing'
import { guestAuthAction } from '../../../Redux/Container/guestAuth.slice';

function HeaderwithToken() {

  const {PUBLIC, PRIVATE} = ROUTES

  const navigate = useNavigate()
  const dispatch = useDispatch()

  const handleLogout = () => {
    dispatch(guestAuthAction.setGuestLogout());
    navigate(PUBLIC.GUEST_ROUTE.LOG_IN)
  }

  const redirectToHome = () => {
    navigate(PRIVATE.GUEST_ROUTE.HOME)
  }

  const redirectToProfile = () => {
    navigate(PRIVATE.GUEST_ROUTE.USER_PROFILE)
  }
  const redirectToBookings = () => {
    navigate(PRIVATE.GUEST_ROUTE.BOOKINGS)
  }
  const redirectToFavourites = () => {
    navigate(PRIVATE.GUEST_ROUTE.FAVOURITES)
  }

  return (
    <Navbar collapseOnSelect expand="lg" className="bg-body-tertiary">
      <Container>
        <Navbar.Brand onClick={redirectToHome}><span className='text-primary display-6'>Ease</span><span className='text-warning display-6'>Inn</span></Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="ms-auto">
            <NavDropdown title="Hi Traveller" id="collasible-nav-dropdown">
              <NavDropdown.Item onClick={redirectToProfile}>Profile</NavDropdown.Item>
              <NavDropdown.Item onClick={redirectToBookings}>Bookings</NavDropdown.Item>
              <NavDropdown.Item href="#action/3.3">Wallet</NavDropdown.Item>
              <NavDropdown.Item onClick={redirectToFavourites}>Favouirtes</NavDropdown.Item>
              <NavDropdown.Item 
                onClick={handleLogout}>Logout</NavDropdown.Item>  
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default HeaderwithToken;
