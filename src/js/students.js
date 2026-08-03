import axios from "axios";

const listOfStudentsSpace = document.querySelector(".setOfStudents");
const filterBar = document.querySelector("#filterBar");
const availableSpace = 16;

const fetchStudents = async () => {
    try {
        const auth = {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('jwt_token')}`
            }
        }
        const response = await axios.get('http://localhost:8080/api/students', auth);
        const data = response.data;
        let shownCount = 0;
        data.forEach(element => {
            const newA = document.createElement("a");
            const newP = document.createElement("p");
            newP.classList.add('student');
            newP.innerHTML = element.name + " " + element.surname;
            newA.href = "/pages/students/" + element.id;
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

const workflow = async () => {
    await fetchStudents();
    enableFilterBar();
};

workflow();