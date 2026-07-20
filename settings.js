/* ==========================================
   OpenPage CMS V5.1
   Settings
========================================== */

document.addEventListener("DOMContentLoaded", async () => {

    await requireLogin();

    document
        .getElementById("logoutBtn")
        .addEventListener("click", logout);

    document
        .getElementById("saveSettingsBtn")
        .addEventListener("click", saveSettings);

    loadSettings();

});

async function loadSettings() {

    const { data, error } = await db
        .from("settings")
        .select("*")
        .limit(1)
        .maybeSingle();

    if (error) {
        console.error(error.message);
        return;
    }

    if (!data) return;

    document.getElementById("siteName").value =
        data.site_name || "";

    document.getElementById("siteDescription").value =
        data.site_description || "";

    document.getElementById("adminEmail").value =
        data.admin_email || "";

    document.getElementById("logoUrl").value =
        data.logo_url || "";

}

async function saveSettings() {

    const message = document.getElementById("message");

    message.innerText = "";
    message.style.color = "red";

    const settings = {
        id: 1,
        site_name: document.getElementById("siteName").value.trim(),
        site_description: document.getElementById("siteDescription").value.trim(),
        admin_email: document.getElementById("adminEmail").value.trim(),
        logo_url: document.getElementById("logoUrl").value.trim()
    };

    const { error } = await db
        .from("settings")
        .upsert(settings);

    if (error) {
        message.innerText = error.message;
        return;
    }

    message.style.color = "green";
    message.innerText = "✅ Settings saved successfully.";

}