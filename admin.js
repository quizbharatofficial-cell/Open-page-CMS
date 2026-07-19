const API_URL = "https://script.google.com/macros/s/AKfycbxryOZ1SNnR4c7omlzX8gvq0-xychyY8B0r8fbl0kFxbiEOVXA6F0zENvjhIX_W6C7J/exec";
const PASSWORD = "123456";

document.addEventListener("DOMContentLoaded", () => {

    const loginBtn = document.getElementById("loginBtn");
    const uploadBtn = document.getElementById("uploadBtn");

    loginBtn.addEventListener("click", () => {

        const pass = document.getElementById("adminPassword").value;

        if (pass === PASSWORD) {
            document.getElementById("loginBox").style.display = "none";
            document.getElementById("adminPanel").style.display = "block";
        } else {
            document.getElementById("loginMsg").textContent = "Wrong Password";
        }

    });

    uploadBtn.addEventListener("click", async () => {
      alert("Publish button clicked");

        const title = document.getElementById("postTitle").value.trim();
        const content = document.getElementById("postContent").value.trim();
        const type = document.getElementById("postType").value;

        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                title: title,
                content: content,
                media: "",
                type: type
            })
        });

        const result = await response.text();
        alert(result);

        document.getElementById("postTitle").value = "";
        document.getElementById("postContent").value = "";

    });

});