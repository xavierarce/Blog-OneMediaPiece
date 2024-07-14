import { checkIfLoggedIn } from "./checkSession";

export async function openCreateArticleModal() {
  const user = await checkIfLoggedIn();
  if (!user) {
    alert("You must be logged in to create an article.");
    return;
  }
  if (user.role === 0) return alert("Your account is not verified yet");
  // Create modal HTML
  var modalHTML = `
    <div id="createArticleModal" class="modal">
      <div class="modal-content">
        <span class="close" id="closeCreateArticleModal">&times;</span>
        <h2>Create New Article</h2>
        <form id="createArticleForm">
          <label for="title">Title:</label><br>
          <input type="text" id="title" name="title" required><br><br>
          <label for="content">Content:</label><br>
          <textarea id="content" name="content" rows="5" required></textarea><br><br>
          <label for="type">Type:</label><br>
          <select id="type" name="type">
            <option value="public">Public</option>
            <option value="comedy">Comedy</option>
            <option value="cinema">Cinema</option>
          </select><br><br>
          <button type="submit">Submit</button>
        </form>
      </div>
    </div>
  `;

  // Add modal HTML to the document body
  document.body.insertAdjacentHTML("beforeend", modalHTML);

  // Get modal element after it's added to the DOM
  var createArticleModal = document.getElementById("createArticleModal");

  // Get <span> element that closes the create article modal
  var closeCreateArticleModal = document.getElementById(
    "closeCreateArticleModal"
  );

  // Function to close the modal and remove it from DOM
  function closeModal() {
    createArticleModal.style.display = "none";
    createArticleModal.remove();
  }

  // When the user clicks on <span> (x), close the create article modal
  closeCreateArticleModal.onclick = closeModal;

  // When the user clicks anywhere outside of the modal, close it
  window.onclick = function (event) {
    if (event.target == createArticleModal) {
      closeModal();
    }
  };

  // Handle form submission within the modal
  document
    .getElementById("createArticleForm")
    .addEventListener("submit", async function (event) {
      event.preventDefault();
      const title = document.getElementById("title").value;
      const content = document.getElementById("content").value;
      const type = document.getElementById("type").value;
      try {
        const response = await fetch("php/create_article.php", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ title, content, type }),
        });

        if (!response.ok) {
          throw new Error("Failed to create article.");
        }

        const data = await response.json();
        if (data.success) {
          window.location.reload(); // Reload the page or update UI as needed
          closeModal(); // Close the modal after successful creation
        } else {
          throw new Error(data.message);
        }
      } catch (error) {
        console.error("Error creating article:", error.message);
      }
    });

  // Display the modal
  createArticleModal.style.display = "block";
}
