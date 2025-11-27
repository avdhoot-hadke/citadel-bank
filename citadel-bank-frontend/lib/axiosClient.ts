import axios from "axios";

const axiosClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080",
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true,
});

axiosClient.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error("API Error:", error?.response || error);
        return Promise.reject(error);
    }
);

export default axiosClient;
