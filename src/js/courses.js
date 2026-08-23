import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;
const api = axios.create({baseURL: API_URL});

const listOfCoursesSpace = document.querySelector("#setOfAllCourses");
// const filterBar = document.querySelector("#filterBar");
const availableSpace = 32;
const addCourseModal = document.getElementById("addCourseModal");
const addCourseForm = document.getElementById("addCourseForm");
const chooseSetOfCoursesModal = document.getElementById("chooseSetOfCoursesModal");
const chooseSetOfCoursesForm = document.getElementById("chooseSetOfCoursesForm");

let allCourses = [];
let allSetsOfCourses = [];

const fetchCourses = async () => {
    try {
        const auth = {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('jwt_token')}`
            }
        }
        const [coursesRes, setsRes] = await Promise.all([
            api.get('/api/courses', auth),
            api.get('/api/courses/setsOfCourses', auth)
        ]);

        allCourses = coursesRes.data;
        allSetsOfCourses = setsRes.data;


        let shownCount = 0;
        allCourses.forEach(element => {
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
        addCourseForm.reset();
        addCourseModal.showModal();
    });
}

const calendarButtonAction = async () => {
    document.getElementById("calendar").addEventListener("click", () => {

    });
}

const chooseSetOfCoursesAction = async () => {
    document.getElementById("chooseCourseSet").addEventListener("click", () => {
        chooseSetOfCoursesModal.showModal();
    });
}

const submitButtonAction = async () => {
    addCourseForm.addEventListener("submit", async (e) => {
        // e.preventDefault();

        const formData = new FormData(addCourseForm);
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
            addCourseModal.close();
        } catch (error) {
            console.error("Failed to add course: ", error);
        }
        
    });
}

const workflow = async () => {
    await fetchCourses();
    enableFilterBar();
    chooseSetOfCoursesAction();
    addCourseButtonAction();
    submitButtonAction();
};

workflow();