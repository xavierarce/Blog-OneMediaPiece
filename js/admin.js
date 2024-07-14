export async function fetchUsers() {
  try {
    const response = await fetch("php/admin/fetch_users.php");
    if (!response.ok) {
      window.location.href = "/blog";
    }
    const data = await response.json();
    const usersTableBody = document
      .getElementById("usersTable")
      .querySelector("tbody");

    usersTableBody.innerHTML = "";
    data.forEach((user) => {
      const row = document.createElement("tr");

      const nicknameCell = document.createElement("td");
      nicknameCell.textContent = user.nickname;
      row.appendChild(nicknameCell);

      const loginCell = document.createElement("td");
      loginCell.textContent = user.login;
      row.appendChild(loginCell);

      const roleCell = document.createElement("td");
      const roleSelect = document.createElement("select");
      roleSelect.innerHTML = `
        <option value="0" ${
          user.role === 0 ? "selected" : ""
        }>Unverified</option>
        <option value="1" ${user.role === 1 ? "selected" : ""}>Writer</option>
        <option value="2" ${
          user.role === 2 ? "selected" : ""
        }>Moderator</option>
        <option value="admin" ${
          user.role === 3 ? "selected" : ""
        }>Admin</option>
      `;
      roleCell.appendChild(roleSelect);
      row.appendChild(roleCell);

      const bannedCell = document.createElement("td");
      const bannedSelect = document.createElement("select");
      bannedSelect.innerHTML = `
        <option value="false" ${user.banned == 0 ? "selected" : ""}>No</option>
        <option value="true" ${user.banned == 1 ? "selected" : ""}>Yes</option>
      `;
      bannedCell.appendChild(bannedSelect);
      row.appendChild(bannedCell);

      const deletedCell = document.createElement("td");
      const deletedSelect = document.createElement("select");
      deletedSelect.innerHTML = `
        <option value="false" ${user.deleted == 0 ? "selected" : ""}>No</option>
        <option value="true" ${user.deleted == 1 ? "selected" : ""}>Yes</option>
      `;
      deletedCell.appendChild(deletedSelect);
      row.appendChild(deletedCell);

      const actionCell = document.createElement("td");
      const saveButton = document.createElement("button");
      saveButton.textContent = "Save";
      saveButton.addEventListener("click", function () {
        const updatedUser = {
          user_id: user.user_id,
          role: roleSelect.value,
          banned: bannedSelect.value === "true",
          deleted: deletedSelect.value === "true",
        };
        updateUserStatus(updatedUser);
      });
      actionCell.appendChild(saveButton);
      row.appendChild(actionCell);

      usersTableBody.appendChild(row);
    });
  } catch (error) {
    console.error("Error fetching users:", error);
  }
}

function updateUserStatus(user) {
  fetch("php/admin/update_user.php", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
  })
    .then((response) => response.json())
    .then((data) => {
      if (!data.success) {
        console.error("Error updating user status:", data.error);
      }
    })
    .catch((error) => console.error("Error updating user status:", error));
}
