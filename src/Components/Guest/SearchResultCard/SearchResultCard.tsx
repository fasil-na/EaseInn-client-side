import React, { useEffect, useState } from "react";
import "./SearchResultCard.css";
import { useLocation } from "react-router-dom";
import guestAxios from "../../../Axios/guestAxios";
import { API_URL } from "../../../Config/EndPoints";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../../Routes/Routing";
import {
  Card,
  CardHeader,
  CardMedia,
  CardContent,
  Typography,
} from "@material-ui/core";
import { Star as StarIcon } from "@material-ui/icons";

interface SearchResult {
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

function SearchResultCard() {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const itemsPerPage = 1;

  const [searchResult, setSearchResult] = useState<SearchResult[]>([]);

  const location = useLocation();
  const navigate = useNavigate();
  const {
    location: locationValue,
    checkInDate,
    checkOutDate,
    guestCount,
  } = location.state;

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const payload = {
          location: locationValue,
          checkInDate: checkInDate,
          checkOutDate: checkOutDate,
          guestCount: guestCount,
          page: currentPage,
          limit: itemsPerPage,
        };

        const response = await guestAxios.post(
          API_URL.FETCH_SEARCH_RESULTS,
          payload
        );

        
        setSearchResult(response.data.data);
        const totalItems = response.data.total;
        setTotalPages(Math.ceil(totalItems / itemsPerPage));
      } catch (error) {
        console.error("Failed to fetch requests:", error);
      }
    };
    fetchRequests();
  }, [currentPage]);

  const redirectToSearchResultDetailPage = (id: string) => {
    navigate(`${ROUTES.PUBLIC.GUEST_ROUTE.SEARCH_RESULTS_DETAIL}/${id}`, {
      state: {
        location: locationValue,
        checkInDate: checkInDate,
        checkOutDate: checkOutDate,
        guestCount: guestCount,
      },
    });
  };

  return (
    <div className="hotel-page-container">
      <h1 className="hotel-list-heading">Search Results</h1>

      <div className="grid-container">
        {searchResult.map((hotel) => (
          <Card
            key={hotel._id}
            className="card"
            onClick={() => redirectToSearchResultDetailPage(hotel._id)}
          >
            <CardMedia
              component="img"
              className="card-media"
              image={hotel.hotelImageLinks[0]}
              alt={hotel.hotelName}
            />
            <CardHeader title={hotel.hotelName} className="card-header" />
            <CardContent className="card-content">
              <Typography variant="h6" component="p" color="textSecondary">
                {hotel.city},
              </Typography>
              <Typography variant="body2" component="p" color="textSecondary">
                {hotel.state}, {hotel.place}
              </Typography>

              
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="pagination-controls">
        <button
          className="pagination-button"
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span className="page-indicator">
          {currentPage} / {totalPages}
        </span>
        <button
          className="pagination-button"
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default SearchResultCard;
