import axios from "axios";
import { hostAPI } from "../Constants/API";

const hostInstance = axios.create({
    baseURL: hostAPI,
    withCredentials: true,
});
export default hostInstance;
