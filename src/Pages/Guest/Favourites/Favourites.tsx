import React from "react";
import HeaderwithToken from "../../../Components/Guest/HeaderwithToken/HeaderwithToken";
import FavouriteHotelCards from "../../../Components/Guest/FavouriteHotelCards/FavouriteHotelCards";

function Favourites() {
  return (
    <div>
      <HeaderwithToken />
      <FavouriteHotelCards/>
    </div>
  );
}

export default Favourites;
