import axios from "axios";

const listOfStudentsSpace = document.querySelector(".setOfStudents");
const filterBar = document.querySelector("#filterBar");

try {
    const auth = {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('jwt_token')}`
        }
    }
    const response = await axios.get('http://localhost:8080/api/students', auth);
    const data = response.data;
    data.forEach(element => {
        const newA = document.createElement("a");
        const newP = document.createElement("p");
        newP.classList.add('student');
        newP.innerHTML = element.name + " " + element.surname;
        newA.href = "/pages/students/" + element.id;
        newA.appendChild(newP);
        listOfStudentsSpace.append(newA);
    });
    
} catch(e) {
    alert(e.message);
}

filterBar.addEventListener("input", (e) => {
    const userInput = e.target.value.toLowerCase();
    let matchCount = 0;
    
    Array.from(listOfStudentsSpace.children).forEach(student => {
        const nameSurname = student.querySelector('.student').textContent.toLowerCase();
        const isMatch = nameSurname.includes(userInput)

        if(isMatch && matchCount < 30) {
            student.style.display = ""; // Restores standard CSS layout
            matchCount++;
        } else {
            student.style.display = "none";
        }
    });

});

