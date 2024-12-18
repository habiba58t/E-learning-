// utils/axiosInstance.ts
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:3002' , // Use environment variable for base URL
  withCredentials: true, // Include cookies if needed
});

export default axiosInstance;