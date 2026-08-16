import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;
const api = axios.create({baseURL: API_URL});

const listOfCoursesSpace = document.querySelector("#setOfAllCourses");
// const filterBar = document.querySelector("#filterBar");
const availableSpace = 32;
const modal = document.getElementById("courseModal");
const form = document.getElementById("courseForm");

const fetchCourses = async () => {
    try {
        const auth = {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('jwt_token')}`
            }
        }
        const response = await api.get('/api/courses', auth);
        const data = response.data;
        let shownCount = 0;
        data.forEach(element => {
            const newA = document.createElement("a");
            const newP = document.createElement("p");
            newP.classList.add('course');
            newP.innerHTML = element.name + " <br>" + element.teacher.name + " " + element.teacher.surname;
            newA.href = "/pages/courseDetails" + "?id=" + element.id;
            newA.classList.add('courseAnchor');
            newA.appendChild(newP);
            if(shownCount >= availableSpace) {
                newA.style.display = "none";
            } else {
                shownCount++;
            }
            console.log(listOfCoursesSpace);
            listOfCoursesSpace.append(newA);
        });
    } catch(e) {
        alert(e.message);
    };
};

const enableFilterBar = async () => {
    filterBar.addEventListener("input", (e) => {
        const userInput = e.target.value.toLowerCase(); 
        let matchCount = 0;
        
        Array.from(listOfCoursesSpace.children).forEach(course => {
            const nameSurname = course.querySelector('.course').textContent.toLowerCase();
            console.log(nameSurname);
            const isMatch = nameSurname.includes(userInput)

            if(isMatch && matchCount < availableSpace) {
                course.style.display = ""; // Restores standard CSS layout
                matchCount++;
            } else {
                course.style.display = "none";
            }
        });
    });
};

const addCourseButtonAction = async () => {
    document.getElementById("createCourse").addEventListener("click", () => {
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
            const response = await api.post("/api/courses", payload, auth);
            const data = await response.data;
            window.location.href = `/pages/courseDetails?id=${data.id}`;
            modal.close();
        } catch (error) {
            console.error("Failed to add course: ", error);
        }
        
    });
}

const workflow = async () => {
    await fetchCourses();
    enableFilterBar();
    addCourseButtonAction();
    submitButtonAction();
};

workflow();