import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;
const api = axios.create({baseURL: API_URL});
const id = new URLSearchParams(window.location.search).get('id');

try {
    const auth = {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("jwt_token")}`
        }
    }
    const response = await api.get(`api/students/${id}`, auth);
    const data = await response.data;
    console.log(data);
} catch(error) {
    console.error("Error fetching student details: " + error);
}
