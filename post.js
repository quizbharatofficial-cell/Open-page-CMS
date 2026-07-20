// ==========================================
// OpenPage CMS V7.0
// posts.js
// ==========================================

// Login Protection
(async () => {

    const user = await requireLogin();

    if (!user) return;

    loadPosts();

})();

const table = document.getElementById("postsTable");
const searchInput = document.getElementById("searchInput");
const logoutBtn = document.getElementById("logoutBtn");

logoutBtn.addEventListener("click", logout);

// ==========================================
// Load Posts
// ==========================================

async function loadPosts(keyword = "") {

    table.innerHTML =
        "<tr><td colspan='6'>Loading...</td></tr>";

    let query = db
        .from("posts")
        .select("*")
        .order("created_at", {
            ascending: false
        });

    const { data, error } = await query;

    if (error) {

        table.innerHTML =
            "<tr><td colspan='6'>Error loading posts</td></tr>";

        return;

    }

    let posts = data;

    if (keyword) {

        posts = posts.filter(post =>
            post.title
            .toLowerCase()
            .includes(keyword.toLowerCase())
        );

    }

    if (posts.length === 0) {

        table.innerHTML =
            "<tr><td colspan='6'>No posts found</td></tr>";

        return;

    }

    table.innerHTML = "";

    posts.forEach(post => {

        table.innerHTML += `

<tr>

<td>

<img
src="${post.featured_image || 'assets/no-image.png'}"
style="width:60px;height:60px;object-fit:cover;border-radius:8px;">

</td>

<td>${post.title}</td>

<td>${post.category || "-"}</td>

<td>

<span class="${post.status === 'Published'
? 'badge-success'
: 'badge-warning'}">

${post.status}

</span>

</td>

<td>

${new Date(post.created_at)
.toLocaleDateString()}

</td>

<td>

<button
class="btn"
onclick="editPost(${post.id})">

Edit

</button>

<button
class="btn delete-btn"
onclick="deletePost(${post.id})">

Delete

</button>

</td>

</tr>

`;

    });

}

// ==========================================
// Search
// ==========================================

searchInput.addEventListener("input", () => {

    loadPosts(searchInput.value);

});

// ==========================================
// Edit
// ==========================================

function editPost(id) {

    location.href =
        "edit-post.html?id=" + id;

}

// ==========================================
// Delete
// ==========================================

async function deletePost(id) {

    if (!confirm("Delete this post?"))
        return;

    const { error } = await db
        .from("posts")
        .delete()
        .eq("id", id);

    if (error) {

        alert(error.message);

        return;

    }

    loadPosts();

}

// ==========================================
// Auto Refresh
// ==========================================

setInterval(loadPosts, 30000);