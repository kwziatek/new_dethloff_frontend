import axios from "axios";
import { setRedirectToast } from "./global";

const API_URL = import.meta.env.VITE_API_URL;
const api = axios.create({ baseURL: API_URL });

const listOfTeachersSpace = document.querySelector("#setOfTeachers");
const filterBar = document.querySelector("#filterBar");
const availableSpace = 32;
const modal = document.getElementById("teacherModal");
const form = document.getElementById("teacherForm");

const fetchTeachers = async () => {
  try {
    const auth = {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("jwt_token")}`,
      },
    };
    const response = await api.get("/api/teachers", auth);
    const data = response.data;
    let shownCount = 0;
    data.forEach((element) => {
      // card-link
      const cardLink = document.createElement("a");
      cardLink.href = "/pages/teacherDetails" + "?id=" + element.id;
      cardLink.classList.add("card-link");
      // card-content
      const cardContent = document.createElement("div");
      cardContent.classList.add("card-content");
      // teacher info - paragraph
      const teacherInfo = document.createElement("p");
      teacherInfo.innerHTML = element.name + " " + element.surname;
      // link elements
      cardContent.appendChild(teacherInfo);
      cardLink.appendChild(cardContent);
      // check if there is space for card-link
      if (shownCount >= availableSpace) {
        cardLink.style.display = "none";
      } else {
        cardLink.style.display = "";
        shownCount++;
      }
      listOfTeachersSpace.appendChild(cardLink);
    });
  } catch (e) {
    alert(e.message);
  }
};

const enableFilterBar = async () => {
  filterBar.addEventListener("input", (e) => {
    const userInput = e.target.value.toLowerCase();
    let matchCount = 0;

    Array.from(listOfTeachersSpace.children).forEach((teacher) => {
      const nameSurname = teacher.querySelector("p").textContent.toLowerCase();
      const isMatch = nameSurname.includes(userInput);

      if (isMatch && matchCount < availableSpace) {
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
};

const submitButtonAction = async () => {
  form.addEventListener("submit", async (e) => {
    // e.preventDefault();

    const formData = new FormData(form);
    const payload = Object.fromEntries(formData);
    console.log(JSON.stringify(form));

    const auth = {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("jwt_token")}`,
      },
    };
    try {
      const response = await api.post("/api/teachers", payload, auth);
      const data = await response.data;
      setRedirectToast("Pomyślnie dodano lektora", "success");
      window.location.href = `/pages/teacherDetails?id=${data.id}`;
      modal.close();
    } catch (error) {
      console.error("Failed to add teacher: ", error);
    }
  });
};

const workflow = async () => {
  await fetchTeachers();
  enableFilterBar();
  addTeacherButtonAction();
  submitButtonAction();
};

workflow();
