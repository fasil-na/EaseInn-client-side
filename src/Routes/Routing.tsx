export const ROUTES = {
  PRIVATE: {
    NOT_FOUND: "/404",
    ADMIN_ROUTE: {
      DASHBOARD: "/admin/dashboard",
      GUESTS: '/admin/guests',
      HOTELS:'/admin/hotels',
      REQUESTS:'/admin/requests',
      REQUEST_DETAILS:'/admin/requestDetails',
      BOOKINGS_OF_GUEST:'/admin/bookingsOfGuest',
      BOOKINGS_OF_HOST:'/admin/bookingsOfHost',
    },
    HOST_ROUTE: {
      HOME: "/host/home",
      EDIT_DETAILS: "/host/editDetails",
      BOOKINGS: "/host/bookings",

    },
    GUEST_ROUTE: {
      HOME: "/",
      HOTEL_DETAIL_PAGE:'/hotelDetailPage',
      SEARCH_RESULTS:'/searchResults',
      SEARCH_RESULTS_DETAIL:'/searchResultDetail',
      USER_PROFILE:'/userProfile',
      FAVOURITES:'/favourites',
      BOOKINGS:'/bookings',
    },
  },
  PUBLIC: {
    GUEST_ROUTE: {
      HOME: "/",
      HOTEL_DETAIL_PAGE:'/hotelDetailPage',
      SEARCH_RESULTS:'/searchResults',
      SEARCH_RESULTS_DETAIL:'/searchResultDetail',
      LOG_IN: "/login",
      SIGN_UP: "/signup",
      OTP: "/otp",
      FORGOT_PASS: "/forgot_pass",
      FORGOT_PASS_OTP: "/forgot_pass_otp",
      RESET_PASS: "/reset_pass",
    },
    HOST_ROUTE: {
      LOG_IN: "/host",
      SIGN_UP: "/host/signup",
      OTP: "/host/otp",
      FORGOT_PASS_HOST: "/host/forgot_pass_host",
      FORGOT_PASS_OTP_HOST: "/host/forgot_pass_otp_host",
      RESET_PASS_HOST: "/host/reset_pass_host",
    },
    ADMIN_ROUTE: {
      LOG_IN: "/admin",
    },
  },
};
