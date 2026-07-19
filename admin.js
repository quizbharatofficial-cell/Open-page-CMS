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

    uploadBtn.addEventListener("click", publishPost);

});

async function publishPost() {

    const title = document.getElementById("postTitle").value.trim();
    const content = document.getElementById("postContent").value.trim();
    const type = document.getElementById("postType").value;

    if (!title || !content) {
        alert("Please enter title and content.");
        return;
    }

    const { error } = await db.from("posts")
        .insert([
            {
                title: title,
                content: content,
                type: type,
                media: ""
            }
        ]);

    if (error) {
        console.error(error);
        alert("Publish failed!");
        return;
    }

    alert("Post published successfully!");

    document.getElementById("postTitle").value = "";
    document.getElementById("postContent").value = "";
}