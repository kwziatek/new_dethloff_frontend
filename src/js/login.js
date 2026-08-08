import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;
const api = axios.create({baseURL: API_URL});

const button = document.querySelector("#submitButton");
const loginInput = document.querySelector("#login");
const passwordInput = document.querySelector("#password");

button.addEventListener("click", (e) => {
    e.preventDefault();
    const login = loginInput.value;
    const password = passwordInput.value;
    console.log(login + " " + password);
    logIn(login, password);
});

const logIn = async (login, password) => {
    try {
        const response = await api.post("/login", {
            username: login,
            password: password
        });

        console.log(response);

        const token = response.data
        localStorage.setItem("jwt_token", token);
        if(token) {
            window.location.href = "dashboard";
        } else {
            alert("Brak tokenu w odpowiedzi servera");
        }

    } catch(error) {
        console.log(error.message);
        console.error("Błąd logowania: " + error);
        alert("Logowanie nie powiodło się!");
    }
};