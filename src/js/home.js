

const boxes = document.querySelectorAll(".box");

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
