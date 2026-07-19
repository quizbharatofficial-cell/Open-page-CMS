const PASSWORD = "123456";

document.addEventListener("DOMContentLoaded", () => {

    const loginBtn = document.getElementById("loginBtn");
    const uploadBtn = document.getElementById("uploadBtn");

    loginBtn.addEventListener("click", () => {

        const pass = document.getElementById("adminPassword").value;

        if (pass === PASSWORD) {
            document.getElementById("loginBox").style.display = "none";
            document.getElementById("adminPanel").style.display = "block";
          loadAdminPosts();
        } else {
            document.getElementById("loginMsg").textContent = "Wrong Password";
        }

    });

    uploadBtn.addEventListener("click", publishPost);

});

async function publishPost() {

    const title = document.getElementById("postTitle").value.trim();
    const content = document.getElementById("postContent").value.trim();
    const type = document.getElementById("postType").value;

    if (!title || !content) {
        alert("Please enter title and content.");
        return;
    }

    const { error } = await db.from("posts")
        .insert([
            {
                title: title,
                content: content,
                type: type,
                media: ""
            }
        ]);

    if (error) {
        console.error(error);
        alert("Publish failed!");
        return;
    }

    alert("Post published successfully!");

    document.getElementById("postTitle").value = "";
    document.getElementById("postContent").value = "";
  loadAdminPosts();
}
async function loadAdminPosts() {
  const { data, error } = await db
    .from("posts")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
    return;
  }

  const postList = document.getElementById("postList");

  if (!data || data.length === 0) {
    postList.innerHTML = "No Posts";
    return;
  }

  postList.innerHTML = "";

  data.forEach(post => {
    postList.innerHTML += `
      <div class="card">
        <h3>${post.title}</h3>
        <p>${post.content}</p>
      </div>
    `;
  });
}
db.channel("admin-posts")
  .on(
    "postgres_changes",
    {
      event: "*",
      schema: "public",
      table: "posts"
    },
    () => {
      loadAdminPosts();
    }
  )
  .subscribe();