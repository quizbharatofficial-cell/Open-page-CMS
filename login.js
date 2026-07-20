// ==========================================
// OpenPage CMS V7.0
// login.js
// ==========================================

const loginForm = document.getElementById("loginForm");
const email = document.getElementById("email");
const password = document.getElementById("password");
const message = document.getElementById("message");
const loginBtn = document.getElementById("loginBtn");
const togglePassword = document.getElementById("togglePassword");
const forgotPassword = document.getElementById("forgotPassword");

// Auto Login Check
(async () => {

    const user = await getUser();

    if (user) {

        location.href = "dashboard.html";

    }

})();

// Login
loginForm.addEventListener("submit", async (e) => {

    e.preventDefault();

    message.innerHTML = "";
    loginBtn.disabled = true;
    loginBtn.innerHTML = "Logging in...";

    try {

        await login(
            email.value.trim(),
            password.value
        );

        message.innerHTML = "✅ Login Successful";

        setTimeout(() => {

            location.href = "dashboard.html";

        }, 800);

    } catch (err) {

        message.innerHTML = err.message;

    }

    loginBtn.disabled = false;
    loginBtn.innerHTML = "Login";

});

// Show / Hide Password
togglePassword.addEventListener("click", () => {

    if (password.type === "password") {

        password.type = "text";
        togglePassword.innerHTML = "🙈";

    } else {

        password.type = "password";
        togglePassword.innerHTML = "👁";

    }

});

// Forgot Password
forgotPassword.addEventListener("click", async (e) => {

    e.preventDefault();

    if (!email.value) {

        alert("Enter your email first.");

        return;

    }

    try {

        await forgotPassword(email.value.trim());

        alert("Password reset email sent.");

    } catch (err) {

        alert(err.message);

    }

});

// Enter Key Support
document.addEventListener("keydown", (e) => {

    if (e.key === "Enter") {

        loginForm.requestSubmit();

    }

});