import axios from "axios";
import API from "./api";

const API_URL = import.meta.env.VITE_BACKEND_URL + "/api/admin";


// Function to fetch admin analytics
export const getAdminAnalytics = async (token) => {
    try {
        const response = await API.get(`${API_URL}/analytics`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching admin analytics:", error);
        throw error;
    }
};

export const findUserbyId = async (userId) => {
    try {
        const response = await axios.get(`${API_URL}/${userId}`)
        return response.data;
    } catch (error) {
        console.error("error fetchingthe user by id ", error);
    }

}