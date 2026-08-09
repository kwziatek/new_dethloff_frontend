import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;
const api = axios.create({baseURL: API_URL});

const listOfStudentsSpace = document.querySelector(".setOfStudents");
const filterBar = document.querySelector("#filterBar");
const availableSpace = 32;
const modal = document.getElementById("studentModal");
const form = document.getElementById("studentForm");

const fetchStudents = async () => {
    try {
        const auth = {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('jwt_token')}`
            }
        }
        const response = await api.get('/api/students', auth);
        const data = response.data;
        let shownCount = 0;
        data.forEach(element => {
            const newA = document.createElement("a");
            const newP = document.createElement("p");
            newP.classList.add('student');
            newP.innerHTML = element.name + " " + element.surname;
            newA.href = "/pages/studentDetails" + "?id=" + element.id;
            newA.classList.add('studentAnchor');
            newA.appendChild(newP);
            if(shownCount >= availableSpace) {
                newA.style.display = "none";
            } else {
                shownCount++;
            }
            listOfStudentsSpace.append(newA);
        });
    } catch(e) {
        alert(e.message);
    };
};

const enableFilterBar = async () => {
    filterBar.addEventListener("input", (e) => {
        const userInput = e.target.value.toLowerCase(); 
        let matchCount = 0;
        
        Array.from(listOfStudentsSpace.children).forEach(student => {
            const nameSurname = student.querySelector('.student').textContent.toLowerCase();
            const isMatch = nameSurname.includes(userInput)

            if(isMatch && matchCount < availableSpace) {
                student.style.display = ""; // Restores standard CSS layout
                matchCount++;
            } else {
                student.style.display = "none";
            }
        });
    });
};

const addStudentButtonAction = async () => {
    document.getElementById("addStudent").addEventListener("click", () => {
        form.reset();
        modal.showModal();
    });
}

const submitButtonAction = async () => {
    form.addEventListener("submit", async (e) => {
        // e.preventDefault();

        const formData = new FormData(form);
        const payload = Object.fromEntries(formData);

        const auth = {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("jwt_token")}`
            }
        };
        try {
            const response = await api.post("/api/students", payload, auth);
            const data = await response.data;
            window.location.href = `/pages/studentDetails?id=${data.id}`;
            modal.close();
        } catch (error) {
            console.error("Failed to add student: ", error);
        }
        
    });
}

const workflow = async () => {
    await fetchStudents();
    enableFilterBar();
    addStudentButtonAction();
    submitButtonAction();
};

workflow();