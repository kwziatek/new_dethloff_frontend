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
import { setRedirectToast, showToast } from "./global";

const API_URL = import.meta.env.VITE_API_URL;
const api = axios.create({ baseURL: API_URL });
const auth = {
  headers: {
    Authorization: `Bearer ${localStorage.getItem("jwt_token")}`,
  },
};

const availableSpace = 32;
const listOfCoursesSpace = document.querySelector("#setOfAllCourses");

const courseNameInput = document.querySelector("#courseNameInput");
const teacherInput = document.querySelector("#teacherSearchInput");
const teacherDropdown = document.querySelector("#teacherDropdown");
const hiddenTeacherIdInput = document.querySelector("#chosenTeacherId");
const levelInput = document.querySelector("#levelSearchInput");

const coursesSetInput = document.querySelector("#coursesSetSearchInput");
const coursesSetDropdown = document.querySelector("#coursesSetDropdown");
const hiddenCoursesSetIdInput = document.querySelector("#chosenCoursesSetId");

let allCourses = [];
let allSetsOfCourses = [];
let allTeachers = [];

const createTeacherDropdownListElements = () => {
  allTeachers.forEach((teacher) => {
    const newP = document.createElement("p");
    newP.innerHTML = teacher.name + " " + teacher.surname;
    newP.dataset.teacherId = teacher.id;
    const newLI = document.createElement("li");
    newLI.classList.add("teacherLI");
    newLI.style.display = "none";
    // teacher id needs to be stored in LI or P element
    newLI.appendChild(newP);
    teacherDropdown.appendChild(newLI);
  });
};

const createCoursesSetDropdownListElements = () => {
  allSetsOfCourses.forEach((course) => {
    const newP = document.createElement("p");
    newP.innerHTML = course.name;
    newP.dataset.coursesSetId = course.id;
    const newLI = document.createElement("li");
    newLI.classList.add("coursesSetLI");
    newLI.style.display = "none";
    // coursesSet id needs to be stored in LI or P element
    newLI.appendChild(newP);
    coursesSetDropdown.appendChild(newLI);
  });
};

const fetchCourses = async () => {
  try {
    allCourses = (await api.get("/api/courses", auth)).data;
    allSetsOfCourses = (await api.get("/api/courses/setsOfCourses", auth)).data;
    allTeachers = (await api.get("/api/teachers", auth)).data;
  } catch (error) {
    showToast("Nie udało się pobrać danych", "error");
    console.log(error);
  }
  createTeacherDropdownListElements();
  createCoursesSetDropdownListElements();
};

const enableFilterBar = () => {
  filterBar.addEventListener("input", (e) => {
    const userInput = e.target.value.toLowerCase();
    let matchCount = 0;

    Array.from(listOfCoursesSpace.children).forEach((course) => {
      const nameSurname = course.querySelector("p").textContent.toLowerCase();
      const isMatch = nameSurname.includes(userInput);

      if (isMatch && matchCount < availableSpace) {
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
  allCourses.forEach((element) => {
    // card-link
    const cardLink = document.createElement("a");
    cardLink.href = "/pages/courseDetails" + "?id=" + element.id;
    cardLink.classList.add("card-link");
    // card-content
    const cardContent = document.createElement("div");
    cardContent.classList.add("card-content");
    // course info - paragraph
    const courseInfo = document.createElement("p");
    courseInfo.innerHTML =
      element.name +
      " <br>" +
      element.teacher.name +
      " " +
      element.teacher.surname;
    // link elements
    cardContent.appendChild(courseInfo);
    cardLink.appendChild(cardContent);
    // check if there is space for card-link
    if (shownCount >= availableSpace) {
      cardLink.style.display = "none";
    } else {
      cardLink.style.display = "";
      shownCount++;
    }
    listOfCoursesSpace.appendChild(cardLink);
  });
  enableFilterBar();
};

const addSubmitFormAction = (modal) => {
  const form = document.querySelector("#addCourseForm");
  const validLevels = Array.from(
    document.querySelectorAll("#levelsList option"),
  ).map((validLevel) => validLevel.value);

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (!courseNameInput.value) {
      courseNameInput.setCustomValidity("Wpisz nazwę kursu!");
      courseNameInput.reportValidity();
    } else if (!teacherInput.value) {
      teacherInput.setCustomValidity("Wybierz lektora z listy!");
      teacherInput.reportValidity();
    } else if (!validLevels.includes(levelInput.value)) {
      levelInput.setCustomValidity("Wybierz poziom kursu z listy!");
      levelInput.reportValidity();
    } else {
      // create json - BE API payload
      const newCourse = {
        name: courseNameInput.value,
        teacherId: hiddenTeacherIdInput.value,
        level: levelInput.value,
      };
      form.reset();
      // call BE API
      try {
        const responseData = await (
          await api.post("/api/courses", newCourse, auth)
        ).data;
        console.log(responseData);
        setRedirectToast("Pomyślnie utworzono kurs", "success");
        // window.location.href = `/coursedetails?id=${responseData.id}`;
        modal.close();
      } catch (error) {
        modal.close();
        showToast("Błąd serwera, nie utworzono kursu", "error");
        console.log(error);
      }
    }
  });
};

const addCreateCourseButtonAction = () => {
  const createCourseButton = document.querySelector("#createCourse");
  const modal = document.querySelector("#addCourseModal");
  createCourseButton.addEventListener("click", () => {
    modal.showModal();

    // *name section* //
    courseNameInput.addEventListener("input", (e) => {
      e.target.setCustomValidity("");
    });

    courseNameInput.addEventListener("blur", (e) => {
      if (e.target.value !== "") {
        e.target.classList.add("valid");
      } else {
        e.target.classList.remove("valid");
      }
    });
    // *name section* //

    // *teacher section* //
    teacherInput.addEventListener("input", (e) => {
      hiddenTeacherIdInput.value = "";
      e.target.setCustomValidity("");
      const query = e.target.value.toLowerCase().trim();

      if (!query || query.length === 0) {
        teacherDropdown.style.display = "none";
      } else {
        teacherDropdown.style.display = "block";
      }

      Array.from(teacherDropdown.querySelectorAll(".teacherLI")).forEach(
        (teacherLI) => {
          const isMatch = teacherLI.textContent
            .toLocaleLowerCase()
            .trim()
            .includes(query);
          if (isMatch) {
            teacherLI.style.display = "";
          } else {
            teacherLI.style.display = "none";
          }
        },
      );
    });
    teacherDropdown.addEventListener("mousedown", (e) => {
      const chosenTeacher = e.target.textContent;
      teacherInput.value = chosenTeacher;
      teacherDropdown.style.display = "none";
      hiddenTeacherIdInput.value = e.target.dataset.teacherId;
      teacherInput.classList.add("valid");
    });

    teacherInput.addEventListener("blur", () => {
      if (hiddenTeacherIdInput.value === "") {
        teacherInput.value = "";
        teacherDropdown.style.display = "none";
        teacherInput.classList.remove("valid");
      }
    });
    // *teacher section* //

    // *level section* //
    levelInput.addEventListener("input", (e) => {
      e.target.setCustomValidity("");
    });

    levelInput.addEventListener("blur", (e) => {
      if (e.target.value !== "") {
        e.target.classList.add("valid");
      } else {
        e.target.classList.remove("valid");
      }
    });
    // *level section* //
  });
  addSubmitFormAction(modal);
};

const addChooseSetOfCoursesButtonAction = () => {
  const chooseSetOfCoursesButton = document.querySelector("#chooseCoursesSet");
  const modal = document.querySelector("#chooseCoursesSetModal");

  chooseSetOfCoursesButton.addEventListener("click", () => {
    modal.showModal();

    coursesSetInput.addEventListener("input", (e) => {
      hiddenCoursesSetIdInput.value = "";
      e.target.setCustomValidity("");

      const query = coursesSetInput.value.toLocaleLowerCase().trim();
      if (!query || query.length === 0) {
        coursesSetDropdown.style.display = "none";
      } else {
        coursesSetDropdown.style.display = "block";
      }

      Array.from(coursesSetDropdown.querySelectorAll(".coursesSetLI")).forEach(
        (coursesSetLI) => {
          const isMatch = coursesSetLI.textContent
            .toLocaleLowerCase()
            .trim()
            .includes(query);
          if (isMatch) {
            coursesSetLI.style.display = "";
          } else {
            coursesSetLI.style.display = "none";
          }
        },
      );

      coursesSetDropdown.addEventListener("mousedown", (e) => {
        const chosenCoursesSet = e.target.textContent;
        coursesSetInput.value = chosenCoursesSet;
        coursesSetDropdown.style.display = "none";
        hiddenCoursesSetIdInput.value = e.target.dataset.coursesSetId;
      });

      coursesSetInput.addEventListener("blur", () => {
        if (hiddenCoursesSetIdInput.value === "") {
          coursesSetInput.value = "";
          coursesSetDropdown.style.display = "none";
        }
      });
    });
  });
};

const addPageSpecificButtonsEventListeners = () => {
  // addCalendarButtonAction();
  addCreateCourseButtonAction();
  addChooseSetOfCoursesButtonAction();
};

const workflow = async () => {
  await fetchCourses();
  displayDefaultPageContent();
  addPageSpecificButtonsEventListeners();
};

workflow();
