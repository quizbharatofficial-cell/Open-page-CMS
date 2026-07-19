// ======================================
// OpenPage CMS V4.1 Stable
// app.js
// ======================================

document.addEventListener("DOMContentLoaded", () => {
    loadPosts();
});

async function loadPosts() {

    const container =
        document.getElementById("postsContainer");

    container.innerHTML = "<p>Loading...</p>";

    const { data, error } = await db
        .from("posts")
        .select("*")
        .order("created_at", { ascending: false });

    if (error) {

        container.innerHTML =
            "<p>Failed to load posts.</p>";

        console.error(error);

        return;
    }

    if (!data || data.length === 0) {

        container.innerHTML =
            "<p>No posts available.</p>";

        return;
    }

    container.innerHTML = "";

    data.forEach(post => {

        let mediaHTML = "";

        if (post.type === "image" && post.media) {

            mediaHTML = `
                <img src="${post.media}" class="post-image" alt="${post.title}">
            `;

        } else if (post.type === "video" && post.media) {

            mediaHTML = `
                <video controls class="post-video">
                    <source src="${post.media}">
                </video>
            `;

        } else if (post.type === "pdf" && post.media) {

            mediaHTML = `
                <a href="${post.media}" target="_blank">
                    📄 View PDF
                </a>
            `;
        }

        container.innerHTML += `
            <div class="post-card">

                ${mediaHTML}

                <h2>${post.title}</h2>

                <p>${post.content}</p>

                <small>
                    ${new Date(post.created_at).toLocaleDateString()}
                </small>

            </div>
        `;
    });

}