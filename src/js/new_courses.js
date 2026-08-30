// fetch the data from BE API:
// 1. all courses (may be detailed) data
// 2. all levels of courses
// 3. all teachers
// 4. all sets of courses

// create course button 
// 1. store course name
// 2. enable search bar tool, searching among the fetched teachers
// 3. the same with level of courses
import axios from "axios";
import {showToast} from "./global";

const API_URL = import.meta.env.VITE_API_URL;
const api = axios.create({baseURL: API_URL});
const auth = {
    headers: {
        Authorization: `Bearer ${localStorage.getItem('jwt_token')}`
    }
};

const availableSpace = 32;
const listOfCoursesSpace =  document.querySelector("#setOfAllCourses");
const teacherInput = document.querySelector("#teacherSearchInput");
const teacherDropdown = document.querySelector("#teacherDropdown");

let allCourses = [];
let allSetsOfCourses = [];
let allTeachers = [];
let allLevels = [];

const createTeacherDropdownListElements = () => {
    allTeachers.forEach(teacher => {
        const newP = document.createElement("p");
        newP = innerHTML = teacher.name + " " + teacher.surname;
        const newLI = document.createElement("li");
        newLI.classList.add = "teacherLI";
        newLI.display.style = "none";
        newLI.appendChild(newP);
        teacherDropdown.appendChild(newLI);
    })
}

const fetchCourses = async () => {
    try {
        allCourses = (await api.get("/api/courses", auth)).data;
        allSetsOfCourses = (await api.get("/api/courses/setsOfCourses", auth)).data;
        allTeachers = (await api.get("/api/teachers", auth)).data;
        // allLevels = (await api.get("/api/courses/allLevels", auth)).data; -> no BE endpoint

    } catch (error) {
        showToast("Nie udało się pobrać danych", "error");
        console.log(error);
    }
    createTeacherDropdownListElements();
}

const enableFilterBar = () => {
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

const displayDefaultPageContent = () => {
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
    enableFilterBar();
}

const addCreateCourseButtonAction = () => {
    const createCourseButton = document.querySelector("#createCourse");
    createCourseButton.addEventListener("click", () => {
        const modal = document.querySelector("#addCourseModal");
        modal.showModal();

        teacherInput.addEventListener("input", (e) => {
            const query = e.target.value.toLowerCase().trim();

            if(!query || query.length === 0) {
                teacherDropdown.style.display = "none";
            } else {
                teacherDropdown.style.display = "block";
            }

            const teacherLIs = document.querySelectorAll(".teacherLI");
            teacherLIs.forEach(teacherLI => {
                const isMatch = teacherLI.textContent.includes(query);
                if(isMatch) {
                    teacherLI.style.display = "";
                } else {
                    teacher.style.display = "none";
                }
            });
        });
    });
    
}

const addPageSpecificButtonsEventListeners = () => {
    // addCalendarButtonAction();
    addCreateCourseButtonAction();
    // addChooseSetOfCoursesButtonAction();
}

const workflow = async () => {
    await fetchCourses();
    displayDefaultPageContent();
    addPageSpecificButtonsEventListeners();
}

workflow();