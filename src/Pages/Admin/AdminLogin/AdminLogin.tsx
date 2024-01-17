import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import adminAxios from '../../../Axios/adminAxios'
import { API_URL } from "../../../Config/EndPoints";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Button, TextField, Paper, Typography, Box } from "@mui/material";
import { ROUTES } from '../../../Routes/Routing' 
import { adminAuthAction } from "../../../Redux/Container/adminAuth.slice";

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

const { PRIVATE } = ROUTES;

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      email,
      password,
    };    
    try {
      const adminLogin = await adminAxios.post(API_URL.ADMIN_LOGIN, payload);
      if (adminLogin) {
          const payload = {
            adminToken: adminLogin.data.adminToken,
            adminRole: adminLogin.data.adminData.role,
          };
          dispatch(adminAuthAction.setAdminLogin(payload));
        
          navigate(PRIVATE.ADMIN_ROUTE.DASHBOARD);
       
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
              noValidate
              onSubmit={handleSubmit} 
              sx={{ display: "flex", flexDirection: "column", m: 1 }}
            >
              <Typography variant="h5" component="h2" gutterBottom>
                Admin Log In
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
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                sx={{ mt: 3, mb: 2 }}
              >
                Log In
              </Button>
            </Box>
          </Paper>
        </Box>
      </ThemeProvider>
    </>
  );
};

export default AdminLogin;
