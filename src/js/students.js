import axios from "axios";

try {
    const auth = {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('jwt_token')}`
        }
    }
    const response = await axios.get('http://localhost:8080/api/students', auth);
    //how should the jwt_token be sent to BE?
    console.log(response.data);
    
} catch(e) {
    alert(e.message);
}