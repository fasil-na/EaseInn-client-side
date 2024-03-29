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

  const [bookings, setBookings] = useState<Booking[]>([]);

  const { id } = useParams();

  useEffect(() => {
    const fetchGuestData = async () => {
      try {
        const response = await adminAxios.get(`${API_URL.FETCH_GUEST_DATA}/${id}`, { headers });
        const bookingsData = response.data;
  
        if (bookingsData && bookingsData.length > 0) {
  
          const extractedBookings = bookingsData.map((item: any) => ({
            ...item._doc, 
            hotelName: item.hotelName || 'Unknown Hotel', 
          }));
  
          setBookings(extractedBookings);
        } else {
          console.error("Guest data or bookings not found in the response.");
        }
      } catch (error) {
        console.error("Failed to fetch guests:", error);
      }
    };
  
    fetchGuestData();
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

export default BookingsOfGuestTable;