import React from "react";
import { ROUTES } from "./Routing";
import { useSelector } from "react-redux";
import { Routes, Route } from "react-router-dom";
import NotFound from "../Pages/NotFound/NotFound";
import { RootState } from "../Redux/Reducer/index";
import AdminDashboard from "../Pages/Admin/AdminDashboard/AdminDashboard";
import GuestList from "../Pages/Admin/GuestList/GuestList";
import HotelList from "../Pages/Admin/HotelList/HotelList";
import RequestList from "../Pages/Admin/RequestList/RequestList";
import RequestDetails from "../Pages/Admin/RequestDetails/RequestDetails";
import BookingsOfGuest from "../Pages/Admin/BookingsOfGuest/BookingsOfGuest";

function AdminPrivateRoutes() {
  const { PRIVATE } = ROUTES;
  const { adminRole } = useSelector((state: RootState) => state.AdminAuthState);
  
  return (
    <Routes>
      {adminRole === "Admin" ? (
        <>
          <Route path={PRIVATE.ADMIN_ROUTE.DASHBOARD} element={<AdminDashboard />} />
          <Route path={PRIVATE.ADMIN_ROUTE.GUESTS} element={<GuestList />} />
          <Route path={PRIVATE.ADMIN_ROUTE.HOTELS} element={<HotelList />} />
          <Route path={PRIVATE.ADMIN_ROUTE.REQUESTS} element={<RequestList />} />
          <Route path={`${PRIVATE.ADMIN_ROUTE.REQUEST_DETAILS}/:id`} element={<RequestDetails />} />
          <Route path={`${PRIVATE.ADMIN_ROUTE.BOOKINGS_OF_GUEST}/:id`} element={<BookingsOfGuest />} />
        </>
      )  : null} 
      <Route path="*" element={<NotFound />} />
    </Routes>

    
  );
}

export default AdminPrivateRoutes;


