import React, { useState, useEffect, useRef } from "react";
import "./ProfileDetail.css";
import jwtDecode from "jwt-decode";
import { API_URL } from "../../../Config/EndPoints";
import guestAxios from "../../../Axios/guestAxios";
import Swal from "sweetalert2";
import { useSelector } from "react-redux";
import { RootState } from "../../../Redux/Reducer/index";

interface GuestDetailsInterface {
  _id: string;
}

type PrivilegeLevel = "Bronze" | "Silver" | "Gold" | "Platinum";

interface PrivilegeCardProps {
  level: PrivilegeLevel;
  currentPrivilege: number;
}

interface Address {
  line1: string;
  place: string;
  city: string;
  state: string;
  country: string;
  PIN: string;
}

const privilegeIndex: Record<PrivilegeLevel, number> = {
  Bronze: 0,
  Silver: 1,
  Gold: 2,
  Platinum: 3,
};

function PrivilegeCard({ level, currentPrivilege }: PrivilegeCardProps) {
  const isUnlocked = privilegeIndex[level] <= currentPrivilege;

  return (
    <div
      className={`privilege-card ${
        isUnlocked ? "unlocked" : "locked"
      } ${level.toLowerCase()}`}
    >
      {!isUnlocked && <div className="status-icon">🔒</div>}
      <div className="privilege-card-content">
        <h4 className="card-title">{level}</h4>
        <p className="card-description">
          {isUnlocked
            ? `You've unlocked ${level} level!`
            : `Reach ${level} level by earning more points.`}
        </p>
      </div>
    </div>
  );
}

function ProfileDetail() {
  const { guestToken } = useSelector(
    (state: RootState) => state.GuestAuthState
  );
  const headers = {
    Authorization: `Bearer ${guestToken}`,
    "Content-Type": "application/json",
  };
  const [guestDetails, setGuestDetails] = useState<any>(null);
  const [ProfilePic, setProfilePic] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleEditButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  useEffect(() => {
    const fetchGuestData = async () => {
      try {
        const response = await guestAxios.get(API_URL.FETCH_GUEST_DETAILS, {
          headers,
        });

        setGuestDetails(response.data);
      } catch (error) {
        console.error("Failed to fetch guest details:", error);
      }
    };

    fetchGuestData();
  }, []);

  const handleProfilePicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const reader = new FileReader();

      reader.onload = async () => {
        const base64Image = reader.result as string;
        setProfilePic(base64Image);

        try {
          const response = await guestAxios.post(
            API_URL.UPLOAD_PROFILE_PIC,
            { image: base64Image },
            { headers: headers }
          );

          if (response && response.status === 200) {
            window.location.reload();
          }
        } catch (error) {
          console.error("Error uploading profile pic:", error);
        }
      };

      reader.onerror = (error) => {
        console.log("Error reading file:", error);
      };

      reader.readAsDataURL(file);
    }
  };

  const handleUsernameEdit = async () => {
    const { value: newUsername } = await Swal.fire({
      title: "Edit Username",
      input: "text",
      inputValue: guestDetails.username,
      showCancelButton: true,
      inputValidator: (value) => {
        if (!value) {
          return "Username is required!";
        }
      },
    });

    if (newUsername) {
      try {
        const response = await guestAxios.put(
          `${API_URL.UPDATE_USERNAME}`,
          { username: newUsername },
          { headers: headers }
        );

        if (response && response.status === 200) {
          setGuestDetails({
            ...guestDetails,
            username: newUsername,
          });
          Swal.fire("Updated!", "Your username has been updated.", "success");
          window.location.reload();
        } else {
          Swal.fire(
            "Error",
            "There was a problem updating your username.",
            "error"
          );
        }
      } catch (error) {
        Swal.fire(
          "Error",
          "There was a problem updating your username.",
          "error"
        );
        console.error("Error updating username:", error);
      }
    }
  };

  const handleAddAddress = async () => {
    const { value: formValues } = await Swal.fire({
      title: "Add Address",
      html:
        '<input id="swal-input1" class="swal2-input" placeholder="Line 1">' +
        '<input id="swal-input2" class="swal2-input" placeholder="Place">' +
        '<input id="swal-input3" class="swal2-input" placeholder="City">' +
        '<input id="swal-input4" class="swal2-input" placeholder="State">' +
        '<input id="swal-input5" class="swal2-input" placeholder="Country">' +
        '<input id="swal-input6" class="swal2-input" placeholder="PIN">',
      focusConfirm: false,
      preConfirm: () => {
        return {
          line1: (document.getElementById("swal-input1") as HTMLInputElement)
            .value,
          place: (document.getElementById("swal-input2") as HTMLInputElement)
            .value,
          city: (document.getElementById("swal-input3") as HTMLInputElement)
            .value,
          state: (document.getElementById("swal-input4") as HTMLInputElement)
            .value,
          country: (document.getElementById("swal-input5") as HTMLInputElement)
            .value,
          PIN: (document.getElementById("swal-input6") as HTMLInputElement)
            .value,
        };
      },
    });

    if (formValues) {
      try {
        const response = await guestAxios.put(
          `${API_URL.ADD_ADDRESS}`,
          formValues,
          {
            headers: headers,
          }
        );

        if (response && response.status === 200) {
          setGuestDetails({
            ...guestDetails,
            address: formValues,
          });
          Swal.fire("Added!", "Your address has been added.", "success");
        } else {
          Swal.fire("Error", "There was a problem adding your address.", "error");
        }
      } catch (error) {
        Swal.fire("Error", "There was a problem adding your address.", "error");
        console.error("Error updating address:", error);
      }
    }
  };


  return (
    <div className="profile-bg">
      <div className="profile-container">
        <div className="profile-header">
          <h2>Profile Details</h2>
        </div>

        {guestDetails ? (
          <div className="profile-content">
            <div className="profile-pic-wrapper">
              {guestDetails.profilePic ? (
                <>
                  <img
                    src={guestDetails.profilePic}
                    alt="Profile Pic"
                    className="profile-pic"
                  />
                  <label
                    htmlFor="profile-upload"
                    className="edit-profile-pic-btn"
                  >
                    <i className="fa fa-pencil"></i>
                  </label>
                </>
              ) : (
                <label
                  htmlFor="profile-upload"
                  className="profile-upload-label"
                >
                  +
                </label>
              )}
              <input
                type="file"
                id="profile-upload"
                onChange={handleProfilePicChange}
                style={{ display: "none" }}
              />
            </div>

            <div className="profile-row">
              <div className="profile-item">
                <h4>Username</h4>
                <div className="username-content">
                  <p>{guestDetails.username}</p>
                  <button
                    onClick={handleUsernameEdit}
                    className="edit-username-btn"
                  >
                    <i className="fa fa-pencil"></i>
                  </button>
                </div>
              </div>
              <div className="profile-item">
                <h4>Email</h4>
                <p>{guestDetails.email}</p>
              </div>
              <div className="profile-item">
                <h4>Phone</h4>
                <p>{guestDetails.phone}</p>
              </div>
              <div className="profile-item">
                <h4>Wallet</h4>
                <p>{guestDetails.Wallet}</p>
              </div>
            </div>
          </div>
        ) : (
          <p>Loading profile...</p>
        )}
      </div>
      <div className="details-container">
        <div className="privilege-section">
          {guestDetails && (
            <>
              <PrivilegeCard
                level="Bronze"
                currentPrivilege={guestDetails.privilege}
              />
              <PrivilegeCard
                level="Silver"
                currentPrivilege={guestDetails.privilege}
              />
              <PrivilegeCard
                level="Gold"
                currentPrivilege={guestDetails.privilege}
              />
              <PrivilegeCard
                level="Platinum"
                currentPrivilege={guestDetails.privilege}
              />
            </>
          )}
        </div>

        <div className="address-section">
          {guestDetails?.address ? (
            <div className="address-card">
              <div className="address-header">
                <h4 className="address-title">Address</h4>
                <button className="edit-address-btn" onClick={handleAddAddress}>
                  ✎
                </button>
              </div>
              <div className="address-details">
                <p>{guestDetails.address.line1}</p>
                {guestDetails.address.place && (
                  <p>{guestDetails.address.place}</p>
                )}
                <p>
                  {guestDetails.address.city}, {guestDetails.address.state}
                </p>
                <p>
                  {guestDetails.address.country}, {guestDetails.address.PIN}
                </p>
              </div>
            </div>
          ) : (
            <button onClick={handleAddAddress} className="add-address-btn">
              Add Address <span className="icon">+</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProfileDetail;
