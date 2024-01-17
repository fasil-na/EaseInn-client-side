import axios from "axios";
import { guestAPI } from "../Constants/API";

const guestInstance = axios.create({
    baseURL: guestAPI,
    withCredentials: true,
});
export default guestInstance;
