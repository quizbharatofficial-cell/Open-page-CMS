const API_URL =
"https://script.google.com/macros/s/AKfycbxryOZ1SNnR4c7omlzX8gvq0-xychyY8B0r8fbl0kFxbiEOVXA6F0zENvjhIX_W6C7J/exec";

let allPosts = [];

document.addEventListener("DOMContentLoaded", () => {

    loadPosts();

    const searchInput = document.getElementById("searchInput");

    if (searchInput) {

        searchInput.addEventListener("input", () => {

            const keyword = searchInput.value.toLowerCase();

            const filtered = allPosts.filter(post =>
                (post.title || "").toLowerCase().includes(keyword) ||
                (post.content || "").toLowerCase().includes(keyword)
            );

            renderPosts(filtered);

        });

    }

});

async function loadPosts() {

    const loading = document.getElementById("loading");

    try {

        const response = await fetch(API_URL);

        allPosts = await response.json();

        renderPosts(allPosts);

    } catch (err) {

        console.error(err);

        if (loading) {

            loading.innerHTML = "Failed to load posts.";

        }

    }

}function renderPosts(posts) {

    const container = document.getElementById("postsContainer");
    const loading = document.getElementById("loading");
    const noPost = document.getElementById("noPost");

    if (!container) return;

    container.innerHTML = "";

    if (loading) loading.style.display = "none";

    if (!posts || posts.length === 0) {
        if (noPost) noPost.style.display = "block";
        return;
    }

    if (noPost) noPost.style.display = "none";

    posts.reverse().forEach(post => {

        let mediaHTML = "";

        if (post.type === "image" && post.media) {
            mediaHTML = `<img src="${post.media}" class="post-image">`;
        }

        if (post.type === "video" && post.media) {
            mediaHTML = `
                <video class="post-video" controls>
                    <source src="${post.media}">
                </video>`;
        }

        if (post.type === "pdf" && post.media) {
            mediaHTML = `
                <p>
                    <a href="${post.media}" target="_blank">
                        📄 Open PDF
                    </a>
                </p>`;
        }

        container.innerHTML += `
        <article class="post-card">

            <div class="post-header">
                <img src="assets/logo.png" class="post-avatar">

                <div>
                    <h3>${post.title || ""}</h3>
                    <small>${post.date || ""}</small>
                </div>
            </div>

            <div class="post-content">
                <p>${post.content || ""}</p>
                ${mediaHTML}
            </div>

            <div class="post-footer">
                <button>👍 Like</button>
                <button>💬 Comment</button>
                <button>📤 Share</button>
            </div>

        </article>`;
    });

}