import React, { useEffect, useState } from "react";
import "./HostTable.css";
import adminAxios from "../../../Axios/adminAxios";
import { API_URL } from "../../../Config/EndPoints";
import { useSelector } from "react-redux";
import { RootState } from "../../../Redux/Reducer/index";

interface Host {
  _id: string;
  username: string;
  email: string;
  phone: string;
  status: string;
}

function HostTable() {
  const { adminToken } = useSelector((state: RootState) => state.AdminAuthState);
  const headers = {
    'Authorization': `Bearer ${adminToken}`,
    'Content-Type': 'application/json',
  };
  const [hosts, setHosts] = useState<Host[]>([]);

  const toggleStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === "Active" ? "Blocked" : "Active";
    try {
      await adminAxios.patch(`${API_URL.UPDATE_HOST_STATUS}/${id}`, {
        status: newStatus,
      },{ headers });

      setHosts(
        hosts.map((host) =>
        host._id === id ? { ...host, status: newStatus } : host
        )
      );
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  };

  useEffect(() => {
    const fetchHosts = async () => {
      try {
        const response = await adminAxios.get(API_URL.FETCH_HOSTS,{ headers });
        setHosts(response.data);
      } catch (error) {
        console.error("Failed to fetch hosts:", error);
      }
    };

    fetchHosts();
  }, []);

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
          </tr>
        </thead>
        <tbody>
          {hosts.map((host, index) => (
            <tr key={host._id}>
              <td>{index + 1}</td>
              <td>{host.username}</td>
              <td>{host.email}</td>
              <td>{host.phone}</td>
              <td>
                <button
                  className={`status-button ${host.status.toLowerCase()}`}
                  onClick={() => toggleStatus(host._id, host.status)}
                >
                  {host.status}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default HostTable;
