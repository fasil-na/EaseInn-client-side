import React, { useEffect, useState } from "react";
import "./SearchBox.css";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../../Routes/Routing";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { API_URL } from "../../../Config/EndPoints";
import guestAxios from "../../../Axios/guestAxios";

interface Hotels {
  _id: string;
  hotelName: string;
  hotelRating: number;
  email: string;
  phone: string;
  hotelImageLinks: string[];
  state: string;
  place: string;
  city: string;
}

function SearchBox() {
  const navigate = useNavigate();

  const today = new Date().toISOString().split("T")[0];
  const [checkInDate, setCheckInDate] = useState(today);
  const [checkOutDate, setCheckOutDate] = useState(
    new Date(new Date(today).getTime() + 86400000).toISOString().split("T")[0]
  );
  const [guestCount, setGuestCount] = useState(1);
  const [hotels, setHotels] = useState<Hotels[]>([]);
  const [locationSuggestions, setLocationSuggestions] = useState<string[]>([]);

  useEffect(() => {
    const newCheckoutMinDate = new Date(
      new Date(checkInDate).getTime() + 86400000
    ).toISOString().split("T")[0];
    setCheckOutDate(newCheckoutMinDate);
  }, [checkInDate]);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await guestAxios.get(API_URL.FETCH_HOTELS);
        setHotels(response.data);
      } catch (error) {
        console.error("Failed to fetch requests:", error);
      }
    };
    fetchRequests();
  }, []);

  const handleLocationInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value.toLowerCase();

    const matchedSuggestions = new Set<string>();

    hotels.forEach((hotel) => {
      if (hotel.city.toLowerCase().includes(inputValue))
        matchedSuggestions.add(hotel.city);

      if (hotel.state.toLowerCase().includes(inputValue))
        matchedSuggestions.add(hotel.state);
    });

    setLocationSuggestions(Array.from(matchedSuggestions));
  };

  const handleguestChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const count = parseInt(e.target.value, 10);
    if (count < 1) {
      setGuestCount(1);
    } else {
      setGuestCount(count);
    }
  };

  const loadSearchResult = () => {
    const locationValue = (
      document.querySelector(".input-location") as HTMLInputElement
    )?.value;
    if (!locationValue) {
      toast.error("Please enter a location");
      return;
    }
    navigate(ROUTES.PUBLIC.GUEST_ROUTE.SEARCH_RESULTS, {
      state: {
        location: locationValue,
        checkInDate: checkInDate,
        checkOutDate: checkOutDate,
        guestCount: guestCount,
      },
    });
  };

  return (
    <div className="search-box">
      <input
        type="text"
        placeholder="Location"
        className="input-location"
        list="location-list" 
        onChange={handleLocationInput}
      />
      <datalist id="location-list">
        {locationSuggestions.map((suggestion, index) => (
          <option key={index} value={suggestion} />
        ))}
      </datalist>{" "}
      <input
        type="date"
        placeholder="Check-in"
        className="input-date"
        min={today}
        value={checkInDate}
        onChange={(e) => setCheckInDate(e.target.value)}
      />
      <input
        type="date"
        placeholder="Check-out"
        className="input-date"
        min={checkOutDate}
        value={checkOutDate}
        onChange={(e) => setCheckOutDate(e.target.value)}
      />
      <div className="guest-input">
        <label>Guest</label>
        <input
          type="number"
          min="1"
          value={guestCount}
          onChange={handleguestChange}
          className="input-count"
        />
      </div>
      <button className="search-button" onClick={loadSearchResult}>
        Search
      </button>
    </div>
  );
}

export default SearchBox;
