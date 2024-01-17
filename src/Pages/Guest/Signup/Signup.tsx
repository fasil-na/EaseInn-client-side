import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import guestAxios from "../../../Axios/guestAxios";
import { API_URL } from "../../../Config/EndPoints";
import { ROUTES } from "../../../Routes/Routing";
import axios from "axios";
import {
  isValidEmail,
  isValidPhone,
  isValidPassword,
  isValidUsername,
  passwordsMatch,
} from "../../../Utils/SignupValidation";
import {
  Button,
  TextField,
  Grid,
  Paper,
  Typography,
  Link,
  Box,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";

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

const Signup = () => {
  const { PUBLIC } = ROUTES;

  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isValid, setIsValid] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [isTouched, setIsTouched] = useState(false);
  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPassword, setconfirmPassword] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [error, setError] = useState("");

  const validateEmail = () => {
    if (!isValidEmail(email)) {
      setEmailError("Please enter a valid email address");
      setIsValid(false);
    } else {
      setEmailError("");
    }
  };

  const validatePhone = () => {
    if (!isValidPhone(phone)) {
      setPhoneError(
        "Phone number must only contain digits and must be exactly 10 digits long"
      );
      setIsValid(false);
    } else {
      setPhoneError("");
    }
  };

  const validateUsername = () => {
    if (!isValidUsername(username)) {
      setUsernameError(
        "Username must contain only alphabets and must be at least 4 characters long"
      );
      setIsValid(false);
    } else {
      setUsernameError("");
    }
  };

  const validatePassword = () => {
    if (!isValidPassword(password)) {
      setPasswordError("Password must be at least 8 characters long");
      setIsValid(false);
    } else {
      setPasswordError("");
    }
  };

  const validateConfirmPassword = () => {
    if (!passwordsMatch(password, confirmPassword)) {
      setConfirmPasswordError("Passwords do not match");
      setIsValid(false);
    } else {
      setConfirmPasswordError("");
    }
  };

  const validateAll = () => {
    validateEmail();
    validatePhone();
    validateUsername();
    validatePassword();
    validateConfirmPassword();

    if (
      isValidEmail(email) &&
      isValidPhone(phone) &&
      isValidUsername(username) &&
      isValidPassword(password) &&
      passwordsMatch(password, confirmPassword)
    ) {
      setIsValid(true);
    }
  };

  useEffect(() => {
    if (isTouched) {
      validateAll();
    }
  }, [email, phone, username, password, confirmPassword, isTouched]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    validateAll();
    if (!isValid) {
      return;
    }

    const payload = {
      username,
      email,
      phone,
      password,
    };
    try {
      const otpSend = await guestAxios.post(API_URL.SEND_OTP, payload);
      if (otpSend) {
        navigate(PUBLIC.GUEST_ROUTE.OTP);
      }
    } catch (e) {
      if (axios.isAxiosError(e)) {
        setError(e.response?.data?.error || "An error occurred");
      } else {
        setError("An error occurred");
      }
      console.log(e);
    }
  };

  return (
    <>
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
            <span className="text-primary display-6 ">Ease</span>
            <span className="text-warning display-6 ">Inn</span>
          </Typography>
          <Grid
            container
            justifyContent="flex-end"
            sx={{ width: { xs: "90%", sm: "60%", md: "40%" }, mt: 2, mb: 2 }}
          >
            <Grid item>
              <Link
                onClick={() => {
                  navigate(PUBLIC.HOST_ROUTE.SIGN_UP);
                }}
                variant="body2"
                underline="hover"
              >
                {"Are you a host?"}
              </Link>
            </Grid>
          </Grid>
          <Paper
            elevation={6}
            sx={{ padding: 3, width: { xs: "90%", sm: "60%", md: "40%" } }}
          >
            <Box
              component="form"
              onSubmit={handleSubmit}
              noValidate
              sx={{ display: "flex", flexDirection: "column", m: 1 }}
            >
              <Typography variant="h5" component="h2" gutterBottom>
                Guest Sign Up
              </Typography>
              <TextField
                error={!!usernameError}
                helperText={usernameError}
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="username"
                label="Username"
                name="username"
                autoFocus
                value={username}
                onBlur={() => {
                  validateUsername();
                  setIsTouched(true);
                }}
                onChange={(e) => setUsername(e.target.value)}
              />
              <TextField
                error={!!emailError}
                helperText={emailError}
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
                value={email}
                onBlur={() => {
                  validateEmail();
                  setIsTouched(true);
                }}
                onChange={(e) => setEmail(e.target.value)}
              />
              <TextField
                error={!!phoneError}
                helperText={phoneError}
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="number"
                label="Mobile Number"
                name="number"
                value={phone}
                onBlur={() => {
                  validatePhone();
                  setIsTouched(true);
                }}
                onChange={(e) => setPhone(e.target.value)}
              />
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    error={!!passwordError}
                    helperText={passwordError}
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    name="password"
                    label="Password"
                    type="password"
                    id="password"
                    autoComplete="current-password"
                    value={password}
                    onBlur={() => {
                      validatePassword();
                      setIsTouched(true);
                    }}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    error={!!confirmPasswordError}
                    helperText={confirmPasswordError}
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    name="confirm_password"
                    label="Confirm Password"
                    type="password"
                    id="confirm_password"
                    autoComplete="current-password"
                    value={confirmPassword}
                    onBlur={() => {
                      validateConfirmPassword();
                      setIsTouched(true);
                    }}
                    onChange={(e) => setconfirmPassword(e.target.value)}
                  />
                </Grid>
              </Grid>

              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                sx={{ mt: 3, mb: 2 }}
                disabled={!isValid}
              >
                Sign Up
              </Button>
              <Grid container justifyContent="center">
                {error && (
                  <Grid item>
                    <Typography variant="body2" color="error">
                      {error}
                    </Typography>
                  </Grid>
                )}

                <Grid item>
                  <Link
                    onClick={() => {
                      navigate(PUBLIC.GUEST_ROUTE.LOG_IN);
                    }}
                    variant="body2"
                    underline="hover"
                  >
                    {"Already have an account ? back to login"}
                  </Link>
                </Grid>
              </Grid>
            </Box>
          </Paper>
        </Box>
      </ThemeProvider>
    </>
  );
};

export default Signup;
