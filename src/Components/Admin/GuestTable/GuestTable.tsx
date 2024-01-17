import React, { useEffect, useState } from "react";
import "./GuestTable.css";
import adminAxios from "../../../Axios/adminAxios";
import { API_URL } from "../../../Config/EndPoints";
import { useSelector } from "react-redux";
import { RootState } from "../../../Redux/Reducer/index";
import {ROUTES} from '../../../Routes/Routing'
import {useNavigate} from 'react-router-dom'



interface Guest {
  _id: string;
  username: string;
  email: string;
  phone: string;
  status: string;
}

function GuestTable() {

  const navigate = useNavigate()

  const {PUBLIC, PRIVATE} = ROUTES

  const { adminToken } = useSelector((state: RootState) => state.AdminAuthState);
  const headers = {
    'Authorization': `Bearer ${adminToken}`,
    'Content-Type': 'application/json',
  };
  
  const [guests, setGuests] = useState<Guest[]>([]);

  const toggleStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === "Active" ? "Blocked" : "Active";
    try {
      await adminAxios.patch(`${API_URL.UPDATE_STATUS}/${id}`, {
        status: newStatus,
      },{ headers });

      setGuests(
        guests.map((guest) =>
          guest._id === id ? { ...guest, status: newStatus } : guest
        )
      );
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  };

  useEffect(() => {
    const fetchGuests = async () => {
      try {
        const response = await adminAxios.get(API_URL.FETCH_GUESTS,{ headers });
        setGuests(response.data);
      } catch (error) {
        console.error("Failed to fetch guests:", error);
      }
    };
    fetchGuests();
  }, []);

  const loadBookingsOfGuest = (id: string) => {
    navigate(`${PRIVATE.ADMIN_ROUTE.BOOKINGS_OF_GUEST}/${id}`);
  }
  



  return (
    <div className="guest-table-container">
      <table className="guest-table">
        <thead>
          <tr>
            <th>Sl.No</th>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Status</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {guests.map((guest, index) => (
            <tr key={guest._id}>
              <td>{index + 1}</td>
              <td>{guest.username}</td>
              <td>{guest.email}</td>
              <td>{guest.phone}</td>
              <td>
                <button
                  className={`status-button ${guest.status.toLowerCase()}`}
                  onClick={() => toggleStatus(guest._id, guest.status)}
                >
                  {guest.status}
                </button>
              </td>
              <td>
              <button onClick={() => loadBookingsOfGuest(guest._id)}>Bookings</button>

              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default GuestTable;
