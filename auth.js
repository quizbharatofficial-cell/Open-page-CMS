// ==========================================
// OpenPage CMS V7.0
// auth.js
// ==========================================

// Login
async function login(email, password) {

    const { data, error } = await db.auth.signInWithPassword({
        email,
        password
    });

    if (error) {
        throw error;
    }

    return data.user;
}

// Register
async function register(email, password) {

    const { data, error } = await db.auth.signUp({
        email,
        password
    });

    if (error) {
        throw error;
    }

    return data.user;
}

// Logout
async function logout() {

    await db.auth.signOut();

    location.href = "login.html";
}

// Current User
async function getUser() {

    const { data } = await db.auth.getUser();

    return data.user;
}

// Check Login
async function requireLogin() {

    const user = await getUser();

    if (!user) {

        location.href = "login.html";

        return null;
    }

    return user;
}

// Forgot Password
async function forgotPassword(email) {

    const { error } =
        await db.auth.resetPasswordForEmail(email, {
            redirectTo: location.origin + "/reset-password.html"
        });

    if (error) {

        throw error;
    }

    return true;
}

// Update Password
async function updatePassword(password) {

    const { error } =
        await db.auth.updateUser({
            password
        });

    if (error) {

        throw error;
    }

    return true;
}

// User Profile
async function loadProfile() {

    const user = await getUser();

    if (!user)
        return null;

    const {
        data
    } = await db
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

    return data;
}

// Save Profile
async function saveProfile(fullName, avatar) {

    const user = await getUser();

    const {
        error
    } = await db
        .from("profiles")
        .upsert({
            id: user.id,
            full_name: fullName,
            avatar: avatar
        });

    if (error)
        throw error;

}

// Auth State
db.auth.onAuthStateChange((event) => {

    console.log("Auth:", event);

});