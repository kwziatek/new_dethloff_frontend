const logout = document.querySelector("#logOut");
const goBack = document.querySelector("#goBack");
const boxes = document.querySelectorAll(".box");

if (logout) {
    logout.addEventListener("mouseover", (e) => {
        e.target.style.backgroundColor = "red";
        e.target.style.color = "#BAC095";
    });

    logout.addEventListener("mouseleave", (e) => {
        e.target.style.backgroundColor = "#BAC095";
        e.target.style.color = "red";
    });

    logout.addEventListener("click", (e) => {
        localStorage.removeItem("jwt_token");
        window.location.href = "login";
    });
}

if (goBack) {
    goBack.addEventListener("mouseover", (e) => {
        e.target.style.backgroundColor = "#636B2F";
        e.target.style.color = "#BAC095";
    });

    goBack.addEventListener("mouseleave", (e) => {
        e.target.style.backgroundColor = "#BAC095";
        e.target.style.color = "#636B2F";
    });

    goBack.addEventListener("click", (e) => {
        // localStorage.removeItem("jwt_token");
        window.history.back();
    });
}


if (boxes) {
    boxes.forEach((box) => {
        box.addEventListener("mouseover", (e) => {
            e.target.style.backgroundColor = "#3D4127";
            e.target.style.color = "#BAC095";
            // e.target.style.fontWeight = "bold"; 
        });

        box.addEventListener("mouseleave", (e) => {
            e.target.style.backgroundColor = "#BAC095";
            e.target.style.color = "#3D4127";
        });
    });
}
