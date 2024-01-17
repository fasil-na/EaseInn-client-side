import React from 'react'
import {useNavigate} from 'react-router-dom'
import { useDispatch } from 'react-redux';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { adminAuthAction } from '../../../Redux/Container/adminAuth.slice';
import {ROUTES} from '../../../Routes/Routing'
import adminAxios from '../../../Axios/adminAxios'
import { API_URL } from "../../../Config/EndPoints";

function Header() {

  const navigate = useNavigate()
  const dispatch = useDispatch()

   const {PUBLIC, PRIVATE} = ROUTES

   const loadDashboard = () =>{
    navigate(PRIVATE.ADMIN_ROUTE.DASHBOARD)
   }

   const loadGuests = () =>{
    navigate(PRIVATE.ADMIN_ROUTE.GUESTS)
   }

   const loadHotels = () =>{
    navigate(PRIVATE.ADMIN_ROUTE.HOTELS)
   }

   const loadRequests = () =>{
    navigate(PRIVATE.ADMIN_ROUTE.REQUESTS)
   }

  const handleLogout = () => {
    dispatch(adminAuthAction.setAdminLogout());
    navigate(PUBLIC.ADMIN_ROUTE.LOG_IN)
  }
  return (
    <Navbar collapseOnSelect expand="lg" className="bg-body-tertiary">
      <Container>
        <Navbar.Brand 
        ><span className='text-primary display-6'>Ease</span><span className='text-warning display-6'>Inn</span></Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="ms-auto">
            <Nav.Link eventKey={2} onClick={loadDashboard}>
             Dashboard
            </Nav.Link>
            <Nav.Link eventKey={2} onClick={loadGuests}>
             Guests
            </Nav.Link>
            <Nav.Link eventKey={2} onClick={loadHotels}>
             Hotels
            </Nav.Link>
            <Nav.Link eventKey={2} onClick={loadRequests}>
             Requests
            </Nav.Link>
            <Nav.Link eventKey={2} 
            onClick={handleLogout}>Logout
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Header;