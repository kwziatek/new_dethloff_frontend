import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;
const api = axios.create({baseURL: API_URL});
const id = new URLSearchParams(window.location.search).get('id');

const fillPageWithStudentData = (data) => {
    document.querySelector("#studentName").value = data.name || "";;
    document.querySelector("#studentSurname").value = data.surname || "";
    document.querySelector("#studentPESEL").value = data.pesel || "";
    document.querySelector("#studentBirthDate").value = data.birthDate || "";
    document.querySelector("#studentBirthPlace").value = data.placeOfBirth || "";

    document.querySelector("#studentCity").value = data.city || "";
    document.querySelector("#studentStreet").value = data.street || "";
    document.querySelector("#studentBuildingNumber").value = data.flatNumber || "";
    document.querySelector("#studentPostcode").value = data.postalCode || "";
    document.querySelector("#studentPhoneNumber").value = data.phoneNumber || "";
    document.querySelector("#studentEmail").value = data.email || "";

    document.querySelector("#studentGuardianName").value = data.guardianName || "";
    document.querySelector("#studentGuardianSurname").value = data.guardianSurname || "";
    document.querySelector("#studentGuardianPhoneNumber").value = data.guardianPhoneNumber || "";
    document.querySelector("#studentGuardianEmail").value = data.guardianEmail || "";
    document.querySelector("#studentGuardianCity").value = data.guardianCity || "";
    document.querySelector("#studentGuardianStreet").value = data.guardianStreet || "";
    document.querySelector("#studentGuardianBuildingNumber").value = data.guardianFlatNumber || "";
    document.querySelector("#studentGuardianPostcode").value = data.guardianPostalCode || "";

    document.querySelector("#studentCompanyName").value = data.companyName || "";
    document.querySelector("#studentNIP").value = data.NIP || "";
    document.querySelector("#studentCompanyPhoneNumber").value = data.companyPhoneNumber || "";
    document.querySelector("#studentCompanyEmail").value = data.companyEmail || "";
    document.querySelector("#studentCompanyCity").value = data.companyCity || "";
    document.querySelector("#studentCompanyStreet").value = data.companyStreet || "";
    document.querySelector("#studentCompanyBuildingNumber").value = data.companyFlatNumber || "";
    document.querySelector("#studentCompanyPostcode").value = data.companyPostalCode || "";

    document.querySelector("#studentSource").value = data.marketingSources || "";
    document.querySelector("#studentJoiningDate").value = data.joiningDate || "";
}

const fetchStudentData = async () => {
    try {
        const auth = {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("jwt_token")}`
            }
        }
        const response = await api.get(`api/students/${id}`, auth);
        const data = await response.data;
        fillPageWithStudentData(data);
        console.log(data);
    } catch(error) {
        console.error("Error fetching student details: " + error);
    }
}

const addEditEventListener = () => {
    document.querySelector("#edit").addEventListener("click", () => {
        document.querySelectorAll("input").forEach((dataInput) => {
            console.log(dataInput);
            dataInput.removeAttribute("readonly");
        });
        document.querySelector("#edit").textContent = "Zapisz";
    });
    
}

const onEditButtonClick = () => {
    addEditEventListener();
}

const workflow = async () => {
    await fetchStudentData();
    onEditButtonClick();
}

workflow();