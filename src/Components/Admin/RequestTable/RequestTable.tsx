import React, { useEffect, useState } from "react";
import "./RequestTable.css";
import adminAxios from "../../../Axios/adminAxios";
import { API_URL } from "../../../Config/EndPoints";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../../Routes/Routing";
import { useSelector } from "react-redux";
import { RootState } from "../../../Redux/Reducer/index";

interface Host {
  _id: string;
  hotelName: string;
  hotelRating: number;
  email: string;
  phone: string;
}

function RequestTable() {
  const { adminToken } = useSelector((state: RootState) => state.AdminAuthState);
  const headers = {
    'Authorization': `Bearer ${adminToken}`,
    'Content-Type': 'application/json',
  };
  const { PUBLIC, PRIVATE } = ROUTES;
  const navigate = useNavigate();
  const [requests, setRequests] = useState<Host[]>([]);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await adminAxios.get(API_URL.FETCH_REQUESTS,{ headers });
        setRequests(response.data);
      } catch (error) {
        console.error("Failed to fetch requests:", error);
      }
    };

    fetchRequests();
  }, []);

  const showDetails = async (id: string) => {
    try {
      navigate(`${PRIVATE.ADMIN_ROUTE.REQUEST_DETAILS}/${id}`);
    } catch (error) {
      console.error("Failed to navigate to request details:", error);
    }
  };

  if (requests.length === 0) {
    return (
      <div className="empty-requests-container">
        <p className="empty-requests-message">No New Requests</p>
      </div>
    );
}


  return (
    <div className="guest-table-container">
      <table className="guest-table">
        <thead>
          <tr>
            <th>Hotel Name</th>
            <th>Hotel Rating</th>
            <th>Email</th>
            <th>Phone</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {requests.map((request, index) => (
            <tr key={request._id}>
              <td>{request.hotelName}</td>
              <td>
                {Array(request.hotelRating)
                  .fill(0)
                  .map((_, idx) => (
                    <span key={idx} className="star-icon">
                      ★
                    </span>
                  ))}
              </td>
              <td>{request.email}</td>
              <td>{request.phone}</td>

              <td>
              <button className="professional-btn" onClick={() => showDetails(request._id)}>
  More Details
</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default RequestTable;
