import "./BookingCards.css";
import { useSelector } from "react-redux";
import guestAxios from "../../../Axios/guestAxios";
import React, { useState, useEffect } from "react";
import { API_URL } from "../../../Config/EndPoints";
import { RootState } from "../../../Redux/Reducer/index";

interface Booking {
  _id: string;
  checkIn: string;
  checkOut: string;
  bookingDate: Date;
  roomType: string;
  guestCount: number;
  hotelId: string;
  bookingStatus: string;
  totalAmount: number;
}

function BookingCards() {
  const { guestToken } = useSelector(
    (state: RootState) => state.GuestAuthState
  );
  const headers = {
    Authorization: `Bearer ${guestToken}`,
    "Content-Type": "application/json",
  };

  const [guestDetails, setGuestDetails] = useState<any>(null);
  const [selectedStatus, setSelectedStatus] = useState<string>("confirmed");
  const [hotelIds, setHotelIds] = useState<string[]>([]);
  const [hotelDetails, setHotelDetails] = useState<any[]>([]);
  const [displayStyle, setDisplayStyle] = useState("none");
  const [review, setReview] = useState("");
  const [selectedStars, setSelectedStars] = useState(0);
  const [bookingIdForReview, setBookingIdForReview] = useState<string | null>(
    null
  );
  const [errorMessage, setErrorMessage] = useState("");


  const handleStarClick = (starNumber: number) => {
    setSelectedStars(starNumber);
    setErrorMessage("");
  };

  useEffect(() => {
    if (guestDetails && guestDetails.bookings) {
      const extractedHotelIds = guestDetails.bookings.map(
        (booking: any) => booking.hotelId
      );
      setHotelIds(extractedHotelIds);

      const fetchHotels = async () => {
        try {
          const hotelsData = await guestAxios.post(
            API_URL.FETCH_BOOKED_HOTELS,
            {
              hotelIds: extractedHotelIds,
            },
            {
              headers,
            }
          );
          setHotelDetails(hotelsData.data.bookedHotels);
        } catch (error) {
          console.error("Failed to fetch hotels:", error);
        }
      };

      fetchHotels();
    }
  }, [guestDetails]);
  

  useEffect(() => {
    const fetchGuestData = async () => {
      try {
        const guestData = await guestAxios.get(API_URL.FETCH_GUEST_DETAILS, {
          headers,
        });
        setGuestDetails(guestData.data);
      } catch (error) {
        console.error("Failed to fetch guest details:", error);
      }
    };
  
    fetchGuestData();
  }, []);
  

  const getBookingsByStatus = (status: string) =>
    guestDetails?.bookings.filter(
      (booking: Booking) => booking.bookingStatus === status
    ) || [];

  const handleCancelBooking = async (bookingId: string) => {
    try {
      const response = await guestAxios.post(
        API_URL.CANCEL_BOOKING,
        { bookingId },
        { headers }
      );
    } catch (error) {
      console.error("Failed to cancel booking:", error);
    }
  };

  const openRateAndReviewPopup = (bookingId: string) => {
    setDisplayStyle("block");
    setBookingIdForReview(bookingId);
  };

  const closeRateAndReviewPopup = () => {
    setDisplayStyle("none");
    setSelectedStars(0);
    setReview("")
  };

  const handleSubmit = async (event: React.FormEvent) => {
    try {
      event.preventDefault();
      if(selectedStars>0){
        const payload = {
          selectedStars,
          review,
          bookingIdForReview,
        };
  
        const response = await guestAxios.post(
          API_URL.SUBMIT_RATING_AND_REVIEW,
          { payload },
          { headers }
        );
        if (response.data.success) {
          setDisplayStyle("none");
          window.location.reload()
        }

      }else{
        setErrorMessage("Please select at least one star before submitting.");
      }
     
    } catch (error) {
      console.error("Failed to cancel booking:", error);
    }
  };

  useEffect(() => {
    const updateBookingStatus = async (bookingId: string) => {
      try {
        const response = await guestAxios.put(
          API_URL.UPDATE_BOOKING_STATUS,
          { bookingId },
          { headers }
        );
  
        console.log("API response for updating booking status:", response);
  
        console.log("Component re-rendered after state update");
  
      } catch (error) {
        console.error("Error updating booking status:", error);
      }
    };
  
    getBookingsByStatus("confirmed").forEach((booking: Booking) => {
      const checkOutDate = new Date(booking.checkOut).setHours(0, 0, 0, 0);
      const currentDate = new Date().setHours(0, 0, 0, 0);
  
      console.log("checkInDate:", checkOutDate);
      console.log("currentDate:", currentDate);
  
      if (checkOutDate === currentDate || checkOutDate < currentDate) {
        updateBookingStatus(booking._id);
      }
    });
  }, [guestDetails]);
  
  return (
    <div className="booking-container">
      <div className="booking-status-section">
        <h2
          className={
            selectedStatus === "confirmed"
              ? "active-heading"
              : "inactive-heading"
          }
          onClick={() => setSelectedStatus("confirmed")}
        >
          Confirmed Bookings
        </h2>
        {selectedStatus === "confirmed" &&
          getBookingsByStatus("confirmed").map(
            (booking: Booking, index: number) => {
              const hotelDetail = hotelDetails.find(
                (hotel) => hotel._id === booking.hotelId
              );

              const timeDifference =
                new Date(booking.checkIn).getTime() - new Date().getTime();
              const hoursDifference = Math.floor(
                timeDifference / (1000 * 60 * 60)
              );

              const roomsNeeded = Math.ceil(booking.guestCount / 3);

              return (
                <div key={index} className="booking-card">
                  <img
                    src={hotelDetail?.hotelImageLinks[0]}
                    alt={hotelDetail?.hotelName}
                    className="hotel-image"
                  />
                  <div className="booking-details">
                    <p className="hotel-name">{hotelDetail?.hotelName}</p>
                    <p className="date">
                      Check-In:{" "}
                      {new Date(booking.checkIn).toLocaleDateString("en-US")}
                    </p>
                    <p className="date">
                      Check-Out:{" "}
                      {new Date(booking.checkOut).toLocaleDateString("en-US")}
                    </p>
                    <p className="date">
                      Booking Date:{" "}
                      {new Date(booking.bookingDate).toLocaleDateString(
                        "en-US"
                      )}
                    </p>
                    <p className="room-type">Room Type: {booking.roomType}</p>
                    <p className="guest-count">
                      Guest Count: {booking.guestCount}
                    </p>
                    <p className="rooms-needed">Rooms Booked: {roomsNeeded}</p>
                    <p className="total-amount">
                      Total Amount: {booking.totalAmount} Rs.
                    </p>
                    {hoursDifference > 24 && (
                      <button
                        className="cancel-button"
                        onClick={() => handleCancelBooking(booking._id)}
                      >
                        Cancel Booking
                      </button>
                    )}
                  </div>
                </div>
              );
            }
          )}
      </div>

      <div className="booking-status-section">
        <h2
          className={
            selectedStatus === "completed"
              ? "active-heading"
              : "inactive-heading"
          }
          onClick={() => setSelectedStatus("completed")}
        >
          Completed Bookings
        </h2>
        {selectedStatus === "completed" &&
          getBookingsByStatus("completed").map(
            (booking: Booking, index: number) => {
              const hotelDetail = hotelDetails.find(
                (hotel) => hotel._id === booking.hotelId
              );

              const roomsNeeded = Math.ceil(booking.guestCount / 3);

              const isBookingReviewed = hotelDetail?.reviews.some(
                (review: any) => review.bookingId === booking._id
              );

              return (
                <div key={index} className="booking-card">
                  <img
                    src={hotelDetail?.hotelImageLinks[0]}
                    alt={hotelDetail?.hotelName}
                    className="hotel-image"
                  />
                  <div className="booking-details">
                    <p className="hotel-name">{hotelDetail?.hotelName}</p>
                    <p className="date">
                      Check-In:{" "}
                      {new Date(booking.checkIn).toLocaleDateString("en-US")}
                    </p>
                    <p className="date">
                      Check-Out:{" "}
                      {new Date(booking.checkOut).toLocaleDateString("en-US")}
                    </p>
                    <p className="date">
                      Booking Date:{" "}
                      {new Date(booking.bookingDate).toLocaleDateString(
                        "en-US"
                      )}
                    </p>
                    <p className="room-type">Room Type: {booking.roomType}</p>
                    <p className="guest-count">
                      Guest Count: {booking.guestCount}
                    </p>
                    <p className="rooms-needed">Rooms Booked: {roomsNeeded}</p>
                    <p className="total-amount">
                      Total Amount: ${booking.totalAmount}
                    </p>
                    <button
            onClick={() =>
              isBookingReviewed
                ? alert('Booking already reviewed')
                : openRateAndReviewPopup(booking._id)
            }
            disabled={isBookingReviewed}
          >
            {isBookingReviewed ? 'Already Reviewed' : 'Rate and Review'}
          </button>
                  </div>
                </div>
              );
            }
          )}
      </div>

      <div className="booking-status-section">
        <h2
          className={
            selectedStatus === "cancelled"
              ? "active-heading"
              : "inactive-heading"
          }
          onClick={() => setSelectedStatus("cancelled")}
        >
          Cancelled Bookings
        </h2>
        {selectedStatus === "cancelled" &&
          getBookingsByStatus("cancelled").map(
            (booking: Booking, index: number) => {
              const hotelDetail = hotelDetails.find(
                (hotel) => hotel._id === booking.hotelId
              );

              const roomsNeeded = Math.ceil(booking.guestCount / 3);

              return (
                <div key={index} className="booking-card">
                  <img
                    src={hotelDetail?.hotelImageLinks[0]}
                    alt={hotelDetail?.hotelName}
                    className="hotel-image"
                  />
                  <div className="booking-details">
                    <p className="hotel-name">{hotelDetail?.hotelName}</p>
                    <p className="date">
                      Check-In:{" "}
                      {new Date(booking.checkIn).toLocaleDateString("en-US")}
                    </p>
                    <p className="date">
                      Check-Out:{" "}
                      {new Date(booking.checkOut).toLocaleDateString("en-US")}
                    </p>
                    <p className="date">
                      Booking Date:{" "}
                      {new Date(booking.bookingDate).toLocaleDateString(
                        "en-US"
                      )}
                    </p>
                    <p className="room-type">Room Type: {booking.roomType}</p>
                    <p className="guest-count">
                      Guest Count: {booking.guestCount}
                    </p>
                    <p className="rooms-needed">Rooms Booked: {roomsNeeded}</p>
                    <p className="total-amount">
                      Total Amount: ${booking.totalAmount}
                    </p>
                  </div>
                </div>
              );
            }
          )}
      </div>
      <div
        id="rateAndReviewPopup"
        className="rateAndReviewPopup"
        style={{ display: displayStyle }}
      >
        <form onSubmit={handleSubmit}>
          <h4>Rating and Review</h4>

          <div className="star-rating">
            {[1, 2, 3, 4, 5].map((starNumber) => (
              <span
                key={starNumber}
                className={`star ${
                  starNumber <= selectedStars ? "selected" : ""
                }`}
                onClick={() => handleStarClick(starNumber)}
              >
                &#9734;
              </span>
            ))}
          </div>

          <label>
            Comment
            <input
              type="text"
              placeholder="Your opinion Matters"
              value={review}
              onChange={(e) => setReview(e.target.value)}
            />
          </label>
          <input type="text" value={bookingIdForReview || ""} hidden />
          {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}

          <div>
            <button type="submit">Submit</button>
            <button type="button" onClick={closeRateAndReviewPopup}>
              Close
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default BookingCards;
