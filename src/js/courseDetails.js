import axios from "axios";
import {
  showToast,
  setRedirectToast,
  createNameSurnameDropdownListElements,
} from "./global";

const API_URL = import.meta.env.VITE_API_URL;
const api = axios.create({ baseURL: API_URL });

const courseId = new URLSearchParams(window.location.search).get("id");

const allStudents = [];

const standardContainer = document.querySelector(".standard-container");
const leftContainer = document.querySelector(".left-container");
const mainSection = leftContainer.querySelector(".main-section");
const rightContainer = document.querySelector(".right-container");
const auth = {
  headers: {
    Authorization: `Bearer ${localStorage.getItem("jwt_token")}`,
  },
};

const fetchCourseDetails = async () => {
  try {
    const courseData = await api.get(`/api/courses/${courseId}`, auth);
    return courseData.data;
  } catch (e) {
    showToast("Błąd serwera", "error");
    console.log(e);
  }
};

const fetchAllStudents = async () => {
  try {
    const studentsData = await api.get(`/api/students`, auth);
    return studentsData.data;
  } catch (e) {
    showToast("Błąd serwera", "error");
  }
};

const fillEsstentialData = (courseData) => {
  const courseNameParagraph =
    standardContainer.querySelector("#courseName").nextElementSibling;
  courseNameParagraph.innerText = courseData.name;
  const courseLevelParagprah =
    standardContainer.querySelector("#courseLevel").nextElementSibling;
  courseLevelParagprah.innerText = courseData.level;
  const courseTeacherParagraph =
    standardContainer.querySelector("#courseTeacher").nextElementSibling;
  courseTeacherParagraph.innerText =
    courseData.teacher.name + " " + courseData.teacher.surname;
  //   const courseHoursParagraph =
  //     standardContainer.querySelector("#courseHours").nextElementSibling;
  //   courseHoursParagraph.innerText = courseData.???;
  const courseCoursesSetParagraph =
    standardContainer.querySelector("#courseCoursesSet").nextElementSibling;
  courseCoursesSetParagraph.innerText = courseData.setOfCourses.name;
  //   const courseClassroomParagraph =
  //     standardContainer.querySelector("#courseClassroom").nextElementSibling;
  //   courseClassroomParagraph.innerText = courseData.???;
};

const fillEnrolledStudents = (courseData) => {
  const studentsCount = leftContainer.querySelector("#students-count");
  studentsCount.innerText = courseData.students.length;

  courseData.students.forEach((student) => {
    const studentData = document.createElement("p");
    studentData.innerHTML = `${student.name + " " + student.surname}`;
    mainSection.appendChild(studentData);
  });
};

const fillPageWithCourseData = (courseData) => {
  fillEsstentialData(courseData);
  fillEnrolledStudents(courseData);
};

const addEnrollStudentButtonAction = (
  studentInput,
  studentsDropdown,
  chosenStudentHiddenInput,
) => {
  const enrollButton = leftContainer.querySelector("#enroll-student-button");
  const confirmButton = leftContainer.querySelector(
    "#confirm-enroll-student-button",
  );

  studentInput.addEventListener("input", (e) => {
    const query = e.target.value.toLowerCase().trim();

    if (studentInput.classList.contains("valid")) {
      studentInput.classList.remove("valid");
      studentsDropdown.style.display = "block";
      chosenStudentHiddenInput.value = "";
      confirmButton.classList.add("hidden");
    }

    Array.from(mainSection.querySelectorAll(".studentLI")).forEach(
      (studentLI) => {
        const text = studentLI.querySelector("p").innerText.toLowerCase();

        if (text.includes(query)) {
          studentLI.style.display = "block";
        } else {
          studentLI.style.display = "none";
        }
      },
    );
  });

  enrollButton.addEventListener("click", () => {
    const isHidden = studentInput.style.display === "none";
    if (isHidden) {
      studentInput.style.display = "block";
      if (!studentInput.classList.contains("valid")) {
        studentsDropdown.style.display = "block";
      }
    } else {
      studentInput.style.display = "none";
      studentsDropdown.style.display = "none";
    }

    confirmButton.addEventListener("click", async () => {
      try {
        const data = await api.post(
          `/api/courses/${courseId}/students/${chosenStudentHiddenInput.value}`,
          null,
          auth,
        );
        console.log(data);
        showToast("Zapisano ucznia na kurs", "success");
      } catch (e) {
        showToast("Błąd serwera", "error");
      } finally {
        confirmButton.classList.add("hidden");
        studentsDropdown.style.display = "none";
        studentInput.style.display = "none";
      }
    });
  });

  studentsDropdown.addEventListener("click", (e) => {
    // console.log(e.target);
    studentInput.value = e.target.innerText;
    studentsDropdown.style.display = "none";
    chosenStudentHiddenInput.value = e.target.dataset.personId;
    studentInput.classList.add("valid");
    confirmButton.classList.remove("hidden");
  });
};

const addOtherHTMLElements = () => {
  const studentInput = document.createElement("input");
  studentInput.style.display = "none";
  mainSection.appendChild(studentInput);

  const studentsDropdown = document.createElement("ul");
  studentsDropdown.classList.add("dropdown-list");
  mainSection.appendChild(studentsDropdown);

  const chosenStudentId = document.createElement("input");
  chosenStudentId.style.visibility = "hidden";
  mainSection.appendChild(chosenStudentId);

  return [studentInput, studentsDropdown, chosenStudentId];
};

const loadPageContent = async () => {
  const [courseData, studentsData] = await Promise.all([
    fetchCourseDetails(),
    fetchAllStudents(),
  ]);

  fillPageWithCourseData(courseData);
  const [studentInput, studentsDropdown, chosenStudentHiddenInput] =
    addOtherHTMLElements();

  addEnrollStudentButtonAction(
    studentInput,
    studentsDropdown,
    chosenStudentHiddenInput,
  );
  createNameSurnameDropdownListElements(
    studentsData,
    "studentLI",
    studentsDropdown,
  ); //create students dropdown in html
};

const workflow = () => {
  loadPageContent();
};

workflow();
