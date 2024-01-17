import React from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { hostAuthAction } from "../../../Redux/Container/hostAuth.slice";
import { ROUTES } from "../../../Routes/Routing";

function HostHeader() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { PUBLIC, PRIVATE } = ROUTES;

  const handleLogout = () => {
    dispatch(hostAuthAction.setHostLogout());
    navigate(PUBLIC.HOST_ROUTE.LOG_IN);
  };

  const redirectToHome = () => {
    navigate(PRIVATE.HOST_ROUTE.HOME);
  };

  const redirectToBookings = () => {
    console.log("entered");
    
    navigate(PRIVATE.HOST_ROUTE.BOOKINGS);
  };

  return (
    <Navbar collapseOnSelect expand="lg" className="bg-body-tertiary">
      <Container>
        <Navbar.Brand onClick={redirectToHome}>
          <span className="text-primary display-6">Ease</span>
          <span className="text-warning display-6">Inn</span>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="ms-auto">
            <Nav.Link eventKey={2} href="#memes">
              Slots
            </Nav.Link>
            <Nav.Link onClick={redirectToBookings}>
              Bookings
            </Nav.Link>
            <Nav.Link  onClick={handleLogout}>
              Logout
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default HostHeader;
