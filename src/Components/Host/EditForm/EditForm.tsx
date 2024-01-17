import React, { useState, useEffect, useCallback } from "react";
import jwtDecode from "jwt-decode";
import hostAxios from "../../../Axios/hostAxios";
import { useNavigate } from "react-router-dom";
import "./EditForm.css";
import axios from "axios";

import {
  TextField,
  Checkbox,
  ListItemText,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Button,
  Paper,
  Typography,
  Box,
  Input,
  Stepper,
  Step,
  StepLabel,
} from "@mui/material";
import { SelectChangeEvent } from "@mui/material/Select";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { API_URL } from "../../../Config/EndPoints";
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

interface RoomTypeDetail {
  type: string;
  roomCount: number;
  roomFare: number;
  roomAmenities: string[];
  roomImageLinks: string[];
}

interface HostDetailsInterface {
  _id: string;
  username: string;
  email: string;
  phone: string;
  level: number;

  hotelName: string;
  hotelRating: number;
  amenities: string[];
  hotelImageLinks: string[];

  roomTypes: RoomTypeDetail[];
}

function EditForm() {
  const navigate = useNavigate();
  const { PRIVATE, PUBLIC } = ROUTES;

  const [showForm, setShowForm] = useState(true);
  const [tokenDetails, setTokenDetails] = useState<HostDetailsInterface | null>(
    null
  );
  const [host, setHost] = useState<HostDetailsInterface | null>(null);
  const id = tokenDetails?._id;

  const [activeStep, setActiveStep] = useState(0);

  const [hotelName, setHotelName] = useState("");
  const [hotelRating, setHotelRating] = useState(0);
  const [amenities, setAmenities] = useState<string[]>([]);

  const [roomTypes, setRoomTypes] = useState<string[]>([]);
  const [roomCounts, setRoomCounts] = useState<{ [key: string]: number }>({});
  const [roomFares, setRoomFares] = useState<{ [key: string]: number }>({});
  const [roomAmenities, setRoomAmenities] = useState<{
    [key: string]: string[];
  }>({});

  const [error, setError] = useState("");



  const dataUpdateHandle = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      const payload = {
        id,
        hotelName,
        hotelRating,
        amenities,

        roomTypes,
        roomCounts,
        roomFares,
        roomAmenities,
      };

      try {
        setError("");
        const hostDataUpdate = await hostAxios.post(
          API_URL.UPDATE_HOST_DETAILS,
          payload
        );

        if (hostDataUpdate.data.success === true) {
          setError("");
          navigate(ROUTES.PRIVATE.HOST_ROUTE.HOME);
        }
      } catch (e) {
        if (axios.isAxiosError(e)) {
          setError(e.response?.data?.message || "An error occurred");
        } else {
          setError("An error occurred");
        }
        console.log(e);
      }
    },
    [
      id,
      hotelName,
      hotelRating,
      amenities,

      roomTypes,
      roomCounts,
      roomFares,
      roomAmenities,
    ]
  );

  const steps = ["Add Property Details", "Add Room Details", "Confirmation"];

  useEffect(() => {
    const token = localStorage.getItem("hostToken");
    if (token) {
      const decodedToken = jwtDecode(token) as HostDetailsInterface | null;
      if (decodedToken) {
        setTokenDetails(decodedToken);
      }
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (tokenDetails && tokenDetails._id) {
        const result = await hostAxios.get(API_URL.GET_HOST_DETAILS, {
          params: {
            id: tokenDetails._id,
          },
        });
        const hostDetails = result.data;
  
        setHost(hostDetails);
        setHotelName(hostDetails.hotelName || "");
        setHotelRating(hostDetails.hotelRating || 0);
        setAmenities(hostDetails.amenities || []);
        setRoomTypes(
          hostDetails.roomTypes.map((roomType: RoomTypeDetail) => roomType.type)
        );
        const rtCounts: { [key: string]: number } = {};
        const rtFares: { [key: string]: number } = {};
        const rtAmenities: { [key: string]: string[] } = {};
  
        hostDetails.roomTypes.forEach((roomType: RoomTypeDetail) => {
          rtCounts[roomType.type] = roomType.roomCount;
          rtFares[roomType.type] = roomType.roomFare;
          rtAmenities[roomType.type] = roomType.roomAmenities;
        });
  
        setRoomCounts(rtCounts);
        setRoomFares(rtFares);
        setRoomAmenities(rtAmenities);
      }
    };
    fetchData();
  }, [tokenDetails]);
  
  

  const getStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="hotelName"
              label="Hotel Name"
              name="hotelName"
              type="text"
              value={hotelName}
              onChange={(e) => setHotelName(e.target.value)}
            />
            <FormControl variant="outlined" margin="normal" required fullWidth>
              <InputLabel id="hotelRating-label">Hotel Rating</InputLabel>
              <Select
                labelId="hotelRating-label"
                id="hotelRating"
                name="hotelRating"
                value={hotelRating}
                onChange={(e) => setHotelRating(Number(e.target.value))}
                label="Hotel Rating"
              >
                <MenuItem value={3}>3</MenuItem>
                <MenuItem value={4}>4</MenuItem>
                <MenuItem value={5}>5</MenuItem>
                <MenuItem value={7}>7</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth variant="outlined" margin="normal">
              <InputLabel htmlFor="amenities-label">Ameneties</InputLabel>
              <Select
                multiple
                value={amenities}
                displayEmpty
                label="Ameneties"
                id="amenities-label"
                onChange={(event: SelectChangeEvent<string[]>) =>
                  setAmenities(event.target.value as string[])
                }
                renderValue={(selected) => (selected as string[]).join(", ")}
              >
                <MenuItem value="Wi-Fi">
                  <Checkbox checked={amenities.indexOf("Wi-Fi") > -1} />
                  <ListItemText primary="Wi-Fi" />
                </MenuItem>
                <MenuItem value="Air Conditioning">
                  <Checkbox
                    checked={amenities.indexOf("Air Conditioning") > -1}
                  />
                  <ListItemText primary="Air Conditioning" />
                </MenuItem>
                <MenuItem value="Swimming Pool">
                  <Checkbox checked={amenities.indexOf("Swimming Pool") > -1} />
                  <ListItemText primary="Swimming Pool" />
                </MenuItem>
                <MenuItem value="Fitness Area">
                  <Checkbox checked={amenities.indexOf("Fitness Area") > -1} />
                  <ListItemText primary="Fitness Area" />
                </MenuItem>
                <MenuItem value="Spa Services">
                  <Checkbox checked={amenities.indexOf("Spa Services") > -1} />
                  <ListItemText primary="Spa Services" />
                </MenuItem>
                <MenuItem value="Elavator">
                  <Checkbox checked={amenities.indexOf("Elavator") > -1} />
                  <ListItemText primary="Elavator" />
                </MenuItem>
                <MenuItem value="Conference Rooms">
                  <Checkbox
                    checked={amenities.indexOf("Conference Rooms") > -1}
                  />
                  <ListItemText primary="Conference Rooms" />
                </MenuItem>
                <MenuItem value="Bar">
                  <Checkbox checked={amenities.indexOf("Bar") > -1} />
                  <ListItemText primary="Bar" />
                </MenuItem>
              </Select>
            </FormControl>

          </>
        );
      case 1:
        return (
          <>
            <FormControl fullWidth variant="outlined" margin="normal">
              <InputLabel htmlFor="roomType-label">Room Types</InputLabel>
              <Select
                multiple
                value={roomTypes}
                displayEmpty
                label="Room Types"
                id="roomType-label"
                onChange={(event: SelectChangeEvent<string[]>) => {
                  setRoomTypes(event.target.value as string[]);
                }}
                renderValue={(selected) => (selected as string[]).join(", ")}
              >
                <MenuItem value="Standard Room">
                  <Checkbox checked={roomTypes.indexOf("Standard Room") > -1} />
                  <ListItemText primary="Standard Room" />
                </MenuItem>
                <MenuItem value="Deluxe Room">
                  <Checkbox checked={roomTypes.indexOf("Deluxe Room") > -1} />
                  <ListItemText primary="Deluxe Room" />
                </MenuItem>
                <MenuItem value="Suite Room">
                  <Checkbox checked={roomTypes.indexOf("Suite Room") > -1} />
                  <ListItemText primary="Suite Room" />
                </MenuItem>
              </Select>
            </FormControl>

            {roomTypes.map((type) => (
              <FormControl
                key={type}
                fullWidth
                variant="outlined"
                margin="normal"
              >
                <InputLabel htmlFor={`${type}-count`}>
                  Number of {type.charAt(0).toUpperCase() + type.slice(1)}
                </InputLabel>
                <Input
                  id={`${type}-count`}
                  type="number"
                  value={roomCounts[type] || ""}
                  onChange={(event) => {
                    const updatedCounts = {
                      ...roomCounts,
                      [type]: Number(event.target.value),
                    };
                    setRoomCounts(updatedCounts);
                  }}
                />
              </FormControl>
            ))}

            {roomTypes.map((type) => (
              <FormControl
                key={type + "-amenities"}
                fullWidth
                variant="outlined"
                margin="normal"
              >
                <InputLabel htmlFor={`${type}-amenities-label`}>
                  Amenities for {type.charAt(0).toUpperCase() + type.slice(1)}
                </InputLabel>
                <Select
                  multiple
                  value={roomAmenities[type] || []}
                  label={`Amenities for ${type}`}
                  id={`${type}-amenities-label`}
                  onChange={(event: SelectChangeEvent<string[]>) => {
                    const updatedAmenities = {
                      ...roomAmenities,
                      [type]: event.target.value as string[],
                    };
                    setRoomAmenities(updatedAmenities);
                  }}
                  renderValue={(selected) => (selected as string[]).join(", ")}
                >
                  {[
                    "Work Desk",
                    "Balcony",
                    "Air Conditioning",
                    "Wi-Fi",
                    "Ironing Board",
                    "24-hour Room Service",
                    "24-hour Housekeeping",
                    "24-hour In-room Dining",
                    "Bathtub",
                    "Bathroom",
                    "Charging Points",
                    "Telephone",
                    "Couch",
                    "Closet",
                    "Sofa",
                    "Minibar",
                    "Seating Area",
                    "Chair",
                    "Centre Table",
                    "Dining Area",
                    "Dining Table",
                    "Coffee Machine",
                    "Blackout Curtains",
                    "Woollen Blanket",
                    "Electronic Safe",
                    "Speakers",
                    "TV",
                    "Shaving Mirror",
                    "Hairdryer",
                    "Dental Kit",
                    "Bubble Bath",
                    "Shower Cap",
                    "Slippers",
                    "Bathrobes",
                    "Weighing Scale",
                    "Toiletries",
                    "Shower Cubicle",
                    "Western Toilet Seat",
                    "Bathroom Phone",
                    "Hot & Cold Water",
                    "Sewing Kit",
                    "Toilet with grab rails",
                    "Newspaper",
                    "Kettle",
                  ].map((amenity) => (
                    <MenuItem key={amenity} value={amenity}>
                      <Checkbox
                        checked={
                          (roomAmenities[type] || []).indexOf(amenity) > -1
                        }
                      />
                      <ListItemText primary={amenity} />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            ))}

            {roomTypes.map((type) => (
              <FormControl
                key={type}
                fullWidth
                variant="outlined"
                margin="normal"
              >
                <InputLabel htmlFor={`${type}-fare`}>
                  Fare for {type.charAt(0).toUpperCase() + type.slice(1)}
                </InputLabel>
                <Input
                  id={`${type}-fare`}
                  type="number"
                  value={roomFares[type] || ""}
                  onChange={(event) => {
                    const updatedFares = {
                      ...roomFares,
                      [type]: Number(event.target.value),
                    };
                    setRoomFares(updatedFares);
                  }}
                />
              </FormControl>
            ))}

          </>
        );

      case 2:
        return (
          <>
            {error && <div style={{ color: "red" }}>{error}</div>}
            <Typography>Review your details and submit</Typography>
          </>
        );

      default:
        return "Unknown step";
    }
  };

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  return (
    <div>
      <div>
        {showForm && (
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
              <Stepper activeStep={activeStep} alternativeLabel>
                {steps.map((label) => (
                  <Step key={label}>
                    <StepLabel>{label}</StepLabel>
                  </Step>
                ))}
              </Stepper>
              <Paper
                elevation={6}
                sx={{
                  padding: 3,
                  width: { xs: "90%", sm: "70%", md: "50%" },
                  mt: 3,
                }}
              >
                <Box
                  component="form"
                  onSubmit={dataUpdateHandle}
                  noValidate
                  sx={{ display: "flex", flexDirection: "column", m: 1 }}
                >
                  <Typography variant="h5" component="h2" gutterBottom>
                    {steps[activeStep]}
                  </Typography>

                  {getStepContent(activeStep)}

                  <Box
                    sx={{
                      display: "flex",
                      justifyContent:
                        activeStep === 0 ? "flex-end" : "space-between",
                      mt: 2,
                    }}
                  >
                    {activeStep !== 0 && (
                      <Button type="button" onClick={handleBack}>
                        Back
                      </Button>
                    )}

                    {activeStep === steps.length - 1 ? (
                      <Button type="submit">Submit</Button>
                    ) : (
                      <Button type="button" onClick={handleNext}>
                        Next
                      </Button>
                    )}
                  </Box>
                </Box>
              </Paper>
            </Box>
          </ThemeProvider>
        )}
      </div>
    </div>
  );
}

export default EditForm;
