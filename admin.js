// ======================================
// OpenPage CMS V5.0
// admin.js
// ======================================

// Default Admin Credentials (First Time Only)
if (!localStorage.getItem("adminUsername")) {
    localStorage.setItem("adminUsername", "admin");
}

if (!localStorage.getItem("adminPassword")) {
    localStorage.setItem("adminPassword", "admin123");
}

// Already Logged In?
if (localStorage.getItem("adminLoggedIn") === "true") {
    window.location.href = "dashboard.html";
}

// Login Button
document.getElementById("loginBtn").addEventListener("click", loginAdmin);

// Enter Key Support
document.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
        loginAdmin();
    }
});

function loginAdmin() {

    const username = document
        .getElementById("adminUsername")
        .value
        .trim();

    const password = document
        .getElementById("adminPassword")
        .value
        .trim();

    const savedUsername = localStorage.getItem("adminUsername");
    const savedPassword = localStorage.getItem("adminPassword");

    const message = document.getElementById("loginMessage");

    if (username === savedUsername && password === savedPassword) {

        localStorage.setItem("adminLoggedIn", "true");

        message.style.color = "green";
        message.textContent = "Login Successful...";

        setTimeout(() => {
            window.location.href = "dashboard.html";
        }, 800);

    } else {

        message.style.color = "red";
        message.textContent = "Invalid Username or Password";

    }
}