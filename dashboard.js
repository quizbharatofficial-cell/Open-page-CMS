// ==========================================
// OpenPage CMS V7.0
// dashboard.js
// ==========================================

// Login Check
(async () => {

    const user = await requireLogin();

    if (!user) return;

    document.getElementById("welcomeUser").innerHTML =
        "Welcome, " + (user.email || "Admin");

    loadDashboard();

})();

// ==========================================
// Dashboard Data
// ==========================================

async function loadDashboard() {

    await loadTotalPosts();

    await loadPublishedPosts();

    await loadDraftPosts();

    await loadMediaCount();

    await loadRecentPosts();

}

// ==========================================
// Total Posts
// ==========================================

async function loadTotalPosts() {

    const { count, error } = await db
        .from("posts")
        .select("*", {
            count: "exact",
            head: true
        });

    if (!error) {

        document.getElementById("totalPosts").innerHTML = count;

    }

}

// ==========================================
// Published Posts
// ==========================================

async function loadPublishedPosts() {

    const { count, error } = await db
        .from("posts")
        .select("*", {
            count: "exact",
            head: true
        })
        .eq("status", "Published");

    if (!error) {

        document.getElementById("publishedPosts").innerHTML = count;

    }

}

// ==========================================
// Draft Posts
// ==========================================

async function loadDraftPosts() {

    const { count, error } = await db
        .from("posts")
        .select("*", {
            count: "exact",
            head: true
        })
        .eq("status", "Draft");

    if (!error) {

        document.getElementById("draftPosts").innerHTML = count;

    }

}

// ==========================================
// Media Count
// ==========================================

async function loadMediaCount() {

    const { count, error } = await db
        .from("media")
        .select("*", {
            count: "exact",
            head: true
        });

    if (!error) {

        document.getElementById("totalMedia").innerHTML = count;

    }

}

// ==========================================
// Recent Posts
// ==========================================

async function loadRecentPosts() {

    const tbody =
        document.getElementById("recentPosts");

    const { data, error } = await db
        .from("posts")
        .select("title,status,created_at")
        .order("created_at", {
            ascending: false
        })
        .limit(5);

    if (error) {

        tbody.innerHTML =
            "<tr><td colspan='3'>No posts found</td></tr>";

        return;

    }

    tbody.innerHTML = "";

    data.forEach(post => {

        tbody.innerHTML += `
        <tr>

            <td>${post.title}</td>

            <td>${post.status}</td>

            <td>${new Date(post.created_at).toLocaleDateString()}</td>

        </tr>
        `;

    });

}

// ==========================================
// Logout
// ==========================================

document
.getElementById("logoutBtn")
.addEventListener("click", logout);

// ==========================================
// Refresh Dashboard Every 30 Seconds
// ==========================================

setInterval(loadDashboard, 30000);
window.addEventListener("online", async () => {
    console.log("Internet Connected");

    loadDashboard();
});

window.addEventListener("offline", () => {
    console.log("Offline Mode");
});