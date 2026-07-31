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