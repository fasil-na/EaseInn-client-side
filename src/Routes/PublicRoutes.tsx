import React from 'react';
import { ROUTES } from './Routing';
import OTP from '../Pages/Guest/OTP/OTP';
import HomeNoToken from '../Pages/Guest/HomeNoToken/HomeNoToken';
import Login from '../Pages/Guest/Login/Login';
import { Routes, Route } from 'react-router-dom';
import Signup from '../Pages/Guest/Signup/Signup';
import OTP_Host from '../Pages/Host/OTP_Host/OTP_Host';
import HostSignup from '../Pages/Host/HostSignup/HostSignup';
import HostLogin from '../Pages/Host/HostLogin/HostLogin';
import AdminLogin from '../Pages/Admin/AdminLogin/AdminLogin';
import ForgotPass from '../Pages/Guest/ForgotPass/ForgotPass';
import ForgotPassOTP from '../Pages/Guest/ForgotPassOTP/ForgotPassOTP';
import ResetPass from '../Pages/Guest/ResetPass/ResetPass';
import ForgotPassHost from '../Pages/Host/ForgotPassHost/ForgotPassHost';
import ForgotPassOTPHost from '../Pages/Host/ForgotPassOTPHost/ForgotPassOTPHost';
import ResetPassHost from '../Pages/Host/ResetPassHost/ResetPassHost';
import HotelDetailPageNoToken from '../Pages/Guest/HotelDetailPageNoToken/HotelDetailPageNoToken';
import SearchResultPageNoToken from '../Pages/Guest/SearchResultDetailNoToken/SearchResultDetailNoToken';
import SearchResultDetailNoToken from '../Pages/Guest/SearchResultDetailNoToken/SearchResultDetailNoToken';

function PublicRoutes() {
  const { PUBLIC } = ROUTES;
  return (
    <>
      <Routes>
        <Route path={PUBLIC.GUEST_ROUTE.HOME} element={<HomeNoToken />} />
        <Route path={PUBLIC.GUEST_ROUTE.LOG_IN} element={<Login />} />
        <Route path={PUBLIC.GUEST_ROUTE.SIGN_UP} element={<Signup />} />
        <Route path={PUBLIC.GUEST_ROUTE.OTP} element={<OTP />} />
        <Route path={PUBLIC.GUEST_ROUTE.FORGOT_PASS} element={<ForgotPass />} />
        <Route path={PUBLIC.GUEST_ROUTE.FORGOT_PASS_OTP} element={<ForgotPassOTP />} />
        <Route path={PUBLIC.GUEST_ROUTE.RESET_PASS} element={<ResetPass />} />
        <Route path={`${PUBLIC.GUEST_ROUTE.HOTEL_DETAIL_PAGE}/:id`} element={<HotelDetailPageNoToken />} />
        <Route path={PUBLIC.GUEST_ROUTE.SEARCH_RESULTS} element={< SearchResultPageNoToken/>} />
        <Route path={`${PUBLIC.GUEST_ROUTE.SEARCH_RESULTS_DETAIL}/:id`} element={< SearchResultDetailNoToken/>} />




        <Route path={PUBLIC.HOST_ROUTE.OTP} element={<OTP_Host />} />
        <Route path={PUBLIC.HOST_ROUTE.LOG_IN} element={<HostLogin />} />
        <Route path={PUBLIC.HOST_ROUTE.SIGN_UP} element={<HostSignup />} />
        <Route path={PUBLIC.HOST_ROUTE.FORGOT_PASS_HOST} element={<ForgotPassHost />} />
        <Route path={PUBLIC.HOST_ROUTE.FORGOT_PASS_OTP_HOST} element={<ForgotPassOTPHost />} />
        <Route path={PUBLIC.HOST_ROUTE.RESET_PASS_HOST} element={<ResetPassHost />} />

        <Route path={PUBLIC.ADMIN_ROUTE.LOG_IN} element={<AdminLogin />} />
      </Routes>
      
    </>
  );
}

export default PublicRoutes;
