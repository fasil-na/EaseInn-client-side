import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
import { API_URL } from "../../../Config/EndPoints";
import guestAxios from "../../../Axios/guestAxios";
import { ROUTES } from "../../../Routes/Routing";
import {
  isValidPassword,
  passwordsMatch,
} from "../../../Utils/SignupValidation";

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

const ResetPass = () => {
  
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPassword, setconfirmPassword] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [isTouched, setIsTouched] = useState(false);
  const [isValid, setIsValid] = useState(false);

  const navigate = useNavigate();

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
    validatePassword();
    validateConfirmPassword();

    if (
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
  }, [ password, confirmPassword, isTouched]);


  const { PUBLIC } = ROUTES;

  const passwordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    validateAll();
    if (!isValid) {
      return;
    }
    const payload = {
      password,
    };
    try {      
      const resetPassword = await guestAxios.post(API_URL.RESET_PASS, payload);
      if (resetPassword.data.success) {
        navigate(PUBLIC.GUEST_ROUTE.LOG_IN);
      }
    } catch (e) {
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
            <span className="text-primary display-6">Ease</span>
            <span className="text-warning display-6">Inn</span>
          </Typography>
          <Grid
            container
            justifyContent="flex-end"
            sx={{ width: { xs: "90%", sm: "60%", md: "40%" }, mt: 2, mb: 2 }}
          >
           
          </Grid>
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
              onSubmit={passwordReset}
              noValidate
              sx={{ display: "flex", flexDirection: "column", m: 1 }}
            >
              <Typography variant="h5" component="h2" gutterBottom>
                Reset password
              </Typography>
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
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                sx={{ mt: 3, mb: 2 }}
                disabled={!isValid}
              >
                Submit
              </Button>
              
            </Box>
          </Paper>
        </Box>
      </ThemeProvider>
    </>
  );
};

export default ResetPass;
