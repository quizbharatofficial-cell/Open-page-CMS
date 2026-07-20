// ==========================================
// OpenPage CMS V7.0
// supabase.js
// ==========================================

// Project URL
const SUPABASE_URL =
"https://qgcsucowbglttqvxaves.supabase.co";

// Publishable (Anon) Key
const SUPABASE_ANON_KEY =
"sb_publishable_Yh_aG08ic6-45kN5JaaWFg_6yVGa1hO";

// Create Client
const db = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY,
    {
        auth: {
            persistSession: true,
            autoRefreshToken: true,
            detectSessionInUrl: true
        }
    }
);

// ==========================================
// Session
// ==========================================

async function getSession() {

    const {
        data,
        error
    } = await db.auth.getSession();

    if (error) {

        console.error(error);

        return null;

    }

    return data.session;

}

// ==========================================
// Current User
// ==========================================

async function getCurrentUser() {

    const {
        data,
        error
    } = await db.auth.getUser();

    if (error) {

        console.error(error);

        return null;

    }

    return data.user;

}

// ==========================================
// Sign Out
// ==========================================

async function signOut() {

    await db.auth.signOut();

    location.href = "login.html";

}

// ==========================================
// Auth State
// ==========================================

db.auth.onAuthStateChange((event) => {

    console.log("Auth Event :", event);

});

// ==========================================
// Connection Test
// ==========================================

async function testConnection() {

    const {
        error
    } = await db
        .from("settings")
        .select("*")
        .limit(1);

    if (error) {

        console.log("Supabase Connected");

    } else {

        console.log("Database Connected");

    }

}

testConnection();

// ==========================================
// End
// ==========================================