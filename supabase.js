// ======================================
// OpenPage CMS V4.1 Stable
// supabase.js
// ======================================

// Check Supabase Library
console.log(window.supabase);

// Supabase Configuration
const SUPABASE_URL =
"https://qgcsucowbglttqvxaves.supabase.co";

const SUPABASE_KEY =
"sb_publishable_Yh_aG08ic6-45kN5JaaWFg_6yVGa1hO";

// Create Global Client
window.db = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);

// Test Connection
async function testConnection() {

    try {

        const { data, error } = await window.db
            .from("posts")
            .select("*")
            .limit(1);

        if (error) {
            console.error("❌ Supabase Error:", error);
        } else {
            console.log("✅ Supabase Connected Successfully");
            console.log(data);
        }

    } catch (err) {
        console.error("❌ Connection Failed:", err);
    }

}

testConnection();