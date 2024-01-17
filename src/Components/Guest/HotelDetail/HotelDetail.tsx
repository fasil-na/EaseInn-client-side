import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import guestAxios from "../../../Axios/guestAxios";
import { API_URL } from "../../../Config/EndPoints";
import "./HotelDetail.css";
import { ROUTES } from "../../../Routes/Routing";

interface RoomTypeDetail {
  type: string;
  roomCount: number;
  roomFare: number;
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

function HotelDetail() {
  const navigate = useNavigate();
  const { PRIVATE } = ROUTES;

  const { id } = useParams();
  const [requestDetail, setRequestDetail] = useState<RequestDetailType | null>(
    null
  );

  useEffect(() => {
    const fetchHotelDetail = async () => {
      try {
        const response = await guestAxios.get(
          `${API_URL.FETCH_HOTEL_DETAIL}/${id}`
        );
        setRequestDetail(response.data);
      } catch (error) {
        console.error("Failed to fetch specific request detail:", error);
      }
    };

    fetchHotelDetail();
  }, [id]);

  return (
    <div>
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
            <div className="location-info">
              <p>
                {requestDetail.place}, {requestDetail.city},{" "}
                {requestDetail.state}, {requestDetail.country},{" "}
                {requestDetail.pin}
              </p>
              <div className="rating-info">
              {Array(requestDetail.hotelRating)
                .fill(0)
                .map((_, idx) => (
                  <span key={idx} className="star-icon">
                    ★
                  </span>
                ))}
            </div>
            </div>
            
            <button className="book-button">Book</button>
          </div>

          <div className="contact-info">
            <p>Email: {requestDetail.email}</p>
            <p>Phone: {requestDetail.phone}</p>
          </div>

          <div className="amenities">
            <h3>Amenities</h3>
            <ul>
              {requestDetail.amenities.map((amenity, index) => (
                <li key={index}>{amenity}</li>
              ))}
            </ul>
          </div>

          {requestDetail.roomTypes.map((roomType, idx) => (
            <div key={idx} className="room-details">
              <h3>
                {roomType.type} ({roomType.roomCount} nos)
              </h3>
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
    </div>
  );
}

export default HotelDetail;
