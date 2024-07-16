import { checkIfLoggedIn } from "../../checkSession";
import { onDeleteComment } from "./deleteComment";
import { fetchComments } from "./fetchComments";
import { createComment } from "./createComments";
import { onEditComment } from "./updateCommentModal";

export function displayComments(button) {
  button.addEventListener("click", async () => {
    const articleId = button.closest(".article-item").dataset.articleId;
    const comments = await fetchComments(articleId);

    // Create a comments section instead of a modal
    const commentsSection = document.createElement("div");
    commentsSection.classList.add("comments-section");

    let commentsHTML = "";
    comments.forEach((commentary) => {
      commentsHTML += `
    <div class="commentary-item" data-comment-id="${commentary.id}">
      <p class="commentary-content">${commentary.content}</p>
      <p class="commentary-date">${commentary.dateCreation}</p>
  `;
      if (commentary.editable) {
        commentsHTML += `
        <button class="edit-comment-button">Edit</button>
        <button class="delete-comment-button">Delete</button>
      `;
      }
      commentsHTML += `
    </div>
  `;
    });

    // Create an input field for leaving a comment
    const commentInput = document.createElement("input");
    commentInput.type = "text";
    commentInput.placeholder = "Leave a comment...";
    commentInput.classList.add("leave-comment-input");

    // Create a "Post Comment" button
    const postCommentButton = document.createElement("button");
    postCommentButton.textContent = "Post Comment";
    postCommentButton.classList.add("post-comment-button");
    postCommentButton.addEventListener("click", async () => {
      const isLoggedIn = await checkIfLoggedIn();
      if (!isLoggedIn) {
        alert("You must be logged in to post a comment.");
        return;
      }
      const commentContent = commentInput.value;
      const articleId = button.closest(".article-item").dataset.articleId;

      try {
        const response = await createComment(commentContent, articleId);

        const data = await response.json();
        if (response.ok) {
          // Create a new comment element
          const newCommentElement = document.createElement("div");
          newCommentElement.classList.add("commentary-item");
          newCommentElement.innerHTML = `
            <p class="commentary-content">${commentContent}</p>
            <p class="commentary-date">${new Date().toLocaleString()}</p>
          `;

          // Insert the new comment element at the beginning of the comments container
          const commentsContainer = commentsSection.querySelector(
            ".comments-container"
          );
          commentsContainer.insertBefore(
            newCommentElement,
            commentsContainer.firstChild
          );

          commentInput.value = "";
        } else {
          console.error("Error posting comment:", data.error);
        }
      } catch (error) {
        console.error("Error posting comment:", error);
      }
    });

    // Create a "Close Comments" button
    const closeCommentsButton = document.createElement("button");
    closeCommentsButton.textContent = "Close Comments";
    closeCommentsButton.classList.add("close-comments-button");
    closeCommentsButton.addEventListener("click", () => {
      commentsSection.style.display = "none";
      button.style.display = "inline-block";
    });

    commentsSection.innerHTML = `
      <b>Comments</b>
      <div class="comments-container">
        ${commentsHTML}
      </div>
    `;

    // Append the input field and the "Post Comment" button to the comments section
    const inputContainer = document.createElement("div");
    inputContainer.classList.add("leave-comment-container");
    inputContainer.appendChild(commentInput);
    inputContainer.appendChild(postCommentButton);
    commentsSection.insertBefore(inputContainer, commentsSection.firstChild);

    // Append the "Close Comments" button to the comments section
    commentsSection.appendChild(closeCommentsButton);

    // Insert the comments section after the "View Comments" button
    button.parentNode.insertBefore(commentsSection, button.nextSibling);

    // Hide the "View Comments" button
    button.style.display = "none";

    const deleteCommentButtons = commentsSection.querySelectorAll(
      ".delete-comment-button"
    );
    deleteCommentButtons.forEach((deleteButton) => {
      onDeleteComment(deleteButton);
    });

    const editCommentButtons = commentsSection.querySelectorAll(
      ".edit-comment-button"
    );
    editCommentButtons.forEach((editButton) => {
      onEditComment(editButton);
    });
  });
}
