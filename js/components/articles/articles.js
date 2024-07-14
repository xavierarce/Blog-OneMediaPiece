import { deleteArticle } from "./deleteArcitle";
import { displayComments } from "../comments/comments";
import { updateArticleLogic } from "./editModal";

export async function fetchArticles() {
  try {
    const response = await fetch("php/fetch_articles.php");
    const data = await response.json();

    // Assuming data is an array of article objects
    const articleListContainer = document.getElementById("articleList");
    articleListContainer.innerHTML = ""; // Clear previous content

    data.forEach((article) => {
      const articleElement = document.createElement("div");
      articleElement.classList.add("article-item");
      articleElement.setAttribute("data-article-id", article.id); // Add data-article-id attribute

      let articleHTML = `
          <div class="article-header">
            <h3 class="author-name">${article.nickname}</h3>
      `;
      if (article.editable) {
        articleHTML += `
            <div class="buttons-container">
              <button class="edit-button">Edit</button>
              <button class="delete-button">Delete</button>
            </div>
          `;
      }
      articleHTML += `
          </div>
          <h2 class="article-title">${article.title}</h2>
          <p class="article-content">${article.content}</p>
          <p class="article-date">${article.dateModification}</p>
        <p class="article-type" style="display: none;">${article.type}</p>
          <hr>
      `;
      articleHTML += `
      <button class="comments-button">View Comment Section</button>
      <div class="comments-container"></div>
      <hr>
    `;

      articleElement.innerHTML = articleHTML;
      articleListContainer.appendChild(articleElement);
    });

    // Add event listeners for delete buttons after articles have been added
    const deleteButtons = document.querySelectorAll(".delete-button");
    deleteButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const articleItem = button.closest(".article-item");
        const articleId = articleItem.dataset.articleId;

        if (confirm("Are you sure you want to delete this article?")) {
          deleteArticle(articleId);
        }
      });
    });

    // Add event listeners for comment buttons after articles have been added
    const commentsButtons = document.querySelectorAll(".comments-button");
    commentsButtons.forEach((button) => {
      displayComments(button);
    });

    const editButtons = document.querySelectorAll(".edit-button");
    updateArticleLogic(editButtons);
  } catch (error) {
    console.error("Error fetching articles:", error);
  }
}
