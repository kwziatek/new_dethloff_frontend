// page-auth check preventing unlogged user from seeing contect only for logged users
const PUBLIC_PAGES = ['/', '/pages/contact', '/pages/login', 'pages/aboutSchool'];

const currentPath = window.location.pathname;
const token = localStorage.getItem('jwt_token');

if (!PUBLIC_PAGES.includes(currentPath) && !token) {
    window.location.replace('/');
}