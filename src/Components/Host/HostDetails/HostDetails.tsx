import React, { useState, useEffect, useCallback } from "react";
import jwtDecode from "jwt-decode";
import hostAxios from "../../../Axios/hostAxios";
import { useNavigate } from "react-router-dom";
import "./HostDetails.css";
import axios from "axios";

import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

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
import { useSelector } from "react-redux";
import { RootState } from "../../../Redux/Reducer/index";

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
  hostWallet: number;

  hotelName: string;
  hotelRating: number;
  gst: string;
  pan: string;
  amenities: string[];
  hotelImageLinks: string[];

  roomTypes: RoomTypeDetail[];

  place: string;
  city: string;
  state: string;
  country: string;
  pin: number;

  ownerDocLinks: string[];
  propertyDocLinks: string[];
  policyFileLinks: string[];
}

function HostDetails() {
  const navigate = useNavigate();
  const { PRIVATE, PUBLIC } = ROUTES;

  const { hostToken } = useSelector((state: RootState) => state.HostAuthState);
  const headers = {
    Authorization: `Bearer ${hostToken}`,
    "Content-Type": "application/json",
  };

  const handleEditClick = () => {
    navigate(ROUTES.PRIVATE.HOST_ROUTE.EDIT_DETAILS);
  };

  const [showForm, setShowForm] = useState(false);
  const [host, setHost] = useState<HostDetailsInterface | null>(null);
  const email = host?.email;

  const [activeStep, setActiveStep] = useState(0);

  const [hotelName, setHotelName] = useState("");
  const [hotelRating, setHotelRating] = useState(0);
  const [gst, setGST] = useState("");
  const [pan, setPAN] = useState("");
  const [amenities, setAmenities] = useState<string[]>([]);
  const [hotelImages, setHotelImages] = useState<string[] | null>(null);

  const [roomTypes, setRoomTypes] = useState<string[]>([]);
  const [roomCounts, setRoomCounts] = useState<{ [key: string]: number }>({});
  const [roomFares, setRoomFares] = useState<{ [key: string]: number }>({});
  const [roomAmenities, setRoomAmenities] = useState<{
    [key: string]: string[];
  }>({});
  const [roomImages, setRoomImages] = useState<{ [key: string]: string[] }>({});
  const [roomImagesFiles, setRoomImagesFiles] = useState<{
    [key: string]: FileList;
  }>({});

  const [place, setPlace] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [country, setCountry] = useState("");
  const [pin, setPIN] = useState("");

  const [policyFile, setPolicyFile] = useState<string[] | null>(null);
  const [propertyDoc, setPropertyDoc] = useState<string[] | null>(null);
  const [ownerDoc, setownerDoc] = useState<string[] | null>(null);

  const [error, setError] = useState("");

  const handleReapply = async (event: React.MouseEvent<HTMLButtonElement>) => {
    try {
      const response = await hostAxios.patch(
        `${API_URL.HANDLE_REAPPLY}/${email}`
      );
      if (response.status === 200) {
        window.location.reload();
      }
    } catch (error) {
      console.error("Failed to navigate to request details:", error);
    }
  };

  const handlePolicyFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      Promise.all(
        files.map((file) => {
          return new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = (error) => reject(error);
          });
        })
      )
        .then((images) => {
          setPolicyFile(images);
        })
        .catch((error) => {
          console.log("Error reading files:", error);
        });
    }
  };

  const handlePropertyDocChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      Promise.all(
        files.map((file) => {
          return new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = (error) => reject(error);
          });
        })
      )
        .then((images) => {
          setPropertyDoc(images);
        })
        .catch((error) => {
          console.log("Error reading files:", error);
        });
    }
  };

  const handleOwnerDocChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      Promise.all(
        files.map((file) => {
          return new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = (error) => reject(error);
          });
        })
      )
        .then((images) => {
          setownerDoc(images);
        })
        .catch((error) => {
          console.log("Error reading files:", error);
        });
    }
  };

  const handleHotelImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      Promise.all(
        files.map((file) => {
          return new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = (error) => reject(error);
          });
        })
      )
        .then((images) => {
          setHotelImages(images);
        })
        .catch((error) => {
          console.log("Error reading files:", error);
        });
    }
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    roomType: string
  ) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      Promise.all(
        files.map((file) => {
          return new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = (error) => reject(error);
          });
        })
      )
        .then((images) => {
          setRoomImages((prevState) => ({
            ...prevState,
            [roomType]: images,
          }));
          if (e.target.files) {
            setRoomImagesFiles((prevState: { [key: string]: FileList }) => ({
              ...prevState,
              [roomType]: e.target.files!,
            }));
          }
        })
        .catch((error) => {
          console.log("Error reading files:", error);
        });
    }
  };
  const dataSubmitHandle = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      const payload = {
        email,
        hotelName,
        hotelRating,
        gst,
        pan,
        amenities,
        hotelImages,

        roomTypes,
        roomCounts,
        roomFares,
        roomAmenities,
        roomImages,

        place,
        city,
        state,
        country,
        pin,

        policyFile,
        propertyDoc,
        ownerDoc,
      };

      try {
        setError("");
        const hostDataSubmit = await hostAxios.post(
          API_URL.SUBMIT_HOST_DETAILS,
          payload,
          { headers }
        );

        if (hostDataSubmit.data.success === true) {
          setError("");
          window.location.reload();
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
      email,
      hotelName,
      hotelRating,
      gst,
      pan,
      amenities,
      hotelImages,

      roomTypes,
      roomCounts,
      roomFares,
      roomAmenities,
      roomImages,

      place,
      city,
      state,
      country,
      pin,

      policyFile,
      propertyDoc,
      ownerDoc,
    ]
  );

  const steps = [
    "Add Property Details",
    "Add Room Details",
    "Add Address",
    "Add Documents",
    "Confirmation",
  ];

  useEffect(() => {
    const token = localStorage.getItem("hostToken");
    if (token) {
      const decodedToken = jwtDecode(token) as HostDetailsInterface | null;
      if (decodedToken) {
        setHost(decodedToken);
      }
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const result = await hostAxios.get(API_URL.GET_HOST_DETAILS, { headers });

      setHost(result.data);
    };

    if (host) {
      fetchData();
    }
  }, [host]);

  const displayForm = () => {
    setShowForm(true);
  };

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
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="gst"
              label="GST Number"
              name="gst"
              type="text"
              value={gst}
              onChange={(e) => setGST(e.target.value)}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="pan"
              label="PAN Number"
              name="pan"
              type="text"
              value={pan}
              onChange={(e) => setPAN(e.target.value)}
            />
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

            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="hotelImages"
              label="Hotel Images"
              name="hotelImages"
              type="file"
              InputLabelProps={{ shrink: true }}
              inputProps={{ multiple: true }}
              onChange={handleHotelImageChange}
            />
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

            {roomTypes.map((roomType) => (
              <TextField
                key={roomType}
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id={`${roomType.toLowerCase().replace(/\s+/g, "")}Images`}
                label={`${roomType} Images`}
                name={`${roomType.toLowerCase().replace(/\s+/g, "")}Images`}
                type="file"
                InputLabelProps={{ shrink: true }}
                inputProps={{ multiple: true }}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleFileChange(e, roomType)
                }
              />
            ))}
          </>
        );
      case 2:
        return (
          <>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="place"
              label="Place"
              name="place"
              type="text"
              value={place}
              onChange={(e) => setPlace(e.target.value)}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="city"
              label="City"
              name="city"
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="state"
              label="State"
              name="state"
              type="text"
              value={state}
              onChange={(e) => setState(e.target.value)}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="country"
              label="Country"
              name="country"
              type="text"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="PIN"
              label="PIN"
              name="PIN"
              type="number"
              value={pin}
              onChange={(e) => setPIN(e.target.value)}
            />
          </>
        );
      case 3:
        return (
          <>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="policies"
              label="Policies"
              name="policies"
              type="file"
              InputLabelProps={{ shrink: true }}
              inputProps={{ multiple: true }}
              onChange={handlePolicyFileChange}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="propertyDocs"
              label="Property Documents"
              name="propertyDocs"
              type="file"
              InputLabelProps={{ shrink: true }}
              inputProps={{ multiple: true }}
              onChange={handlePropertyDocChange}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="ownerDocs"
              label="Owner Documents"
              name="ownerDocs"
              type="file"
              InputLabelProps={{ shrink: true }}
              inputProps={{ multiple: true }}
              onChange={handleOwnerDocChange}
            />
          </>
        );

      case 4:
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
        {!showForm && (host?.level === 0 || host?.level === 4) && (
          <ThemeProvider theme={theme}>
            <div style={{ position: "relative", width: "100%" }}>
              <img
                src="https://cf.bstatic.com/xdata/images/hotel/max1024x768/154919303.jpg?k=d6bd4dc445de3f1f1e7dd05ee5fbdf78587a8ac266bdbee8d2c69c0b513db001&o=&hp=1"
                alt=""
                width="100%"
                height="600vh"
                style={{ display: "block", filter: "blur(3px)" }}
              />
              <div
                style={{
                  position: "absolute",
                  top: "30%",
                  left: "10%",
                  color: "#FFFFFF",
                  fontSize: "50px",
                  fontWeight: "bold",
                  textShadow: "2px 2px 2px #87CEEB",
                }}
              >
                Glad to have you with us.
                <br />
                Welcome aboard!
                <br />
                Dive right in.
              </div>
              <Button
                type="button"
                variant="contained"
                sx={{
                  mt: 3,
                  width: "300px",
                  height: "50px",
                  mb: 2,
                  position: "absolute",
                  top: "40%",
                  left: "80%",
                  transform: "translate(-50%, -50%)",
                  backgroundColor: "#FFFFFF",
                  color: "#000000",
                  borderRadius: "30px",
                }}
                onClick={displayForm}
              >
                {host?.level === 0
                  ? "Upload your details"
                  : "Re Upload your Details"}{" "}
              </Button>
            </div>
          </ThemeProvider>
        )}
        {!showForm && host?.level === 1 && (
          <ThemeProvider theme={theme}>
            <Dialog open={true}>
              <DialogTitle>Application Status</DialogTitle>
              <DialogContent>
                <DialogContentText>
                  Your submission is under verification. We'll notify you via
                  email once complete. Thank you for your patience.
                </DialogContentText>
              </DialogContent>
            </Dialog>
          </ThemeProvider>
        )}
        {!showForm && host?.level === 2 && (
          <ThemeProvider theme={theme}>
            <Dialog open={true}>
              <DialogTitle>Application Status</DialogTitle>
              <DialogContent>
                <DialogContentText>
                  We regret to inform you that your submission does not meet all
                  of our current listing criteria. we encourage you to resubmit
                  your listing for another review. Thank you for your
                  understanding
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button color="primary" onClick={handleReapply}>
                  Reapply
                </Button>
              </DialogActions>
            </Dialog>
          </ThemeProvider>
        )}
        {!showForm && host?.level === 3 && (
          <div className="request-details-container">
            <div className="hotel-images">
              <div className="image-container">
                {host.hotelImageLinks.map((img, index) => (
                  <img
                    key={index}
                    src={img}
                    alt={`Hotel Image ${index + 1}`}
                    style={{ width: "200px", height: "150px", margin: "10px" }}
                  />
                ))}
              </div>
            </div>

            <div className="header-container">
              <h1>{host.hotelName}</h1>
              <button className="edit-btn" onClick={handleEditClick}>
                Edit
              </button>
            </div>


              <div className="card">
                Ease Inn
                <div className="card-body">
                <h1>{host.hotelName}</h1>
                <h1>{host._id}</h1>
                

                  <span className="amount-label">Wallet Balance:</span>
                  <h1 className="amount">{host.hostWallet} Rs.</h1>
                </div>
              </div>


            <div className="general-info">
              <p>
                {host.place}, {host.city}, {host.state}, {host.country},{" "}
                {host.pin}
              </p>
              <p>
                {Array(host.hotelRating)
                  .fill(0)
                  .map((_, idx) => (
                    <span key={idx} className="star-icon">
                      ★
                    </span>
                  ))}
              </p>
            </div>

            <div className="contact-info">
              <p>Username: {host.username}</p>
              <p>Email: {host.email}</p>
              <p>Phone: {host.phone}</p>
              <p>GST: {host.gst}</p>
              <p>PAN: {host.pan}</p>
            </div>

            <div className="amenities">
              <h3>Amenities</h3>
              <ul>
                {host.amenities.map((amenity, index) => (
                  <li key={index}>{amenity}</li>
                ))}
              </ul>
            </div>

            {host.roomTypes.map((roomType, idx) => (
              <div key={idx} className="room-details">
                <h3>
                  {roomType.type} ({roomType.roomCount} nos)
                </h3>
                <div className="image-container">
                  {roomType.roomImageLinks.map((img, index) => (
                    <img
                      key={index}
                      src={img}
                      alt={`${roomType.type} Image ${index + 1}`}
                      style={{
                        width: "200px",
                        height: "150px",
                        margin: "10px",
                      }}
                    />
                  ))}
                </div>
                <h4>Room Fare:{roomType.roomFare} Rs.</h4>
                <h4>Amenities:</h4>
                <ul>
                  {roomType.roomAmenities.map((amenity, index) => (
                    <li key={index}>{amenity}</li>
                  ))}
                </ul>
              </div>
            ))}

            <div className="docs">
              <h3>Owner's Documentation</h3>
              <div className="image-container">
                {host.ownerDocLinks.map((doc, index) => (
                  <img
                    key={index}
                    src={doc}
                    alt={`Document ${index + 1}`}
                    style={{ width: "200px", height: "150px", margin: "10px" }}
                  />
                ))}
              </div>
            </div>

            <div className="docs">
              <h3>Property's Documentation</h3>
              <div className="image-container">
                {host.propertyDocLinks.map((doc, index) => (
                  <img
                    key={index}
                    src={doc}
                    alt={`Document ${index + 1}`}
                    style={{ width: "200px", height: "150px", margin: "10px" }}
                  />
                ))}
              </div>
            </div>

            <div className="docs">
              <h3>Policies and Rules</h3>
              <div className="image-container">
                {host.policyFileLinks.map((doc, index) => (
                  <img
                    key={index}
                    src={doc}
                    alt={`Document ${index + 1}`}
                    style={{ width: "200px", height: "150px", margin: "10px" }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

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
                  onSubmit={dataSubmitHandle}
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

export default HostDetails;
