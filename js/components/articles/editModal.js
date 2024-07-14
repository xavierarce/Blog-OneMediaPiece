export function createEditModal(articleId, title, content, type) {
  const modal = document.createElement("div");
  modal.id = "editModal";
  modal.classList.add("modal");
  modal.innerHTML = `
 <div class="modal-content">
      <span class="close">&times;</span>
      <h2>Edit Article</h2>
      <form id="editForm">
        <input type="hidden" id="editArticleId" name="editArticleId" value="${articleId}" />
        <label for="editTitle">Title:</label><br>
        <input type="text" id="editTitle" name="editTitle" value="${title}" required><br><br>
        <label for="editContent">Content:</label><br>
        <textarea id="editContent" name="editContent" rows="5" required>${content}</textarea><br><br>
        <label for="editType">Type:</label><br>
        <select id="editType" name="editType">
          <option value="public" ${
            type === "public" ? "selected" : ""
          }>Public</option>
          <option value="comedy" ${
            type === "comedy" ? "selected" : ""
          }>Comedy</option>
          <option value="cinema" ${
            type === "cinema" ? "selected" : ""
          }>Cinema</option>
        </select><br><br>
        <button type="submit">Save Changes</button>
      </form>
    </div>
  `;

  // Close the modal when clicking on the close button or outside the modal content
  const closeButton = modal.querySelector(".close");
  closeButton.addEventListener("click", () => {
    modal.style.display = "none";
  });

  window.addEventListener("click", (event) => {
    if (event.target === modal) {
      modal.style.display = "none";
    }
  });

  return modal;
}

export async function updateArticle(articleId, title, content, type) {
  try {
    const response = await fetch("php/update_article.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ articleId, title, content, type }),
    });

    if (!response.ok) {
      throw new Error("Error updating article");
    }

    const updatedArticle = { id: articleId, title, content, type };
    return updatedArticle;
  } catch (error) {
    console.error("Error updating article:", error);
  }
}

export async function updateArticleLogic(editButtons) {
  editButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const articleItem = button.closest(".article-item");
      const articleId = articleItem.dataset.articleId;
      const articleTitle =
        articleItem.querySelector(".article-title").textContent;
      const articleContent =
        articleItem.querySelector(".article-content").textContent;
      const articleType =
        articleItem.querySelector(".article-type").textContent;

      // Create and inject the modal
      const editModal = createEditModal(
        articleId,
        articleTitle,
        articleContent,
        articleType
      );
      document.body.appendChild(editModal);

      // Show the modal
      editModal.style.display = "block";

      // Send the updated data to the server when the form is submitted
      const editForm = editModal.querySelector("#editForm");
      editForm.addEventListener("submit", async (event) => {
        event.preventDefault();
        const formData = new FormData(editForm);
        const title = formData.get("editTitle");
        const content = formData.get("editContent");
        const type = formData.get("editType");

        const updatedArticle = await updateArticle(
          articleId,
          title,
          content,
          type
        );

        // Update the DOM with the updated article
        if (updatedArticle) {
          const articleTitleElement =
            articleItem.querySelector(".article-title");
          const articleContentElement =
            articleItem.querySelector(".article-content");
          const articleTypeElement = articleItem.querySelector(".article-type");
          articleTitleElement.textContent = updatedArticle.title;
          articleContentElement.textContent = updatedArticle.content;
          articleTypeElement.textContent = updatedArticle.articleTypeElement;
        }
        window.location.reload(); // Reload the page or update UI as needed

        // Close the modal after updating the article
        editModal.style.display = "none";
      });
    });
  });
}
