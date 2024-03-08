import "./BookingsOfHostTable.css";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import React, { useEffect, useState } from "react";
import adminAxios from "../../../Axios/adminAxios";
import { API_URL } from "../../../Config/EndPoints";
import { RootState } from "../../../Redux/Reducer/index";

interface Guest {
  _id: string;
  username: string;
  email: string;
  phone: string;
  status: string;
  bookings: Booking[];
}

interface Booking {
  _id: string;
  hotelName: string;
  checkIn: string;
  checkOut: string;
  guestCount: number;
  roomType: string;
  totalAmount: number;
  bookingDate: string;
  bookingStatus: string;
  hotelId: string; 
}

function BookingsOfHostTable() {
  const { adminToken } = useSelector((state: RootState) => state.AdminAuthState);
  const headers = {
    'Authorization': `Bearer ${adminToken}`,
    'Content-Type': 'application/json',
  };

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [guests, setGuests] = useState<Guest[]>([]);

  const { id } = useParams();

  useEffect(() => {
    const fetchGuests = async () => {
      try {
        const response = await adminAxios.get(API_URL.FETCH_GUESTS, { headers });
        const foundGuests = response.data.filter((guest: Guest) => {
          return guest.bookings.some((booking: Booking) => booking.hotelId === id);
        });

        if (foundGuests.length > 0) {
          const allBookings: Booking[] = [];
          foundGuests.forEach((guest: Guest) => {
            allBookings.push(...guest.bookings);
          });

          setBookings(allBookings);
          setGuests(foundGuests);
        } else {
          console.error("Guests not found with bookings for the specified hotelId.");
        }
      } catch (error) {
        console.error("Failed to fetch guests:", error);
      }
    };
    fetchGuests();
  }, [id]);

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'confirmed':
        return { color: 'green', fontWeight: 'bold' };
      case 'completed':
        return { color: 'blue', fontWeight: 'bold' };
      case 'cancelled':
        return { color: 'red', fontWeight: 'bold' };
      default:
        return {};
    }
  };

  return (
    <div className="guest-table-container">
      <table className="guest-table">
        <thead>
          <tr>
            <th>Sl.No</th>
            <th>Checkin</th>
            <th>Checkout</th>
            <th>No of Guests</th>
            <th>Room Type</th>
            <th>Amount</th>
            <th>Booked On</th>
            <th>Status</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((booking, index) => (
            <tr key={booking._id}>
              <td>{index + 1}</td>
              <td>{new Date(booking.checkIn).toLocaleDateString()}</td>
              <td>{new Date(booking.checkOut).toLocaleDateString()}</td>
              <td>{booking.guestCount}</td>
              <td>{booking.roomType}</td>
              <td>{booking.totalAmount}</td>
              <td>{new Date(booking.bookingDate).toLocaleDateString()}</td>
              <td style={getStatusStyle(booking.bookingStatus)}>{booking.bookingStatus}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default BookingsOfHostTable;
