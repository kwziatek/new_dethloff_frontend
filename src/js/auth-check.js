// IMPORTANT: Since we want to execute this script before the HTML page loads, we can't use type="module". Because of that importing any module is impossible, that's why fetch API is used instead of axios.

// page-auth check preventing unlogged user or one with invalid token from seeing contect only for logged users
const PUBLIC_PAGES = ['/', '/pages/contact', '/pages/login', '/pages/aboutSchool'];

const currentPath = window.location.pathname;
const token = localStorage.getItem('jwt_token');

const API_BASE = window.API_URL || 'http://localhost:8080';

function redirectToLogin(error) {
    console.error("Session expired or invalid token: ", error);
    localStorage.removeItem('jwt_token');
    window.location.replace('/');
}

if(!PUBLIC_PAGES.includes(currentPath)) {
    if (!token) {
        redirectToLogin();
    } else {
        fetch("${API_BASE}/api/auth/me", {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then(res => {
            if(!res.ok) {
                redirectToLogin(res);
            }
        })
        .catch((error => {
            redirectToLogin(error);
        }));
    }
}