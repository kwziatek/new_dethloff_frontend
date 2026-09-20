import axios from "axios";
import { showToast, setRedirectToast } from "./global";

const API_URL = import.meta.env.VITE_API_URL;
const api = axios.create({ baseURL: API_URL });

const courseId = new URLSearchParams(window.location.search).get("id");

const standardContainer = document.querySelector(".standard-container");
const leftContainer = document.querySelector(".left-container");
const rightContainer = document.querySelector(".right-container");

const fetchCourseDetails = async () => {
  const auth = {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("jwt_token")}`,
    },
  };

  try {
    const courseData = await api.get(`/api/courses/${courseId}`, auth);
    return courseData.data;
  } catch (e) {
    showToast("Błąd serwera", "error");
    console.log(e);
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
  const mainSection = leftContainer.querySelector(".main-section");
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

const loadPageContent = async () => {
  const courseData = await fetchCourseDetails();
  console.log(courseData);
  fillPageWithCourseData(courseData);
};

const workflow = () => {
  loadPageContent();
};

workflow();
