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

const coursesSetInput2 = document.querySelector("#coursesSetSearchInput2");
const coursesSetDropdown2 = document.querySelector("#coursesSetDropdown2");
const hiddenCoursesSetIdInput2 = document.querySelector("#chosenCoursesSetId2");

let allCourses = [];
let allSetsOfCourses = [];
let allTeachers = [];

const removeValidClassFromInput = (inputFields) => {
  inputFields.forEach((input) => input.classList.remove("valid"));
};

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
    coursesSetDropdown2.appendChild(newLI.cloneNode(true));
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
    courseInfo.classList.add("card-paragraph");
    courseInfo.innerHTML =
      element.name +
      " " +
      element.setOfCourses.name +
      " <br>" +
      element.teacher.name +
      " " +
      element.teacher.surname;
    courseInfo.dataset.coursesSetId = element.setOfCourses
      ? element.setOfCourses.id
      : null;
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

const submitAddCourseForm = (modal) => {
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
        setOfCoursesId: hiddenCoursesSetIdInput.value,
        teacherId: hiddenTeacherIdInput.value,
        level: levelInput.value,
      };
      removeValidClassFromInput(Array.from(form.querySelectorAll("input")));
      form.reset();
      // call BE API
      try {
        const responseData = await (
          await api.post("/api/courses", newCourse, auth)
        ).data;
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

    // *set of courses section* //
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
    });
    coursesSetDropdown.addEventListener("mousedown", (e) => {
      const chosenCoursesSet = e.target.textContent;
      coursesSetInput.value = chosenCoursesSet;
      coursesSetDropdown.style.display = "none";
      hiddenCoursesSetIdInput.value = e.target.dataset.coursesSetId;
      coursesSetInput.classList.add("valid");
    });

    coursesSetInput.addEventListener("blur", () => {
      if (hiddenCoursesSetIdInput.value === "") {
        coursesSetInput.value = "";
        coursesSetDropdown.style.display = "none";
        coursesSetInput.classList.remove("valid");
      }
    });
    // *set of courses section* //

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
  submitAddCourseForm(modal);
};

const submitChooseCoursesSetForm = (modal) => {
  const form = document.querySelector("#chooseCoursesSetForm");
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    showToast("wybrano grupę kursów: " + coursesSetInput2.value, "success");
    Array.from(listOfCoursesSpace.children).forEach((course) => {
      const courseData = course.querySelector(".card-paragraph");
      if (
        !courseData.dataset.coursesSetId ||
        hiddenCoursesSetIdInput2.value !== courseData.dataset.coursesSetId
      ) {
        course.style.display = "none";
      } else {
        course.style.display = "";
      }
    });
    removeValidClassFromInput(Array.from(form.querySelectorAll("input")));
    form.reset();
    modal.close();
  });
};

const clearCoursesSetFilters = (modal) => {
  let shownCount = 0;
  const clearFiltersButton = document.querySelector("#clearFilters");
  clearFiltersButton.addEventListener("click", () => {
    listOfCoursesSpace.querySelectorAll(".card-link").forEach((card) => {
      if (shownCount <= availableSpace) {
        card.style.display = "";
        shownCount++;
      } else {
        card.style.display = "none";
      }
    });
    modal.close();
  });
};

const addChooseSetOfCoursesButtonAction = () => {
  const chooseSetOfCoursesButton = document.querySelector("#chooseCoursesSet");
  const modal = document.querySelector("#chooseCoursesSetModal");

  chooseSetOfCoursesButton.addEventListener("click", () => {
    modal.showModal();

    coursesSetInput2.addEventListener("input", (e) => {
      hiddenCoursesSetIdInput2.value = "";
      e.target.setCustomValidity("");

      const query = coursesSetInput2.value.toLocaleLowerCase().trim();
      if (!query || query.length === 0) {
        coursesSetDropdown2.style.display = "none";
      } else {
        coursesSetDropdown2.style.display = "block";
      }

      Array.from(coursesSetDropdown2.querySelectorAll(".coursesSetLI")).forEach(
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

      coursesSetDropdown2.addEventListener("mousedown", (e) => {
        const chosenCoursesSet = e.target.textContent;
        coursesSetInput2.value = chosenCoursesSet;
        coursesSetDropdown2.style.display = "none";
        hiddenCoursesSetIdInput2.value = e.target.dataset.coursesSetId;
        coursesSetInput2.classList.add("valid");
      });

      coursesSetInput2.addEventListener("blur", () => {
        if (hiddenCoursesSetIdInput2.value === "") {
          coursesSetInput2.value = "";
          coursesSetDropdown2.style.display = "none";
          coursesSetInput2.classList.remove("valid");
        }
      });
    });
  });
  clearCoursesSetFilters(modal);
  submitChooseCoursesSetForm(modal);
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
