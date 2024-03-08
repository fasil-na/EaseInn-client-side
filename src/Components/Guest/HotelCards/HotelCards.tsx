import React, { useEffect, useState } from "react";
import { API_URL } from "../../../Config/EndPoints";
import guestAxios from "../../../Axios/guestAxios";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../../Routes/Routing";
import {
  Card,
  CardHeader,
  CardMedia,
  CardContent,
  Typography,
} from "@material-ui/core";
import { IconButton } from "@material-ui/core";
import { Favorite as FavoriteIcon } from "@material-ui/icons";
import "./HotelCards.css";
import { useSelector } from "react-redux";
import { RootState } from "../../../Redux/Reducer/index";
import StarRating from "../StarRating/StarRating";

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
  reviews: Array<{ bookingId: string; comment: string; guestId: string; rating: number; _id: string }>; 
}

function HotelCards() {
  const { guestToken } = useSelector(
    (state: RootState) => state.GuestAuthState
  );
  const headers = {
    Authorization: `Bearer ${guestToken}`,
    "Content-Type": "application/json",
  };

  const [hotels, setHotels] = useState<Hotels[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const navigate = useNavigate();
  const { PUBLIC } = ROUTES;

  const calculateAverageRating = (reviews: any[]) => {
    if (reviews.length === 0) {
      return 0;
    }

    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    return totalRating / reviews.length;
  };

  const isFavorite = (id: string) => favorites.includes(id);

  const addOrRemoveFromFavourites = async (id: string) => {
    try {
      const response = await guestAxios.post(
        API_URL.ADD_OR_REMOVE_FROM_FAVOURITES,
        { hotelId: id },
        { headers }
      );
      setFavorites((prevFavorites) => {
        if (isFavorite(id)) {
          return prevFavorites.filter((favId) => favId !== id);
        } else {
          return [...prevFavorites, id];
        }
      });
    } catch (error) {
      console.error("Failed to add/remove from favorites:", error);
    }
  };

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await guestAxios.get(API_URL.FETCH_HOTELS);
        setHotels(response.data);
      } catch (error) {
        console.error("Failed to fetch requests:", error);
      }
    };

    const fetchGuestDetails = async () => {
      try {
        const response = await guestAxios.get(API_URL.FETCH_GUEST_DETAILS, {
          headers,
        });
        setFavorites(response.data.favoriteHotels);
      } catch (error) {
        console.error("Failed to fetch guest details:", error);
      }
    };

    fetchRequests();
    fetchGuestDetails();
  }, []);

  const filteredHotels = hotels.filter((hotel) => {
    const avgRating = calculateAverageRating(hotel.reviews);
    return avgRating > 3;
  });


  return (
    <div className="hotel-page-container">
      <h1 className="hotel-list-heading">Top Rated Hotels</h1>

      <div className="grid-container">
        {filteredHotels.map((hotel) => (
         <Card key={hotel._id} className="card" onClick={() => navigate(`${PUBLIC.GUEST_ROUTE.HOTEL_DETAIL_PAGE}/${hotel._id}`)}>
         <CardMedia component="div" className="card-media" style={{ backgroundImage: `url(${hotel.hotelImageLinks[0]})` }}>
           <IconButton className="favorite-icon" onClick={(event) => { event.stopPropagation(); addOrRemoveFromFavourites(hotel._id); }}>
             {isFavorite(hotel._id) ? (<FavoriteIcon style={{ color: "red" }} />) : (<FavoriteIcon style={{ color: "white" }} />)}
           </IconButton>
         </CardMedia>
         <CardHeader title={hotel.hotelName} className="card-header" />
         <CardContent className="card-content">
           <div className="city-state">
             <Typography variant="body2" color="textSecondary" component="p">
               {hotel.city}, {hotel.state}
             </Typography>
           </div>
           <div className="rating">
                <StarRating rating={calculateAverageRating(hotel.reviews)} />
              </div>
         </CardContent>
       </Card>
        ))}
      </div>
    </div>
  );
}

export default HotelCards;
