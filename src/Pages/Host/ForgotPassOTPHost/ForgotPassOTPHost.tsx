import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import hostAxios from "../../../Axios/hostAxios";
import { ROUTES } from "../../../Routes/Routing";
import { Button, TextField, Paper, Typography, Box } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { API_URL } from "../../../Config/EndPoints";
import { AxiosError } from "axios";
import AccessTimeIcon from "@mui/icons-material/AccessTime";

const ForgotPassOTPHost = () => {
  const theme = createTheme({
    palette: {
      primary: {
        main: "#1976d2",
      },
      secondary: {
        main: "#fff",
      },
    },
    typography: {
      fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
      fontWeightLight: 300,
      fontWeightRegular: 400,
      fontWeightMedium: 500,
    },
  });

  const navigate = useNavigate();

  const handleResendOTP = async () => {
    const response = await hostAxios.get(API_URL.FORGOT_PASS_HOST_RESEND_OTP);
    if (response) {
      window.location.reload();
    }
  };

  const [errorMessage, setErrorMessage] = useState("");
  const [otp, setOTP] = useState(Array(6).fill(""));

  const savedCountdownValue = Number(
    localStorage.getItem("hostForgotPassCountdownValue")
  );
  const countdownEndTimestamp = Number(
    localStorage.getItem("hostForgotPassCountdownEndTimestamp")
  );

  const remainingTime = countdownEndTimestamp
  ? Math.floor((countdownEndTimestamp - Date.now()) / 1000)
  : null;
const initialCountdown =
  remainingTime && remainingTime > 0 ? remainingTime : 60;
const [countdown, setCountdown] = useState(initialCountdown);

useEffect(() => {
  const interval = setInterval(() => {
    setCountdown((prevCountdown) => {
      if (prevCountdown <= 1) {
        clearInterval(interval);
        return 0;
      }
      return prevCountdown - 1;
    });
  }, 1000);
  return () => clearInterval(interval);
}, []);

useEffect(() => {
  if (countdown > 0) {
    localStorage.setItem("hostForgotPassCountdownValue", String(countdown));
    localStorage.setItem(
      "hostForgotPassCountdownEndTimestamp",
      String(Date.now() + countdown * 1000)
    );
  } else {
    localStorage.removeItem("hostForgotPassCountdownValue");
    localStorage.removeItem("hostForgotPassCountdownEndTimestamp");
  }
}, [countdown]);

  const verifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      otp: otp.join(""),
    };

    try {
      const response = await hostAxios.post(
        API_URL.FORGOT_PASS_HOST_VERIFY_OTP,
        payload
      );
      if (response.data.success) {
        localStorage.removeItem("hostForgotPassCountdownValue");
        localStorage.removeItem("hostForgotPassCountdownEndTimestamp");
        navigate(ROUTES.PUBLIC.HOST_ROUTE.RESET_PASS_HOST);
      }else {
        setErrorMessage(response.data.message);
      }
    } catch (e) {
      const error = e as AxiosError;
      if (error.response) {
        setErrorMessage((error.response.data as any).message);
      } else if (error.request) {
        setErrorMessage(
          "No response from server. Please check your network connection."
        );
      } else {
        setErrorMessage(error.message);
      }
    }
  };

  const handleChange = (
    elementIndex: number,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newOtp = [...otp];
    if (event.target.validity.valid && /^[0-9]*$/g.test(event.target.value)) {
      newOtp[elementIndex] = event.target.value;
      setOTP(newOtp);
    }
  };

  return (
      <ThemeProvider theme={theme}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            minHeight: "100vh",
            alignItems: "center",
            justifyContent: "center",
            bgcolor: "secondary.main",
            color: "white",
            px: 3,
            py: 5,
          }}
        >
          <Typography variant="h4" component="h1" gutterBottom>
            <span className="text-primary display-6">Ease</span>
            <span className="text-warning display-6">Inn</span>
          </Typography>
          <Paper
            elevation={6}
            sx={{
              padding: 3,
              width: { xs: "90%", sm: "60%", md: "40%" },
              mt: 3,
            }}
          >
            <Box
              component="form"
              onSubmit={verifyOTP}
              noValidate
              sx={{
                display: "flex",
                flexDirection: "column",
                m: 1,
                alignItems: "center",
              }}
            >
              <Typography variant="h5" component="h2" gutterBottom>
                Enter OTP
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  width: "100%",
                  maxWidth: "300px",
                  marginBottom: "20px",
                  gap: "5px",
                }}
              >
                {otp.map((digit, index) => (
                  <TextField
                    key={index}
                    variant="outlined"
                    margin="normal"
                    required
                    id={`otp-${index}`}
                    name={`otp-${index}`}
                    value={digit}
                    inputProps={{
                      maxLength: 1,
                      style: { textAlign: "center" },
                    }}
                    inputMode="numeric"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      handleChange(index, e)
                    }
                  />
                ))}
              </Box>

               {errorMessage && (
              <Typography color="error">{errorMessage}</Typography>
            )}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              sx={{ mt: 3, mb: 2, maxWidth: "300px" }}
            >
              Verify OTP
            </Button>
            <Box
              display="flex"
              alignItems="center"
              justifyContent="center"
              sx={{ gap: 1 }}
            >
              {countdown > 0 ? (
                <>
                  <AccessTimeIcon color="primary" fontSize="small" />
                  <Typography variant="h6" component="h3">
                    00:{countdown < 10 ? `0${countdown}` : countdown}
                  </Typography>
                </>
              ) : (
                <Typography
                  variant="body1"
                  component="a"
                  onClick={handleResendOTP}
                  sx={{ cursor: "pointer", textDecoration: "underline" }}
                >
                  Resend OTP
                </Typography>
              )}
            </Box>
            </Box>
          </Paper>
        </Box>
      </ThemeProvider>
  );
};

export default ForgotPassOTPHost;
