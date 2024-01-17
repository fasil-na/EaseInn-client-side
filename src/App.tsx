import "./App.css";
import React, { useEffect } from "react";

import PublicRoutes from "./Routes/PublicRoutes";
import { RootState } from "./Redux/Reducer/index";
import { useSelector, useDispatch } from "react-redux";
import HostPrivateRoutes from "./Routes/HostPrivateRoutes";
import GuestPrivateRoutes from "./Routes/GuestPrivateRoutes";
import AdminPrivateRoutes from "./Routes/AdminPrivateRoutes";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import { hostAuthAction } from "./Redux/Container/hostAuth.slice";
import { adminAuthAction } from "./Redux/Container/adminAuth.slice";
import { guestAuthAction } from "./Redux/Container/guestAuth.slice";
import { ToastContainer } from 'react-toastify';
import GoogleFont from 'react-google-font-loader';
function App() {
  const dispatch = useDispatch();
  const { guestRole, guestToken } = useSelector((state: RootState) => state.GuestAuthState);
  const { hostRole, hostToken } = useSelector((state: RootState) => state.HostAuthState);
  const { adminRole, adminToken } = useSelector((state: RootState) => state.AdminAuthState);

  const loadTokenFromLocalStorage = () => {
    const guestToken = localStorage.getItem("guestToken");
    const guestRole = localStorage.getItem("guestRole");

    const hostToken = localStorage.getItem("hostToken");
    const hostRole = localStorage.getItem("hostRole");

    const adminToken = localStorage.getItem("adminToken");
    const adminRole = localStorage.getItem("adminRole");
  
    if (guestToken && guestRole) {
      dispatch(guestAuthAction.setGuestLogin({ guestToken, guestRole }));
    }

    if (hostToken && hostRole) {
      dispatch(hostAuthAction.setHostLogin({ hostToken, hostRole }));
    }

    if (adminToken && adminRole) {
      dispatch(adminAuthAction.setAdminLogin({ adminToken, adminRole }));
    }
  };

  useEffect(() => {
    loadTokenFromLocalStorage();
  }, []);

  return(
    <>
    <ToastContainer />
    {
      guestRole === 'Guest' && guestToken !== ""
        ? <GuestPrivateRoutes />
        : hostRole === 'Host' && hostToken !== ""
          ? <HostPrivateRoutes />
          : adminRole === 'Admin' && adminToken !== ""
            ? <AdminPrivateRoutes />
            : <PublicRoutes />
    }
  </>
  )
}



export default App;
