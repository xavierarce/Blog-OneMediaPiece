export async function deleteComment(commentId) {
  try {
    const response = await fetch("php/delete_comment.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ commentId }),
    });

    if (response.ok) {
      // Article deleted successfully, remove it from the DOM
      const articleItem = document.querySelector(
        `.article-item[data-article-id="${commentId}"]`
      );
      articleItem.remove();
    } else {
      console.error("Error deleting article:", response.statusText);
    }
  } catch (error) {
    console.error("Error deleting article:", error);
  }
}

export const onDeleteComment = (deleteButton) => {
  deleteButton.addEventListener("click", () => {
    const commentItem = deleteButton.closest(".commentary-item");
    const commentId = commentItem.dataset.commentId;

    if (confirm("Are you sure you want to delete this comment?")) {
      deleteComment(commentId);
      commentItem.remove();
    }
  });
};
