import React, { useEffect, useState } from "react";
import "./BookingsOfGuestTable.css";
import adminAxios from "../../../Axios/adminAxios";
import { API_URL } from "../../../Config/EndPoints";
import { useSelector } from "react-redux";
import { RootState } from "../../../Redux/Reducer/index";
import { useParams } from "react-router-dom";

interface Guest {
  _id: string;
  username: string;
  email: string;
  phone: string;
  status: string;
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
}

function BookingsOfGuestTable() {
  const { adminToken } = useSelector((state: RootState) => state.AdminAuthState);
  const headers = {
    'Authorization': `Bearer ${adminToken}`,
    'Content-Type': 'application/json',
  };

  const [guestData, setGuestData] = useState<Guest | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  
  const { id } = useParams();

  useEffect(() => {
    const fetchGuestData = async () => {
      try {
        const response = await adminAxios.get(`${API_URL.FETCH_GUEST_DATA}/${id}`, { headers });
        setGuestData(response.data.guestData);
        setBookings(response.data.guestData.bookings);
      } catch (error) {
        console.error("Failed to fetch guests:", error);
      }
    };
    fetchGuestData();
  }, [id]);

  return (
    <div className="guest-table-container">
      <table className="guest-table">
        <thead>
          <tr>
            <th>Sl.No</th>
            <th>Hotel Name</th>
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
              <td>{booking.hotelName}</td>
              <td>{booking.checkIn}</td>
              <td>{booking.checkOut}</td>
              <td>{booking.guestCount}</td>
              <td>{booking.roomType}</td>
              <td>{booking.totalAmount}</td>
              <td>{new Date(booking.bookingDate).toLocaleString()}</td>
              <td>{booking.bookingStatus}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default BookingsOfGuestTable;
