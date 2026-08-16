import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;
const api = axios.create({baseURL: API_URL});
const teacherId = new URLSearchParams(window.location.search).get('id');
const auth = {
    headers: {
        Authorization: `Bearer ${localStorage.getItem("jwt_token")}`
    }
};
const modal = document.querySelector("#deleteModal");
const deleteBtn = document.querySelector("#delete");
const cancelBtn = document.querySelector("#cancelBtn");
const confirmBtn = document.querySelector("#confirmBtn");

const fillPageWithStudentData = (data) => {
    document.querySelector("#teacherName").value = data.name || "";;
    document.querySelector("#teacherSurname").value = data.surname || "";
    document.querySelector("#teacherGender").value = data.gender || "";
    document.querySelector("#teacherPESEL").value = data.pesel || "";
    document.querySelector("#teacherBirthDate").value = data.birthDate || "";
    document.querySelector("#teacherBirthPlace").value = data.placeOfBirth || "";

    document.querySelector("#teacherCity").value = data.city || "";
    document.querySelector("#teacherStreet").value = data.street || "";
    document.querySelector("#teacherBuildingNumber").value = data.flatNumber || "";
    document.querySelector("#teacherPostcode").value = data.postalCode || "";
    document.querySelector("#teacherPhoneNumber").value = data.phoneNumber || "";
    document.querySelector("#teacherEmail").value = data.email || "";

    document.querySelector("#teacherCompanyName").value = data.companyName || "";
    document.querySelector("#teacherNIP").value = data.NIP || "";
    document.querySelector("#teacherCompanyPhoneNumber").value = data.companyPhoneNumber || "";
    document.querySelector("#teacherCompanyEmail").value = data.companyEmail || "";
    document.querySelector("#teacherCompanyCity").value = data.companyCity || "";
    document.querySelector("#teacherCompanyStreet").value = data.companyStreet || "";
    document.querySelector("#teacherCompanyBuildingNumber").value = data.companyFlatNumber || "";
    document.querySelector("#teacherCompanyPostcode").value = data.companyPostalCode || "";

    document.querySelector("#teacherSource").value = data.marketingSources || "";
    document.querySelector("#teacherJoiningDate").value = data.joiningDate || "";
}

const getStudentDataFromPage = () => {
    // Helper function to safely extract trimmed value or return null
    const getVal = (selector) => {
        const value = document.querySelector(selector)?.value?.trim();
        return value ? value : null;
    };

    const teacherDetails = {
        id: teacherId,

        name: getVal("#teacherName"),
        surname: getVal("#teacherSurname"),
        gender: getVal("#teacherGender"),
        pesel: getVal("#teacherPESEL"),
        birthDate: getVal("#teacherBirthDate"),
        placeOfBirth: getVal("#teacherBirthPlace"),

        city: getVal("#teacherCity"),
        street: getVal("#teacherStreet"),
        flatNumber: getVal("#teacherBuildingNumber"),
        postalCode: getVal("#teacherPostcode"),
        phoneNumber: getVal("#teacherPhoneNumber"),
        email: getVal("#teacherEmail"),

        companyName: getVal("#teacherCompanyName"),
        NIP: getVal("#teacherNIP"),
        companyPhoneNumber: getVal("#teacherCompanyPhoneNumber"),
        companyEmail: getVal("#teacherCompanyEmail"),
        companyCity: getVal("#teacherCompanyCity"),
        companyStreet: getVal("#teacherCompanyStreet"),
        companyFlatNumber: getVal("#teacherCompanyBuildingNumber"),
        companyPostalCode: getVal("#teacherCompanyPostcode"),

        marketingSources: getVal("#teacherSource"),
        joiningDate: getVal("#teacherJoiningDate")
    };

    return teacherDetails;
};

const fetchStudentData = async () => {
    try {
        const response = await api.get(`/api/teachers/${teacherId}`, auth);
        const data = await response.data;
        fillPageWithStudentData(data);
        console.log(data);
    } catch(error) {
        console.error("Error fetching teacher details: " + error);
    }
}

const handleEditSaveClick = async () => {
    const editBtn = document.querySelector("#edit");
    const inputs = document.querySelectorAll("input");
    const dataSelect = document.querySelector("#teacherGender");

    // Check if we are currently in edit mode
    console.log(editBtn);
    const isEditing = editBtn.dataset.state === "editing";

    if(!isEditing) {
        inputs.forEach(input => input.removeAttribute("readonly"));
        dataSelect.removeAttribute("disabled");
        editBtn.textContent = "Zapisz";
        editBtn.dataset.state = "editing";
    } else {
        const teacherData = getStudentDataFromPage();

        //TODO: call BE API 
        await api.put("/api/teachers", getStudentDataFromPage(), auth);

        inputs.forEach(input => input.setAttribute("readonly", "true"));
        dataSelect.setAttribute("disabled", true);
        editBtn.textContent = "Edytuj";
        editBtn.dataset.state = "idle";
    }
};

document.querySelector("#edit").addEventListener("click", handleEditSaveClick);

deleteBtn.addEventListener("click", () => {
    modal.showModal();
});

cancelBtn.addEventListener("click", () => {
    modal.close();
});

confirmBtn.addEventListener("click", async () => {
    modal.close();
    try {
        await api.delete(`/api/teachers/${teacherId}`, auth);
        window.location.href = "/pages/teachers";
    } catch(error) {
        console.log(error);
    }
});

const workflow = async () => {
    await fetchStudentData();
}

workflow();