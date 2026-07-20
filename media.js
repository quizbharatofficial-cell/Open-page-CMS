/* ==========================================
   OpenPage CMS V5.1
   Media Library
========================================== */
const offlineImages =
JSON.parse(localStorage.getItem("offlineImages") || "[]");
document.addEventListener("DOMContentLoaded", async () => {

    await requireLogin();

    document
        .getElementById("logoutBtn")
        .addEventListener("click", logout);

    document
        .getElementById("uploadBtn")
        .addEventListener("click", uploadImage);

    loadImages();

});

async function uploadImage() {

    const input = document.getElementById("mediaFile");
    const message = document.getElementById("message");

    if (!input.files.length) {
        message.style.color = "red";
        message.innerText = "Please select an image.";
        return;
    }

    const file = input.files[0];
  if (!navigator.onLine) {

    offlineImages.push({
        name: file.name,
        size: file.size,
        type: file.type,
        date: Date.now()
    });

    localStorage.setItem(
        "offlineImages",
        JSON.stringify(offlineImages)
    );

    message.style.color = "orange";
    message.innerText = "Image queued for upload.";

    input.value = "";

    return;
  }
    const fileName = Date.now() + "-" + file.name;

    const { error } = await db.storage
        .from("uploads")
        .upload(fileName, file);

    if (error) {
        message.style.color = "red";
        message.innerText = error.message;
        return;
    }

    message.style.color = "green";
    message.innerText = "✅ Image uploaded successfully.";

    input.value = "";

    loadImages();

}

async function loadImages() {

    const grid = document.getElementById("mediaGrid");

    grid.innerHTML = "Loading...";

    const { data, error } = await db.storage
        .from("uploads")
        .list("", {
            limit: 100,
            sortBy: { column: "name", order: "desc" }
        });

    if (error) {
        grid.innerHTML = error.message;
        return;
    }

    grid.innerHTML = "";

    data.forEach(file => {

        const url = db.storage
            .from("uploads")
            .getPublicUrl(file.name)
            .data.publicUrl;

        grid.innerHTML += `
            <div class="media-card">

                <img src="${url}" width="180">

                <br><br>

                <button onclick="copyUrl('${url}')">
                    Copy URL
                </button>

                <button onclick="deleteImage('${file.name}')">
                    Delete
                </button>

            </div>
        `;

    });

}

function copyUrl(url) {

    navigator.clipboard.writeText(url);

    alert("Image URL copied.");

}

async function deleteImage(fileName) {

    if (!confirm("Delete this image?")) return;

    const { error } = await db.storage
        .from("uploads")
        .remove([fileName]);

    if (error) {
        alert(error.message);
        return;
    }

    loadImages();

}
window.addEventListener("online", () => {

    console.log("Sync pending images...");

});