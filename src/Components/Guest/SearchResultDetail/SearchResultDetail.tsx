import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import guestAxios from "../../../Axios/guestAxios";
import { API_URL } from "../../../Config/EndPoints";
import "./SearchResultDetail.css";
import { ROUTES } from "../../../Routes/Routing";
import { useLocation } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Swal from "sweetalert2";
import { useSelector } from "react-redux";
import { RootState } from "../../../Redux/Reducer/index";
import useRazorpay from "react-razorpay";

interface RoomTypeDetail {
  type: string;
  roomCount: number;
  roomFare: number;
  roomAmenities: string[];
  roomImageLinks: string[];
  dailySlots?: { date: string; booked: number; _id: string }[];
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

// interface GuestDetails {
//   _id: string;
//   username: string;
//   email: string;
//   // ... other properties
//   Wallet: number; // Assuming Wallet is a number, adjust as needed
// }

function SearchResultDetail() {
  const RAZORPAY_KEY = process.env.REACT_APP_RAZORPAY_KEY!;

  const location = useLocation();
  const navigate = useNavigate();
  const [Razorpay] = useRazorpay();

  const { checkInDate, checkOutDate, guestCount } = location.state;

  const { PRIVATE } = ROUTES;

  const { guestToken } = useSelector(
    (state: RootState) => state.GuestAuthState
  );

  const getToday = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = (today.getMonth() + 1).toString().padStart(2, "0");
    const day = today.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const nextDay = new Date(checkInDate);
  nextDay.setDate(nextDay.getDate() + 1);

  const headers = {
    Authorization: `Bearer ${guestToken}`,
    "Content-Type": "application/json",
  };

  const { id } = useParams();
  const [requestDetail, setRequestDetail] = useState<RequestDetailType | null>(
    null
  );

  const [availableRoomTypes, setAvailableRoomTypes] = useState<string[]>([]);

  useEffect(() => {
    const filteredRoomTypes = requestDetail?.roomTypes.filter((roomType) => {
      if (
        Array.isArray(roomType?.dailySlots) &&
        roomType.dailySlots.length === 0
      ) {
        return roomType.roomCount * 3 >= guestCount;
      } else if (Array.isArray(roomType?.dailySlots)) {
        const bookedRoomsForDate = roomType.dailySlots.reduce(
          (totalBooked, slot) =>
            new Date(slot.date).toDateString() ===
            new Date(checkInDate).toDateString()
              ? totalBooked + slot.booked
              : totalBooked,
          0
        );

        const availableRooms = roomType.roomCount - bookedRoomsForDate;

        return availableRooms > 0 && availableRooms * 3 >= guestCount;
      }

      return false;
    });

    if (filteredRoomTypes) {
      setAvailableRoomTypes(filteredRoomTypes.map((roomType) => roomType.type));
    }
  }, [requestDetail, checkInDate, checkOutDate, guestCount]);

  // const [guestDetails, setGuestDetails] = useState<GuestDetails | null>(null);
  const [totalAmount, setTotalAmount] = useState<number | null>(null);

  const [displayTotalAmount, setDisplayTotalAmount] = useState<number | null>(
    null
  );

  const openbookingPopup = async () => {
    const bookingConfirmationPopup = document.getElementById(
      "bookingConfirmationPopup"
    );
    if (bookingConfirmationPopup) {
      bookingConfirmationPopup.style.display = "block";
    }
  };

  const closebookingPopup = async () => {
    const bookingConfirmationPopup = document.getElementById(
      "bookingConfirmationPopup"
    );
    if (bookingConfirmationPopup) {
      bookingConfirmationPopup.style.display = "none";
    }
  };

  useEffect(() => {
    clearErrorMessage();
  }, []);

  const [selectedRoomType, setSelectedRoomType] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const calculateNights = (checkInDate: string, checkOutDate: string) => {
    const oneDay = 24 * 60 * 60 * 1000;
    const startDate = new Date(checkInDate).getTime();
    const endDate = new Date(checkOutDate).getTime();

    const nightCount = Math.round(Math.abs((startDate - endDate) / oneDay));
    return nightCount;
  };

  const handleRoomTypeChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const selectedRoomType = event.target.value;
    setSelectedRoomType(selectedRoomType);

    const selectedRoom = requestDetail?.roomTypes.find(
      (roomType) => roomType.type === selectedRoomType
    );

    if (selectedRoom) {
      const numberOfRooms = Math.ceil(guestCount / 3);
      const calculatedTotalAmount = numberOfRooms * selectedRoom.roomFare;
      const nights = calculateNights(checkInDate, checkOutDate);
      setTotalAmount(calculatedTotalAmount);
      setDisplayTotalAmount(calculatedTotalAmount * nights);
    } else {
      setTotalAmount(null);
      setDisplayTotalAmount(null);
    }

    clearErrorMessage();
  };

  // const [payFromWallet, setPayFromWallet] = useState(false);

  // const handlePayFromWalletChange = (
  //   event: React.ChangeEvent<HTMLInputElement>
  // ) => {
  //   setPayFromWallet(event.target.checked);
  // };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (selectedRoomType && displayTotalAmount !== null) {
      const gstAmount = displayTotalAmount * 0.18;
      const totalAmountWithGST = (displayTotalAmount + gstAmount).toFixed(0);

      const formData = {
        checkInDate,
        checkOutDate,
        guestCount,
        roomType: selectedRoomType,
        totalAmountWithGST,
      };

      try {
        const response = await guestAxios.post(
          `${API_URL.PROCEED_TO_PAY}/${id}`,
          formData,
          { headers }
        );

        const { razorpayOrder } = response.data.data;
        const options = {
          key: "rzp_test_0c2a2ihcOITdYH",
          order_id: razorpayOrder.id,
          amount: razorpayOrder.amount,
          currency: razorpayOrder.currency,
          name: "Ease Inn",
          description: "Payment for hotel booking",
          handler: function (paymentResponse: any) {
            console.log("Payment success:", paymentResponse);

            guestAxios
              .post(`${API_URL.PAYMENT_COMPLETED}/${id}`, formData, { headers })
              .then((apiResponse) => {
                console.log("API response:", apiResponse);
                navigate(PRIVATE.GUEST_ROUTE.BOOKINGS);
              })
              .catch((error) => {
                console.error("API error:", error);
              });
          },

          prefill: {
            name: "Ease Inn",
            email: "easeinn@email.com",
            contact: "1234567890",
          },
          theme: {
            color: "#F37254",
          },
        };

        const razorpayInstance = new Razorpay(options);
        razorpayInstance.open();
      } catch (error) {
        console.error("Failed to submit form:", error);
      }
    } else {
      setErrorMessage("Please select a room type.");
    }
  };

  const clearErrorMessage = () => {
    setErrorMessage("");
  };

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

  // useEffect(() => {
  //   const fetchGuestData = async () => {
  //     try {
  //       const response = await guestAxios.get(API_URL.FETCH_GUEST_DETAILS, {
  //         headers,
  //       });

  //       setGuestDetails(response.data);
  //     } catch (error) {
  //       console.error("Failed to fetch guest details:", error);
  //     }
  //   };

  //   fetchGuestData();
  // }, []);

  // console.log(guestDetails, "kkkkkkkkkkkkkkkkkkkk");

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  return (
    <div>
      {requestDetail && (
        <div className="request-details-container">
          <div className="hotel-images">
            <Slider {...settings} key={requestDetail.hotelImageLinks.length}>
              {requestDetail.hotelImageLinks.map((img, index) => (
                <div className="image-container" key={index}>
                  <img
                    src={img}
                    alt={`Hotel Image ${index + 1}`}
                    style={{ width: "100%", height: "550px", margin: "10px" }}
                  />
                </div>
              ))}
            </Slider>
          </div>

          <h1>{requestDetail.hotelName}</h1>

          <div className="general-info">
            <div className="location-info">
              <p>
                {requestDetail.place}, {requestDetail.city},{" "}
                {requestDetail.state}, {requestDetail.country},{" "}
                {requestDetail.pin}
              </p>
              <p className="star-rating">
                {Array(requestDetail.hotelRating)
                  .fill(0)
                  .map((_, idx) => (
                    <span key={idx} className="star-icon">
                      ★
                    </span>
                  ))}
              </p>
            </div>
            <button className="book-button" onClick={openbookingPopup}>
              Book
            </button>
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

      <div
        id="bookingConfirmationPopup"
        className="booking-popup"
        style={{ display: "none" }}
      >
        <div className="popup-header" style={{ textAlign: "center" }}>
          <h3>Booking Confirmation</h3>
        </div>
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="swal-input2" className="swal2-label">
              Check In Date
            </label>
            <input
              id="swal-input2"
              className="swal2-input"
              type="date"
              min={getToday()}
              value={checkInDate}
            />
          </div>

          <div>
            <label htmlFor="swal-input3" className="swal2-label">
              Check Out Date
            </label>
            <input
              id="swal-input3"
              className="swal2-input"
              type="date"
              value={checkOutDate}
              min={nextDay.toISOString().split("T")[0]}
            />
          </div>

          <div>
            <label htmlFor="swal-input4" className="swal2-label">
              No:of Guests
            </label>
            <input
              id="swal-input4"
              className="swal2-input"
              type="number"
              value={guestCount}
              min="1"
            ></input>
          </div>

          <div>
            <label htmlFor="swal-input6" className="swal2-label">
              Room Type
            </label>
            <select
              id="swal-input6"
              className="swal2-input"
              value={selectedRoomType}
              onChange={handleRoomTypeChange}
            >
              <option value="" disabled>
                Select a room type
              </option>
              {availableRoomTypes.map((roomType) => (
                <option key={roomType} value={roomType}>
                  {roomType}
                </option>
              ))}
            </select>
            {displayTotalAmount !== null && (
              <div className="amount-container">
                <div className="amount-label">
                  <p>
                    Room price for {calculateNights(checkInDate, checkOutDate)}{" "}
                    Nights X {guestCount} Guests:
                  </p>
                  <p>GST (18%):</p>
                  <p>Total Amount (Including GST):</p>
                </div>
                <div className="amount-value">
                  <p>{displayTotalAmount.toFixed(0)} Rs.</p>
                  <p>{(displayTotalAmount * 0.18).toFixed(0)} Rs.</p>
                  <p className="highlighted-amount">
                    {(displayTotalAmount * 1.18).toFixed(0)} Rs.
                  </p>
                </div>
              </div>
            )}
          </div>
          {/* <div style={{ display: "flex", alignItems: "center", }}>
            
            <input
              id="payFromWallet"
              className="swal2-checkbox"
              type="checkbox"
              checked={payFromWallet}
              onChange={handlePayFromWalletChange}
            />
            <label
              htmlFor="payFromWallet"
              className="swal2-label"
              // style={{ marginRight: "10px" }}
            >
              Pay from Wallet
            </label>
          </div>

          {guestDetails && (
            <div>
              <p>Wallet Balance: {guestDetails.Wallet} Rs.</p>
            </div>
          )} */}

          <div className={`error-message ${errorMessage ? "show" : ""}`}>
            {errorMessage && <p>{errorMessage}</p>}
          </div>
          <div className="popup-footer">
            <button
              type="submit"
              className="confirm-booking-button highlighted-button"
            >
              Proceed To Pay
            </button>
            <button
              type="button"
              className="confirm-booking-button cancel"
              onClick={() => {
                clearErrorMessage();
                closebookingPopup();
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SearchResultDetail;
