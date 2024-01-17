import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../../Components/Admin/Header/Header";
import { useParams } from "react-router-dom";
import adminAxios from "../../../Axios/adminAxios";
import { API_URL } from "../../../Config/EndPoints";
import "./RequestDetails.css";
import { ROUTES } from "../../../Routes/Routing";
import { useSelector } from "react-redux";
import { RootState } from "../../../Redux/Reducer/index";

interface RoomTypeDetail {
  type: string;
  roomCount: number;
  roomFare:number;
  roomAmenities: string[];
  roomImageLinks: string[];
}

interface RequestDetailType {
  username: string;
  email: string;
  phone: number;

  hotelName: string;
  hotelRating: number;
  gst: string;
  pan: string;
  amenities: string[];
  hotelImageLinks: string[];

  roomTypes: RoomTypeDetail[];

  place: string;
  city: string;
  state: string;
  country: string;
  pin: number;

  ownerDocLinks: string[];
  propertyDocLinks: string[];
  policyFileLinks: string[];

}

function RequestDetails() {
  const { adminToken } = useSelector((state: RootState) => state.AdminAuthState);
  const headers = {
    'Authorization': `Bearer ${adminToken}`,
    'Content-Type': 'application/json',
  };
  const navigate = useNavigate();
  const { PRIVATE } = ROUTES;

  const { id } = useParams();
  const [requestDetail, setRequestDetail] = useState<RequestDetailType | null>(
    null
  );

  useEffect(() => {
    const fetchRequestDetail = async () => {
      try {
        const response = await adminAxios.get(
          `${API_URL.REQUESTS_DETAILS}/${id}`,{ headers }
        );        
        setRequestDetail(response.data);
      } catch (error) {
        console.error("Failed to fetch specific request detail:", error);
      }
    };

    fetchRequestDetail();
  }, [id]);

  const approveRequest = async (event: React.MouseEvent<HTMLButtonElement>) => {
    try {
    
      const response = await adminAxios.get(`${API_URL.APPROVE_REQUEST}/${id}`, { headers });

      if (response.status === 200) {
        navigate(PRIVATE.ADMIN_ROUTE.REQUESTS);
      }
    } catch (error) {
      console.error("Failed to navigate to request details:", error);
    }
  };

  const rejectRequest = async (event: React.MouseEvent<HTMLButtonElement>) => {
    try {
      const response = await adminAxios.get(`${API_URL.REJECT_REQUEST}/${id}`, { headers });
      if (response.status === 200) {
        navigate(PRIVATE.ADMIN_ROUTE.REQUESTS);
      }
    } catch (error) {
      console.error("Failed to navigate to request details:", error);
    }
  };

  return (
    <div>
      <Header />
      {requestDetail && (
        <div className="request-details-container">
          <div className="hotel-images">
            <div className="image-container">
              {requestDetail.hotelImageLinks.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt={`Hotel Image ${index + 1}`}
                  style={{ width: "200px", height: "150px", margin: "10px" }}
                />
              ))}
            </div>
          </div>

          <h1>{requestDetail.hotelName}</h1>

          <div className="general-info">
            <p>
              {requestDetail.place},{requestDetail.city}, {requestDetail.state},{" "}
              {requestDetail.country}, {requestDetail.pin}
            </p>
            {Array(requestDetail.hotelRating)
              .fill(0)
              .map((_, idx) => (
                <span key={idx} className="star-icon">
                  ★
                </span>
              ))}
          </div>

          <div className="contact-info">
            <p>Username: {requestDetail.username}</p>
            <p>Email: {requestDetail.email}</p>
            <p>Phone: {requestDetail.phone}</p>
            <p>GST: {requestDetail.gst}</p>
            <p>PAN: {requestDetail.pan}</p>
          </div>

          <div className="amenities">
            <h3>Amenities</h3>
            <ul>
              {requestDetail.amenities.map((amenity, index) => (
                <li key={index}>{amenity}</li>
              ))}
            </ul>
          </div>

          <div className="docs">
            <h3>Owner's Documentation</h3>
            <div className="image-container">
              {requestDetail.ownerDocLinks.map((doc, index) => (
                <img
                  key={index}
                  src={doc}
                  alt={`Document ${index + 1}`}
                  style={{ width: "200px", height: "150px", margin: "10px" }}
                />
              ))}
            </div>
          </div>

          <div className="docs">
            <h3>Property's Documentation</h3>
            <div className="image-container">
              {requestDetail.propertyDocLinks.map((doc, index) => (
                <img
                  key={index}
                  src={doc}
                  alt={`Document ${index + 1}`}
                  style={{ width: "200px", height: "150px", margin: "10px" }}
                />
              ))}
            </div>
          </div>

          <div className="docs">
            <h3>Policies and Rules</h3>
            <div className="image-container">
              {requestDetail.policyFileLinks.map((doc, index) => (
                <img
                  key={index}
                  src={doc}
                  alt={`Document ${index + 1}`}
                  style={{ width: "200px", height: "150px", margin: "10px" }}
                />
              ))}
            </div>
          </div>

          {requestDetail.roomTypes.map((roomType, idx) => (
          <div key={idx} className="room-details">
            <h3>{roomType.type} ({roomType.roomCount} nos)</h3>
            <div className="image-container">
              {roomType.roomImageLinks.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt={`${roomType.type} Image ${index + 1}`}
                  style={{ width: "200px", height: "150px", margin: "10px" }}
                />
              ))}
            </div>
            <h4>Room Fare:{roomType.roomFare} Rs.</h4>
            <h4>Amenities:</h4>
            <ul>
              {roomType.roomAmenities.map((amenity, index) => (
                <li key={index}>{amenity}</li>
              ))}
            </ul>
          </div>
        ))}
        </div>
      )}
      <div className="button-container">
        <button className="approve-button" onClick={approveRequest}>
          Approve
        </button>
        <button className="reject-button" onClick={rejectRequest}>
          Reject
        </button>
      </div>
    </div>
  );
}

export default RequestDetails;
