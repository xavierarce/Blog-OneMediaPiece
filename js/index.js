import { addModals } from "./modals.js";
import { setupFormHandlers } from "./forms.js";
import { checkSession, logout } from "./components/navBars/navbar.js";
import { openCreateArticleModal } from "./createArticle.js";
import { fetchArticles } from "./components/articles/articles.js";
import { onSetSession } from "./components/navBars/sideBar.js";
import { fetchUsers } from "./admin.js";

addModals();

const sidebarButtons = document.querySelectorAll(".sidebar-button");
sidebarButtons.forEach((button) => {
  onSetSession(button);
});

var loginModal = document.getElementById("loginModal");
var registerModal = document.getElementById("registerModal");

var loginBtn = document.getElementById("loginBtn");
var registerBtn = document.getElementById("registerBtn");
var createArticleBtn = document.getElementById("createArticleBtn");

var closeLoginModal = document.getElementById("closeLoginModal");
var closeRegisterModal = document.getElementById("closeRegisterModal");

loginBtn.onclick = function () {
  loginModal.style.display = "block";
};

registerBtn.onclick = function () {
  registerModal.style.display = "block";
};

closeLoginModal.onclick = function () {
  loginModal.style.display = "none";
};

closeRegisterModal.onclick = function () {
  registerModal.style.display = "none";
};

window.onclick = function (event) {
  if (event.target == loginModal) {
    loginModal.style.display = "none";
  }
  if (event.target == registerModal) {
    registerModal.style.display = "none";
  }
};

if (createArticleBtn) {
  createArticleBtn.addEventListener("click", openCreateArticleModal);
}

async function handleLogout() {
  const loggedOut = await logout();
  if (loggedOut) {
    document.getElementById("nickname").textContent = "";
    document.getElementById("nickname").style.display = "none";
    document.getElementById("logoutBtn").style.display = "none";
    document.getElementById("loginBtn").style.display = "inline-block";
    document.getElementById("registerBtn").style.display = "inline-block";
  }
}

document.getElementById("logoutBtn").addEventListener("click", handleLogout);

document.addEventListener("DOMContentLoaded", async () => {
  let response = await checkSession();
  const currentUrl = window.location.href;
  if (!currentUrl.includes("/admin")) {
    await fetchArticles();
  }
  if (currentUrl.includes("/admin")) {
    if (response?.role !== 3) {
      return (window.location.href = "/blog");
    }
    await fetchUsers();
  }
});

setupFormHandlers();
