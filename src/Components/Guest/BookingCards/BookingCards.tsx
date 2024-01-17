// Import the CSS file
import "./BookingCards.css";

import React, { useState, useEffect } from "react";
import { API_URL } from "../../../Config/EndPoints";
import guestAxios from "../../../Axios/guestAxios";
import { useSelector } from "react-redux";
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
          console.log(hotelsData, "Fetched Hotels");
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
      console.log("Booking Cancelled:", response.data);
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

        console.log("Booking status updated successfully:", response.data);
      } catch (error) {
        console.error("Error updating booking status:", error);
      }
    };

    getBookingsByStatus("confirmed").forEach((booking: Booking) => {
      const checkInDate = new Date(booking.checkIn).setHours(0, 0, 0, 0);
      const currentDate = new Date().setHours(0, 0, 0, 0);

      if (checkInDate === currentDate || checkInDate < currentDate) {
        updateBookingStatus(booking._id);
      }
    });
  }, []);

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
    </div>
  );
}

export default BookingCards;
