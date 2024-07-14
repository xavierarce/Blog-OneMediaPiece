export async function updateComment(commentId, content) {
  try {
    const response = await fetch("php/update_comment.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ commentId, content }),
    });

    if (!response.ok) {
      throw new Error("Error updating article");
    }

    const updatedComment = { id: commentId, content };
    return updatedComment;
  } catch (error) {
    console.error("Error updating article:", error);
  }
}

export async function createEditCommentModal(commentId, commentContent) {
  const modal = document.createElement("div");
  modal.id = "editCommentModal";
  modal.classList.add("modal");
  modal.innerHTML = `
    <div class="modal-content">
      <span class="close">&times;</span>
      <h2>Edit Comment</h2>
      <form>
        <input type="hidden" name="commentId" value="${commentId}">
        <textarea name="commentContent" required>${commentContent}</textarea>
        <button type="submit">Save Changes</button>
      </form>
    </div>
  `;

  document.body.appendChild(modal);

  const closeButton = modal.querySelector(".close");
  closeButton.addEventListener("click", () => {
    modal.remove();
  });

  const form = modal.querySelector("form");
  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const formData = new FormData(form);
    const commentId = formData.get("commentId");
    const updatedContent = formData.get("commentContent");

    // Call the function to update the comment on the server and UI
    try {
      const response = await updateComment(commentId, updatedContent);
      if (response.id) {
        // Update the comment content in the UI
        const commentElement = document.querySelector(
          `.commentary-item[data-comment-id="${commentId}"] .commentary-content`
        );
        commentElement.textContent = updatedContent;

        return (modal.style.display = "none");
      } else {
        console.error("Error updating comment:", data.error);
      }
    } catch (error) {
      console.error("Error updating comment:", error);
    }
  });

  modal.style.display = "block";
}

export const onEditComment = (editButton) => {
  editButton.addEventListener("click", () => {
    const commentItem = editButton.closest(".commentary-item");
    const commentId = commentItem.dataset.commentId;
    const commentContent = commentItem.querySelector(
      ".commentary-content"
    ).textContent;

    createEditCommentModal(commentId, commentContent);
  });
};
