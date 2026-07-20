// ==========================================
// OpenPage CMS V7.0
// edit-post.js
// ==========================================

// Login Protection
(async () => {
    const user = await requireLogin();
    if (!user) return;

    loadPost();
})();

// Quill Editor
const quill = new Quill("#editor", {
    theme: "snow"
});

// Elements
const form = document.getElementById("editPostForm");
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

logoutBtn.addEventListener("click", logout);

// Get Post ID
const params = new URLSearchParams(location.search);
const postId = params.get("id");

let featuredImageUrl = "";

// Load Existing Post
async function loadPost() {

    const { data, error } = await db
        .from("posts")
        .select("*")
        .eq("id", postId)
        .single();

    if (error) {
        alert(error.message);
        location.href = "posts.html";
        return;
    }

    title.value = data.title;
    slug.value = data.slug;
    category.value = data.category || "";
    tags.value = (data.tags || []).join(", ");
    status.value = data.status;
    featured.checked = data.featured;
    seoTitle.value = data.seo_title || "";
    seoDescription.value = data.seo_description || "";
    quill.root.innerHTML = data.content || "";

    featuredImageUrl = data.featured_image || "";

    if (featuredImageUrl) {
        preview.src = featuredImageUrl;
        preview.style.display = "block";
    }
}

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

    const fileName = Date.now() + "-" + file.name;

    const { error } = await db.storage
        .from("Upload")
        .upload(fileName, file);

    if (error) throw error;

    const { data } = db.storage
        .from("Upload")
        .getPublicUrl(fileName);

    return data.publicUrl;
}

// Update Post
form.addEventListener("submit", async (e) => {

    e.preventDefault();

    try {

        if (imageInput.files.length > 0) {
            featuredImageUrl =
                await uploadImage(imageInput.files[0]);
        }

        const { error } = await db
            .from("posts")
            .update({

                title: title.value,
                slug: slug.value,
                content: quill.root.innerHTML,
                excerpt: quill.getText().substring(0, 200),
                featured_image: featuredImageUrl,
                category: category.value,
                tags: tags.value
                    .split(",")
                    .map(tag => tag.trim())
                    .filter(tag => tag),

                status: status.value,
                featured: featured.checked,
                seo_title: seoTitle.value,
                seo_description: seoDescription.value,
                updated_at: new Date().toISOString()

            })
            .eq("id", postId);

        if (error) throw error;

        alert("✅ Post Updated Successfully");

        location.href = "posts.html";

    } catch (err) {

        alert(err.message);

    }

});