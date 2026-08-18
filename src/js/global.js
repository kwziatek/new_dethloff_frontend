const logout = document.querySelector("#logOut");
const goBack = document.querySelector("#goBack");

if (logout) {
    logout.addEventListener("click", (e) => {
        localStorage.removeItem("jwt_token");
        setRedirectToast("Wylogowano", "info");
        window.location.href = "login";
    });
}

if (goBack) {
    goBack.addEventListener("click", (e) => {
        window.history.back();
    });
}

export const showToast = (message, type = "success", duration = 3000) => {
    let toastContainer = document.querySelector("#toast-container");
    if(!toastContainer) {
        toastContainer = document.createElement("div");
        toastContainer.id = "toast-container";
        document.body.appendChild(toastContainer);
    } 
    let toast = document.createElement("div");
    toast.textContent = message;
    toast.className =`toast ${type}`;
    toastContainer.appendChild(toast);

    setTimeout(() => toast.remove(), duration);
}

const toastWorkflow = () => {
    const toastData = sessionStorage.getItem("redirect_toast");
    if(toastData) {
        const {message, type} = JSON.parse(toastData);
        showToast(message, type);
        sessionStorage.removeItem("redirect_toast");
    }   
}

toastWorkflow();

// -- Common page logic ----------------------------------------------------------------------------------------------------------------

// -- Utility methods ------------------------------------------------------------------------------------------------------------------
// Utility methods can also be found in common page logic

export const setRedirectToast = (message, type) => {
    sessionStorage.setItem("redirect_toast", JSON.stringify( {message, type }));
}

// -- Utility methods ------------------------------------------------------------------------------------------------------------------