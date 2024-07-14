// logout.js

import { onSetSession } from "./sideBar";

export async function logout() {
  try {
    const response = await fetch("php/logout.php");
    const data = await response.json();
    if (data.success) {
      return window.location.reload();
    } else {
      console.error("Logout failed:", data.message);
      return false;
    }
  } catch (error) {
    console.error("Error logging out:", error);
    return false;
  }
}

const sectionTranslation = {
  public: "Public",
  comedy: "Comedy",
  cinema: "Cinema",
  admin: "Administrateur",
};

export async function checkSession() {
  try {
    const response = await fetch("php/check_session.php");
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    if (data.success && data.nickname) {
      if (document.getElementById("section")) {
        document.getElementById("section").textContent =
          sectionTranslation[data.section];
      }
      document.getElementById("userNickname").textContent = data.nickname;
      document.getElementById("logoutBtn").style.display = "inline-block";
      document.getElementById("loginBtn").style.display = "none";
      document.getElementById("registerBtn").style.display = "none";
      document.getElementById("userNickname").style.display = "inline";
      if (data.role === 3) {
        const adminButton = document.createElement("button");
        adminButton.className = "sidebar-button";
        adminButton.setAttribute("data-category", "admin");
        adminButton.textContent = "Administrateur";

        adminButton.addEventListener("click", function () {
          window.location.href = "/blog/admin";
        });
        const sidebar = document.getElementById("sidebar");
        sidebar.appendChild(adminButton);
      }
    } else {
      document.getElementById("nickname").style.display = "none";
      document.getElementById("logoutBtn").style.display = "none";
      document.getElementById("loginBtn").style.display = "inline-block";
      document.getElementById("registerBtn").style.display = "inline-block";
    }
    return data;
  } catch (error) {
    console.error("Error checking session:", error);
  }
}
