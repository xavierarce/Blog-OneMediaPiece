export async function fetchComments(articleId) {
  try {
    const response = await fetch(
      "php/fetch_comments.php?article_id=" + articleId
    );

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching comments:", error);
  }
}
