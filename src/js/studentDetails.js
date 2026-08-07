import axios from "axios";

const id = new URLSearchParams(window.location.search).get('id');

try {
    const auth = {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("jwt_token")}`
        }
    }

    const response = await axios.get(`http://localhost:8080/api/students/${id}`, auth);
    const data = await response.data;
    console.log(data);
} catch(error) {
    console.error("Error fetching student details: " + error);
}
