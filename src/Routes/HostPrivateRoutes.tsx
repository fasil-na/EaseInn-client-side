import React from "react";
import { ROUTES } from "./Routing";
import { useSelector } from "react-redux";
import { Routes, Route } from "react-router-dom";
import NotFound from "../Pages/NotFound/NotFound";
import { RootState } from "../Redux/Reducer/index";
import HostHome from '../Pages/Host/HostHome/HostHome'
import EditHostDetails from "../Pages/Host/EditHostDetails/EditHostDetails";
import Bookings from "../Pages/Host/Bookings/Bookings";

function HostPrivateRoutes() {

  const { PRIVATE } = ROUTES;
  
  const { hostRole } = useSelector((state: RootState) => state.HostAuthState);
  
  return (
    <Routes>
      {hostRole === "Host" ? (
        <>
           <Route path={PRIVATE.HOST_ROUTE.HOME} element={<HostHome />} />
           <Route path={PRIVATE.HOST_ROUTE.EDIT_DETAILS} element={<EditHostDetails />} />
           <Route path={PRIVATE.HOST_ROUTE.BOOKINGS} element={<Bookings />} />
        </>
      )  : null} 
      <Route path="*" element={<NotFound />} />
    </Routes> 
  );
}

export default HostPrivateRoutes;


