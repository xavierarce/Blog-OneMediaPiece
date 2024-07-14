export async function deleteArticle(articleId) {
  try {
    const response = await fetch("php/delete_article.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ articleId }),
    });

    if (response.ok) {
      // Article deleted successfully, remove it from the DOM
      const articleItem = document.querySelector(
        `.article-item[data-article-id="${articleId}"]`
      );
      articleItem.remove();
    } else {
      console.error("Error deleting article:", response.statusText);
    }
  } catch (error) {
    console.error("Error deleting article:", error);
  }
}
