// ==========================================
// OpenPage CMS V7.0
// create-post.js
// ==========================================

// Login Protection
// Offline Queue
const offlinePosts =
JSON.parse(localStorage.getItem("offlinePosts") || "[]");
(async () => {
    const user = await requireLogin();
    if (!user) return;
})();

// Quill Editor
const quill = new Quill("#editor", {
    theme: "snow",
    placeholder: "Write your post here...",
    modules: {
        toolbar: [
            [{ header: [1, 2, 3, false] }],
            ["bold", "italic", "underline"],
            ["blockquote", "code-block"],
            [{ list: "ordered" }, { list: "bullet" }],
            ["link", "image"],
            ["clean"]
        ]
    }
});

// Elements
const form = document.getElementById("postForm");
const title = document.getElementById("title");
const slug = document.getElementById("slug");
const category = document.getElementById("category");
const tags = document.getElementById("tags");
const status = document.getElementById("status");
const featured = document.getElementById("featured");
const seoTitle = document.getElementById("seoTitle");
const seoDescription = document.getElementById("seoDescription");
const imageInput = document.getElementById("featuredImage");
const preview = document.getElementById("previewImage");
const logoutBtn = document.getElementById("logoutBtn");

let featuredImageUrl = "";

// Logout
logoutBtn.addEventListener("click", logout);

// Auto Slug
title.addEventListener("input", () => {

    slug.value = title.value
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");

});

// Preview Image
imageInput.addEventListener("change", () => {

    const file = imageInput.files[0];

    if (!file) return;

    preview.src = URL.createObjectURL(file);
    preview.style.display = "block";

});

// Upload Image
async function uploadImage(file) {

    const fileName =
        Date.now() + "-" + file.name;

    const { error } =
        await db.storage
            .from("Upload")
            .upload(fileName, file);

    if (error)
        throw error;

    const { data } =
        db.storage
            .from("Upload")
            .getPublicUrl(fileName);

    return data.publicUrl;

}

// Save Post
form.addEventListener("submit", async (e) => {

    e.preventDefault();
  if (!navigator.onLine) {

    offlinePosts.push({
        title: title.value,
        slug: slug.value,
        content: quill.root.innerHTML,
        category: category.value,
        tags: tags.value,
        status: status.value,
        created_at: Date.now()
    });

    localStorage.setItem(
        "offlinePosts",
        JSON.stringify(offlinePosts)
    );

    alert("Post saved offline.");

    form.reset();
    quill.setText("");

    return;
  }

    try {

        if (imageInput.files.length > 0) {

            featuredImageUrl =
                await uploadImage(
                    imageInput.files[0]
                );

        }

        const user = await getUser();

        const { error } =
            await db
                .from("posts")
                .insert({

                    title: title.value,

                    slug: slug.value,

                    content: quill.root.innerHTML,

                    excerpt: quill.getText().substring(0, 200),

                    featured_image: featuredImageUrl,

                    category: category.value,

                    tags: tags.value
                        .split(",")
                        .map(tag => tag.trim()),

                    status: status.value,

                    featured: featured.checked,

                    seo_title: seoTitle.value,

                    seo_description: seoDescription.value,

                    author: user.id

                });

        if (error)
            throw error;

        alert("✅ Post Saved Successfully");

        location.href = "posts.html";

    } catch (err) {

        alert(err.message);

    }

});
window.addEventListener("online", () => {
    console.log("Sync pending posts...");
});