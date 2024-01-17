import React, { useState } from "react";
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

const ForgotPass = () => {
  
  const [email, setEmail] = useState("");

  const navigate = useNavigate();


  const { PUBLIC } = ROUTES;

  const passwordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      email,
    };
    try {
      const updatePassword = await guestAxios.post(API_URL.FORGOT_PASS, payload);
      if (updatePassword) {
        navigate(PUBLIC.GUEST_ROUTE.FORGOT_PASS_OTP);
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
              onSubmit={passwordUpdate}
              noValidate
              sx={{ display: "flex", flexDirection: "column", m: 1 }}
            >
              <Typography variant="h5" component="h2" gutterBottom>
                Forgot Password ?
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
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                sx={{ mt: 3, mb: 2 }}
              >
                Submit
              </Button>
              <Grid container justifyContent="center">
                <Grid item>
                  <Link
                    onClick={() => {
                      navigate(PUBLIC.GUEST_ROUTE.LOG_IN);
                    }}
                    variant="body2"
                    underline="hover"
                  >
                    {"Back to login"}
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

export default ForgotPass;
