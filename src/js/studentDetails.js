import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;
const api = axios.create({baseURL: API_URL});
const studentId = new URLSearchParams(window.location.search).get('id');
const auth = {
    headers: {
        Authorization: `Bearer ${localStorage.getItem("jwt_token")}`
    }
}

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

const getStudentDataFromPage = () => {
    // Helper function to safely extract trimmed value or return null
    const getVal = (selector) => {
        const value = document.querySelector(selector)?.value?.trim();
        return value ? value : null;
    };

    const studentDetails = {
        id: studentId,

        name: getVal("#studentName"),
        surname: getVal("#studentSurname"),
        pesel: getVal("#studentPESEL"),
        birthDate: getVal("#studentBirthDate"),
        placeOfBirth: getVal("#studentBirthPlace"),

        city: getVal("#studentCity"),
        street: getVal("#studentStreet"),
        flatNumber: getVal("#studentBuildingNumber"),
        postalCode: getVal("#studentPostcode"),
        phoneNumber: getVal("#studentPhoneNumber"),
        email: getVal("#studentEmail"),

        guardianName: getVal("#studentGuardianName"),
        guardianSurname: getVal("#studentGuardianSurname"),
        guardianPhoneNumber: getVal("#studentGuardianPhoneNumber"),
        guardianEmail: getVal("#studentGuardianEmail"),
        guardianCity: getVal("#studentGuardianCity"),
        guardianStreet: getVal("#studentGuardianStreet"),
        guardianFlatNumber: getVal("#studentGuardianBuildingNumber"),
        guardianPostalCode: getVal("#studentGuardianPostcode"),

        companyName: getVal("#studentCompanyName"),
        NIP: getVal("#studentNIP"),
        companyPhoneNumber: getVal("#studentCompanyPhoneNumber"),
        companyEmail: getVal("#studentCompanyEmail"),
        companyCity: getVal("#studentCompanyCity"),
        companyStreet: getVal("#studentCompanyStreet"),
        companyFlatNumber: getVal("#studentCompanyBuildingNumber"),
        companyPostalCode: getVal("#studentCompanyPostcode"),

        marketingSources: getVal("#studentSource"),
        joiningDate: getVal("#studentJoiningDate")
    };

    return studentDetails;
};

const fetchStudentData = async () => {
    try {
        const response = await api.get(`api/students/${studentId}`, auth);
        const data = await response.data;
        fillPageWithStudentData(data);
        console.log(data);
    } catch(error) {
        console.error("Error fetching student details: " + error);
    }
}

const handleEditSaveClick = async () => {
    const editBtn = document.querySelector("#edit");
    const inputs = document.querySelectorAll("input");

    // Check if we are currently in edit mode
    console.log(editBtn);
    const isEditing = editBtn.dataset.state === "editing";

    if(!isEditing) {
        inputs.forEach(input => input.removeAttribute("readonly"));
        editBtn.textContent = "Zapisz";
        editBtn.dataset.state = "editing";
    } else {
        const studentData = getStudentDataFromPage();

        //TODO: call BE API 
        await api.put("/api/students", getStudentDataFromPage(), auth);

        inputs.forEach(input => input.setAttribute("readonly", "true"));
        editBtn.textContent = "Edytuj";
        editBtn.dataset.state = "idle";
    }
};

document.querySelector("#edit").addEventListener("click", handleEditSaveClick);


const workflow = async () => {
    await fetchStudentData();
}

workflow();