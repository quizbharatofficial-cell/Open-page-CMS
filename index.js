// ==========================================
// OpenPage CMS V6.0
// index.js
// ==========================================

document.addEventListener("DOMContentLoaded", () => {

    loadFeaturedPosts();
    loadLatestPosts();
    loadCategories();
    loadStatistics();

});

// ==========================================
// Latest Posts
// ==========================================

async function loadLatestPosts() {

    try {

        const { data, error } = await db
            .from("posts")
            .select("*")
            .eq("status", "Published")
            .order("created_at", { ascending: false })
            .limit(6);

        if (error) throw error;

        console.log("Latest Posts:", data);

    } catch (err) {

        console.error(err);

    }

}

// ==========================================
// Featured Posts
// ==========================================

async function loadFeaturedPosts() {

    try {

        const { data, error } = await db
            .from("posts")
            .select("*")
            .eq("status", "Published")
            .eq("featured", true)
            .limit(3);

        if (error) throw error;

        console.log("Featured:", data);

    } catch (err) {

        console.error(err);

    }

}

// ==========================================
// Categories
// ==========================================

async function loadCategories() {

    try {

        const { data, error } = await db
            .from("posts")
            .select("category");

        if (error) throw error;

        const categories = [...new Set(data.map(item => item.category))];

        console.log(categories);

    } catch (err) {

        console.error(err);

    }

}

// ==========================================
// Statistics
// ==========================================

async function loadStatistics() {

    try {

        const { count } = await db
            .from("posts")
            .select("*", { count: "exact", head: true });

        console.log("Total Posts:", count);

    } catch (err) {

        console.error(err);

    }

}

// ==========================================
// Search
// ==========================================

function searchPosts(keyword) {

    keyword = keyword.toLowerCase();

    console.log("Searching:", keyword);

}

// ==========================================
// Dark Mode
// ==========================================

function toggleDarkMode() {

    document.body.classList.toggle("dark");

    localStorage.setItem(
        "darkMode",
        document.body.classList.contains("dark")
    );

}

if (localStorage.getItem("darkMode") === "true") {

    document.body.classList.add("dark");

}

// ==========================================
// Scroll To Top
// ==========================================

window.addEventListener("scroll", () => {

    if (window.scrollY > 300) {

        console.log("Show Scroll Button");

    }

});

// ==========================================
// End
// ==========================================file:///data/user/0/com.foxdebug.acode/files/public/Open page CMS/index.js