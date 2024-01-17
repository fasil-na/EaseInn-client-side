import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { guestAuthAction } from "../../../Redux/Container/guestAuth.slice";
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
import axios from "axios";

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

const Login = () => {
  
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { PUBLIC } = ROUTES;

  const LoginHandle = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      email,
      password,
    };
    try {
      const LoginCheck = await guestAxios.post(API_URL.LOGIN, payload);
      if (LoginCheck) {
        const payload = {
          guestToken: LoginCheck.data.token,
          guestRole: LoginCheck.data.userData.role,
        };
        dispatch(guestAuthAction.setGuestLogin(payload));
        navigate(PUBLIC.GUEST_ROUTE.HOME);
      }
    } catch (e) {
      if (axios.isAxiosError(e)) {
        setError(e.response?.data?.message || 'An error occurred');
      } else {
        setError('An error occurred');
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
            <span className="text-primary display-6">Ease</span>
            <span className="text-warning display-6">Inn</span>
          </Typography>
          <Grid
            container
            justifyContent="flex-end"
            sx={{ width: { xs: "90%", sm: "60%", md: "40%" }, mt: 2, mb: 2 }}
          >
            <Grid item>
              <Link
                onClick={() => {
                  navigate("/host");
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
            sx={{
              padding: 3,
              width: { xs: "90%", sm: "60%", md: "40%" },
              mt: 3,
            }}
          >
            <Box
              component="form"
              onSubmit={LoginHandle}
              noValidate
              sx={{ display: "flex", flexDirection: "column", m: 1 }}
            >
              <Typography variant="h5" component="h2" gutterBottom>
                Guest Log In
              </Typography>
              
              <TextField
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
                onChange={(e) => setEmail(e.target.value)}
              />
              <TextField
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
                onChange={(e) => setPassword(e.target.value)}
              />
              {error && <Typography align="center" color="error">{error}</Typography>}
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                sx={{ mt: 3, mb: 2 }}
              >
                Log In
              </Button>
              <Grid container justifyContent="space-between">
                <Grid item>
                  <Link variant="body2" underline="hover" onClick={() => {
                      navigate(PUBLIC.GUEST_ROUTE.FORGOT_PASS);
                    }}>
                    Forgot password?
                  </Link>
                </Grid>
                <Grid item>
                  <Link
                    onClick={() => {
                      navigate(PUBLIC.GUEST_ROUTE.SIGN_UP);
                    }}
                    variant="body2"
                    underline="hover"
                  >
                    {"Don't have an account? Sign Up"}
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

export default Login;
