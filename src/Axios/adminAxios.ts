import { adminAPI } from "../Constants/API";
import axios from "axios";

const adminInstance = axios.create({
    baseURL: adminAPI,
    withCredentials: true,
});

export default adminInstance;
