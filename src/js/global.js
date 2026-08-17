const logout = document.querySelector("#logOut");
const goBack = document.querySelector("#goBack");

if (logout) {
    logout.addEventListener("click", (e) => {
        localStorage.removeItem("jwt_token");
        window.location.href = "login";
    });
}

if (goBack) {
    goBack.addEventListener("click", (e) => {
        window.history.back();
    });
}

const showToast = (message, type = "success", duration = 3000) => {
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
    console.dir(toast);
}

showToast("próbny tost", "error", 2000);

