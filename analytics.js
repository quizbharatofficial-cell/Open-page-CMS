/* ==========================================
   OpenPage CMS V5.1
   Analytics Dashboard
========================================== */

document.addEventListener("DOMContentLoaded", async () => {

    await requireLogin();

    document
        .getElementById("logoutBtn")
        .addEventListener("click", logout);

    loadAnalytics();

});

async function loadAnalytics() {

    /* ---------- Current User ---------- */

    const user = await getUser();

    document.getElementById("currentUser").innerText =
        user ? user.email : "-";

    /* ---------- Posts ---------- */

    const { data: posts, error } = await db
        .from("posts")
        .select("status");

    if (error) {
        alert(error.message);
        return;
    }

    const totalPosts = posts.length;

    const publishedPosts = posts.filter(
        p => (p.status || "").toLowerCase() === "published"
    ).length;

    const draftPosts = posts.filter(
        p => (p.status || "").toLowerCase() === "draft"
    ).length;

    document.getElementById("totalPosts").innerText = totalPosts;
    document.getElementById("publishedPosts").innerText = publishedPosts;
    document.getElementById("draftPosts").innerText = draftPosts;

    /* ---------- Images ---------- */

    const { data: images, error: imageError } = await db.storage
        .from("uploads")
        .list("", { limit: 1000 });

    if (imageError) {
        console.error(imageError.message);
        document.getElementById("totalImages").innerText = "0";
        return;
    }

    document.getElementById("totalImages").innerText = images.length;

}