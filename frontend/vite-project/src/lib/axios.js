import axios from 'axios'

const api_url = import.meta.env.VITE_API_URL || "http://localhost:5001/api"

const axiosInstance = axios.create({
    baseURL: api_url,
    withCredentials: true
});

export default axiosInstance;