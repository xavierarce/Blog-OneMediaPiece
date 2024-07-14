import { addModals } from "./modals.js";
import { setupFormHandlers } from "./forms.js";
import { checkSession, logout } from "./components/navBars/navbar.js";
import { openCreateArticleModal } from "./createArticle.js";
import { fetchArticles } from "./components/articles/articles.js";
import { onSetSession } from "./components/navBars/sideBar.js";
import { fetchUsers } from "./admin.js";

// Initialize modals
addModals();

//sidebar buttons
const sidebarButtons = document.querySelectorAll(".sidebar-button");
sidebarButtons.forEach((button) => {
  onSetSession(button);
});

// Get modal elements
var loginModal = document.getElementById("loginModal");
var registerModal = document.getElementById("registerModal");

// Get buttons to open modals
var loginBtn = document.getElementById("loginBtn");
var registerBtn = document.getElementById("registerBtn");
var createArticleBtn = document.getElementById("createArticleBtn"); // Assuming you have a button for creating articles

// Get <span> elements that close the modals
var closeLoginModal = document.getElementById("closeLoginModal");
var closeRegisterModal = document.getElementById("closeRegisterModal");

// When the user clicks the button, open the login modal
loginBtn.onclick = function () {
  loginModal.style.display = "block";
};

// When the user clicks the button, open the register modal
registerBtn.onclick = function () {
  registerModal.style.display = "block";
};

// When the user clicks on <span> (x), close the login modal
closeLoginModal.onclick = function () {
  loginModal.style.display = "none";
};

// When the user clicks on <span> (x), close the register modal
closeRegisterModal.onclick = function () {
  registerModal.style.display = "none";
};

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
  if (event.target == loginModal) {
    loginModal.style.display = "none";
  }
  if (event.target == registerModal) {
    registerModal.style.display = "none";
  }
};

// Event listener for create article button click
if (createArticleBtn) {
  createArticleBtn.addEventListener("click", openCreateArticleModal);
}

// Function to handle logout
async function handleLogout() {
  const loggedOut = await logout();
  if (loggedOut) {
    // Update UI after logout (if needed)
    document.getElementById("nickname").textContent = "";
    document.getElementById("nickname").style.display = "none";
    document.getElementById("logoutBtn").style.display = "none";
    document.getElementById("loginBtn").style.display = "inline-block";
    document.getElementById("registerBtn").style.display = "inline-block";
  }
}

// Event listener for logout button click
document.getElementById("logoutBtn").addEventListener("click", handleLogout);

// Check session when the page loads
document.addEventListener("DOMContentLoaded", async () => {
  let response = await checkSession();
  await fetchArticles();
  const currentUrl = window.location.href;
  if (currentUrl.includes("/admin")) {
    if (response?.role !== 3) {
      return (window.location.href = "/blog");
    }
    await fetchUsers();
  }
});

// Setup form handlers
setupFormHandlers();
