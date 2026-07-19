// ======================================
// OpenPage CMS V4.1 Stable
// dashboard.js Part 1
// ======================================

// Login Check
document.addEventListener("DOMContentLoaded", () => {

    if (localStorage.getItem("adminLoggedIn") !== "true") {
        window.location.href = "admin.html";
        return;
    }

    initDashboard();

});

// ======================================
// Initialize Dashboard
// ======================================

function initDashboard() {

    loadDashboard();

    setupMenu();

    setupButtons();

}

// ======================================
// Menu Active
// ======================================

function setupMenu() {

    document.querySelectorAll(".menu li").forEach(item => {

        item.addEventListener("click", () => {

            document.querySelectorAll(".menu li")
                .forEach(menu => menu.classList.remove("active"));

            item.classList.add("active");

        });

    });

}

// ======================================
// Buttons
// ======================================

function setupButtons() {

    const publishBtn =
        document.getElementById("publishBtn");

    if (publishBtn)
        publishBtn.addEventListener("click", publishPost);

    const logoutBtn =
        document.getElementById("logoutBtn");

    if (logoutBtn)
        logoutBtn.addEventListener("click", logoutAdmin);

}

// ======================================
// Dashboard Loader
// ======================================

async function loadDashboard() {

    await loadStatistics();

    await loadPosts();

    await loadMediaLibrary();

}

// ======================================
// Statistics
// ======================================

async function loadStatistics() {

    const { data, error } = await db
        .from("posts")
        .select("id,type");

    if (error) {

        console.error(error);

        return;

    }

    const posts = data || [];

    document.getElementById("totalPosts").textContent =
        posts.length;

    document.getElementById("totalImages").textContent =
        posts.filter(p => p.type === "image").length;

    document.getElementById("totalVideos").textContent =
        posts.filter(p => p.type === "video").length;

    document.getElementById("totalPDF").textContent =
        posts.filter(p => p.type === "pdf").length;

}

// ======================================
// Logout
// ======================================

function logoutAdmin() {

    if (!confirm("Logout?")) return;

    localStorage.removeItem("adminLoggedIn");

    window.location.href = "admin.html";

}
// ======================================
// dashboard.js Part 2
// Publish Post + Load Posts
// ======================================

// Publish New Post
async function publishPost() {

    const title = document.getElementById("postTitle").value.trim();
const content = document.getElementById("postContent").innerHTML.trim();
    const type = document.getElementById("postType").value;
    const file = document.getElementById("mediaFile").files[0];
const category = document.getElementById("postCategory").value;
const tags = document.getElementById("postTags").value.trim();
  const status = document.getElementById("postStatus").value;
    if (!title || !content) {
        alert("Please enter title and content.");
        return;
    }

    let media = "";

    // Upload Media (Image / Video / PDF)
    if (file) {

        const fileName = Date.now() + "_" + file.name;

        const { error: uploadError } = await db.storage
            .from("uploads")
            .upload(fileName, file);

console.error(uploadError);

alert(
    "Upload Error:\n" +
    uploadError.message +
    "\n\n" +
    uploadError.statusCode
);

return;
        }

        const { data } = db.storage
            .from("uploads")
            .getPublicUrl(fileName);

        media = data.publicUrl;
    }

    // Save Post
  const { error } = await db
    .from("posts")
    .insert([{
        title,
        content,
        type,
        media,
        category,
        tags,
        status
    }]);
    if (error) {
        console.error(error);
        alert("Publish failed.");
        return;
    }

    alert("Post Published Successfully!");

    // Clear Form
    document.getElementById("postTitle").value = "";
    document.getElementById("postContent").innerHTML = "";
    document.getElementById("postType").value = "text";
    document.getElementById("mediaFile").value = "";
  document.getElementById("postCategory").value = "News";
document.getElementById("postTags").value = "";
document.getElementById("postStatus").value = "Published";
    loadDashboard();
}

// ======================================
// Load Posts
// ======================================

async function loadPosts() {

    const { data, error } = await db
        .from("posts")
        .select("*")
        .order("created_at", { ascending: false });

    if (error) {
        console.error(error);
        return;
    }

    const tbody = document.getElementById("postTableBody");

    tbody.innerHTML = "";

    if (!data || data.length === 0) {

        tbody.innerHTML = `
        <tr>
            <td colspan="7" style="text-align:center">
                No Posts Found
            </td>
        </tr>`;

        return;
    }

    data.forEach(post => {

        tbody.innerHTML += `
        <tr>

            <td>${post.id}</td>

            <td>${post.title}</td>

            <td>${post.type}</td>

            <td>${post.category || "-"}</td>

<td>${post.status || "Published"}</td>

            <td>
                ${new Date(post.created_at).toLocaleDateString()}
            </td>

            <td>

                <button
                    class="editBtn"
                    data-id="${post.id}">
                    Edit
                </button>

                <button
                    class="deleteBtn"
                    data-id="${post.id}">
                    Delete
                </button>

            </td>

        </tr>`;

    });

}
// ======================================
// dashboard.js Part 3
// Edit + Delete + Search + Realtime
// ======================================

let editingPostId = null;

// =======================
// Edit Post
// =======================

document.addEventListener("click", async (e) => {

    if (e.target.classList.contains("editBtn")) {

        editingPostId = Number(e.target.dataset.id);

        const { data, error } = await db
            .from("posts")
            .select("*")
            .eq("id", editingPostId)
            .single();

        if (error) {
            console.error(error);
            return;
        }

        document.getElementById("editTitle").value =
            data.title;

        document.getElementById("editContent").value =
            data.content;

        document.getElementById("editModal").style.display =
            "flex";
    }

});

// =======================
// Update Post
// =======================

document.getElementById("updatePostBtn")
?.addEventListener("click", async () => {

    const title =
        document.getElementById("editTitle").value.trim();

    const content =
        document.getElementById("editContent").value.trim();

    const { error } = await db
        .from("posts")
        .update({
            title,
            content
        })
        .eq("id", editingPostId);

    if (error) {
        alert("Update Failed");
        console.error(error);
        return;
    }

    document.getElementById("editModal").style.display =
        "none";

    loadDashboard();

});

// =======================
// Cancel Edit
// =======================

document.getElementById("cancelEditBtn")
?.addEventListener("click", () => {

    document.getElementById("editModal").style.display =
        "none";

});

// =======================
// Delete Post
// =======================

document.addEventListener("click", async (e) => {

    if (!e.target.classList.contains("deleteBtn")) return;

    if (!confirm("Delete this post?")) return;

    const id = Number(e.target.dataset.id);

    const { error } = await db
        .from("posts")
        .delete()
        .eq("id", id);

    if (error) {
        alert("Delete Failed");
        console.error(error);
        return;
    }

    loadDashboard();

});

// =======================
// Search
// =======================

document.getElementById("searchPost")
?.addEventListener("input", function () {

    const keyword =
        this.value.toLowerCase();

    document.querySelectorAll("#postTableBody tr")
        .forEach(row => {

            row.style.display =
                row.innerText
                    .toLowerCase()
                    .includes(keyword)
                    ? ""
                    : "none";

        });

});

// =======================
// Realtime Refresh
// =======================

db.channel("dashboard-posts")
.on(
    "postgres_changes",
    {
        event: "*",
        schema: "public",
        table: "posts"
    },
    () => {

        loadDashboard();

    }
)
.subscribe();
// ======================================
// dashboard.js Part 4
// Media Library + Analytics + Notifications
// ======================================

// =======================
// Load Media Library
// =======================

async function loadMediaLibrary() {

    const { data, error } = await db
        .from("posts")
        .select("*")
        .order("created_at", { ascending: false });

    if (error) {
        console.error(error);
        return;
    }

    const mediaLibrary =
        document.getElementById("mediaLibrary");

    if (!mediaLibrary) return;

    mediaLibrary.innerHTML = "";

    data.forEach(post => {

        if (!post.media) return;

        let mediaHTML = "";

        if (post.type === "image") {

            mediaHTML = `
                <img src="${post.media}"
                     class="media-thumb"
                     alt="${post.title}">
            `;

        } else if (post.type === "video") {

            mediaHTML = `
                <video class="media-thumb" controls>
                    <source src="${post.media}">
                </video>
            `;

        } else if (post.type === "pdf") {

            mediaHTML = `
                <a href="${post.media}" target="_blank">
                    📄 Open PDF
                </a>
            `;
        }

        mediaLibrary.innerHTML += `
            <div class="card">
                ${mediaHTML}
                <h4>${post.title}</h4>
            </div>
        `;

    });

}

// =======================
// Analytics
// =======================

function loadAnalytics() {

    document.getElementById("totalViews").textContent = "0";
    document.getElementById("totalLikes").textContent = "0";
    document.getElementById("totalComments").textContent = "0";
    document.getElementById("totalShares").textContent = "0";

}

// =======================
// Notifications
// =======================

function addNotification(message) {

    const list =
        document.getElementById("notificationList");

    if (!list) return;

    list.innerHTML =
        `<div class="card">${message}</div>` +
        list.innerHTML;

}

// =======================
// Recent Activity
// =======================

function addActivity(message) {

    const list =
        document.getElementById("activityList");

    if (!list) return;

    list.innerHTML =
        `
        <div class="card">

            <strong>
                ${new Date().toLocaleString()}
            </strong>

            <br><br>

            ${message}

        </div>
        ` + list.innerHTML;

}

// =======================
// Dashboard Refresh
// =======================

async function refreshDashboard() {

    await loadStatistics();

    await loadPosts();

    await loadMediaLibrary();

    loadAnalytics();

}
// ======================================
// OpenPage CMS V4.1 Stable
// dashboard.js Part 5 (Final)
// ======================================

// =======================
// Change Admin Password
// =======================

const changePasswordBtn = document.getElementById("changePasswordBtn");

if (changePasswordBtn) {

    changePasswordBtn.addEventListener("click", () => {

        const username = document
            .getElementById("newUsername")
            .value
            .trim();

        const password = document
            .getElementById("newPassword")
            .value
            .trim();

        if (username.length < 3) {
            alert("Username must be at least 3 characters.");
            return;
        }

        if (password.length < 4) {
            alert("Password must be at least 4 characters.");
            return;
        }

        localStorage.setItem("adminUsername", username);
        localStorage.setItem("adminPassword", password);

        alert("Settings Saved Successfully.");

        document.getElementById("newUsername").value = "";
        document.getElementById("newPassword").value = "";

        addNotification("Admin settings updated.");
        addActivity("Username & Password changed.");

    });

}
// =======================
// Auto Refresh
// =======================

setInterval(() => {

    refreshDashboard();

}, 30000);

// =======================
// Dashboard Startup
// =======================

document.addEventListener("DOMContentLoaded", () => {

    refreshDashboard();

    addNotification("Dashboard Loaded");

    addActivity("Admin logged in.");

});

// =======================
// Global Error Handler
// =======================

window.addEventListener("error", (event) => {

    console.error("Dashboard Error:", event.error);

});

// ======================================
// End of dashboard.js
// ======================================
function formatText(command){
    document.execCommand(command,false,null);
}

// ======================
// Media Preview
// ======================

const mediaInput=document.getElementById("mediaFile");
const previewArea=document.getElementById("previewArea");

if(mediaInput){

mediaInput.addEventListener("change",()=>{

previewArea.innerHTML="";

const file=mediaInput.files[0];

if(!file) return;

if(file.type.startsWith("image/")){

previewArea.innerHTML=
`<img src="${URL.createObjectURL(file)}" class="preview-image">`;

}

else if(file.type.startsWith("video/")){

previewArea.innerHTML=
`<video controls class="preview-video">
<source src="${URL.createObjectURL(file)}">
</video>`;

}

else if(file.type==="application/pdf"){

previewArea.innerHTML=
`<p>📄 ${file.name}</p>`;

}

});

}
const menuToggle = document.getElementById("menuToggle");
const sidebar = document.querySelector(".sidebar");

menuToggle?.addEventListener("click", () => {
    sidebar.classList.toggle("show");
});
  const sections = document.querySelectorAll(".section");

function openSection(id) {

    document.querySelectorAll(".section").forEach(section => {
        section.classList.remove("active");
    });

    document.getElementById(id)?.classList.add("active");
}

document.getElementById("menuDashboard")
?.addEventListener("click", () => openSection("dashboardSection"));

document.getElementById("menuCreate")
?.addEventListener("click", () => openSection("createSection"));

document.getElementById("menuPosts")
?.addEventListener("click", () => openSection("postsSection"));

document.getElementById("menuMedia")
?.addEventListener("click", () => openSection("mediaSection"));

document.getElementById("menuAnalytics")
?.addEventListener("click", () => openSection("analyticsSection"));

document.getElementById("menuNotification")
?.addEventListener("click", () => openSection("notificationSection"));

document.getElementById("menuSettings")
?.addEventListener("click", () => openSection("settingsSection"));
document.querySelectorAll(".menu li").forEach(item=>{
    item.addEventListener("click",()=>{
        sidebar.classList.remove("show");
    });
});