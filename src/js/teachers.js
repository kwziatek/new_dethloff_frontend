import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;
const api = axios.create({baseURL: API_URL});

const listOfTeachersSpace = document.querySelector("#setOfTeachers");
const filterBar = document.querySelector("#filterBar");
const availableSpace = 32;
const modal = document.getElementById("teacherModal");
const form = document.getElementById("teacherForm");

const fetchTeachers = async () => {
    try {
        const auth = {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('jwt_token')}`
            }
        }
        const response = await api.get('/api/teachers', auth);
        const data = response.data;
        let shownCount = 0;
        data.forEach(element => {
            const newA = document.createElement("a");
            const newP = document.createElement("p");
            newP.classList.add('teacher');
            newP.innerHTML = element.name + " " + element.surname;
            newA.href = "/pages/teacherDetails" + "?id=" + element.id;
            newA.classList.add('teacherAnchor');
            newA.appendChild(newP);
            if(shownCount >= availableSpace) {
                newA.style.display = "none";
            } else {
                shownCount++;
            }
            listOfTeachersSpace.append(newA);
        });
    } catch(e) {
        alert(e.message);
    };
};

const enableFilterBar = async () => {
    filterBar.addEventListener("input", (e) => {
        const userInput = e.target.value.toLowerCase(); 
        let matchCount = 0;
        
        Array.from(listOfTeachersSpace.children).forEach(teacher => {
            const nameSurname = teacher.querySelector('.teacher').textContent.toLowerCase();
            const isMatch = nameSurname.includes(userInput)

            if(isMatch && matchCount < availableSpace) {
                teacher.style.display = ""; // Restores standard CSS layout
                matchCount++;
            } else {
                teacher.style.display = "none";
            }
        });
    });
};

const addTeacherButtonAction = async () => {
    document.getElementById("addTeacher").addEventListener("click", () => {
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
            const response = await api.post("/api/teachers", payload, auth);
            const data = await response.data;
            window.location.href = `/pages/teacherDetails?id=${data.id}`;
            modal.close();
        } catch (error) {
            console.error("Failed to add teacher: ", error);
        }
        
    });
}

const workflow = async () => {
    await fetchTeachers();
    enableFilterBar();
    addTeacherButtonAction();
    submitButtonAction();
};

workflow();