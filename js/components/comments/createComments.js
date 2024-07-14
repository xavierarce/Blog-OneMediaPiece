export const createComment = async (commentContent, articleId) => {
  return await fetch("php/post_comment.php", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      content: commentContent,
      article_id: articleId,
    }),
  });
};
