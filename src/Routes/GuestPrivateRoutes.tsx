import React from "react";
import { ROUTES } from "./Routing";
import { useSelector } from "react-redux";
import { Routes, Route } from "react-router-dom";
import NotFound from "../Pages/NotFound/NotFound";
import { RootState } from "../Redux/Reducer/index";
import HomewithToken from "../Pages/Guest/HomewithToken/HomewithToken";
import HotelDetailPageWithToken from "../Pages/Guest/HotelDetailPageWithToken/HotelDetailPageWithToken";
import SearchResultPageWithToken from "../Pages/Guest/SearchResultPageWithToken/SearchResultPageWithToken";
import SearchResultDetailWithToken from "../Pages/Guest/SearchResultDetailWithToken/SearchResultDetailWithToken";
import Profile from "../Pages/Guest/Profile/Profile";
import Favourites from "../Pages/Guest/Favourites/Favourites";
import Bookings from "../Pages/Guest/Bookings/Bookings";

function GuestPrivateRoutes() {
  const { PRIVATE } = ROUTES;
  const { guestRole } = useSelector((state: RootState) => state.GuestAuthState);
  
  return (
    <Routes>
      {guestRole === "Guest" ? (
        <>
           <Route path={PRIVATE.GUEST_ROUTE.HOME} element={<HomewithToken />} />
           <Route path={`${PRIVATE.GUEST_ROUTE.HOTEL_DETAIL_PAGE}/:id`} element={<HotelDetailPageWithToken />} />
           <Route path={PRIVATE.GUEST_ROUTE.SEARCH_RESULTS} element={<SearchResultPageWithToken />} />
           <Route path={`${PRIVATE.GUEST_ROUTE.SEARCH_RESULTS_DETAIL}/:id`} element={<SearchResultDetailWithToken />} />
           <Route path={PRIVATE.GUEST_ROUTE.USER_PROFILE} element={<Profile />} />
           <Route path={PRIVATE.GUEST_ROUTE.FAVOURITES} element={<Favourites />} />
           <Route path={PRIVATE.GUEST_ROUTE.BOOKINGS} element={<Bookings />} />


        </>
      ) : null} 
      <Route path="*" element={<NotFound />} />
    </Routes>


  );
}

export default GuestPrivateRoutes;


