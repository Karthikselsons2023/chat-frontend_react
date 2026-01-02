import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: import.meta.env.MODE === "development" ? "https://ripplecoin.in" : "https://ripplecoin.in",
  //  baseURL: import.meta.env.MODE === "development" ? "http://localhost:3000" : "http://localhost:3000",
  withCredentials: true,
});
