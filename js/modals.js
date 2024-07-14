export function addModals() {
  document.body.insertAdjacentHTML(
    "beforeend",
    `
      <!-- The Login Modal -->
      <div id="loginModal" class="modal">
        <div class="modal-content">
          <span class="close" id="closeLoginModal">&times;</span>
          <h2>Login</h2>
          <form id="loginForm">
            <label for="loginUsername">Username:</label>
            <input type="text" id="loginUsername" name="login" required /><br /><br />
            <label for="loginPassword">Password:</label>
            <input type="password" id="loginPassword" name="password" required /><br /><br />
            <button type="submit">Login</button>
          </form>
        </div>
      </div>

      <!-- The Register Modal -->
      <div id="registerModal" class="modal">
        <div class="modal-content">
          <span class="close" id="closeRegisterModal">&times;</span>
          <h2>Register</h2>
          <form id="registerForm">
            <label for="registerUsername">Nickname:</label>
            <input type="text" id="registerUsername" name="nickname" required /><br /><br />
            <label for="registerLogin">Login:</label>
            <input type="text" id="registerLogin" name="login" required /><br /><br />
            <label for="registerPassword">Password:</label>
            <input type="password" id="registerPassword" name="password" required /><br /><br />
            <button type="submit">Register</button>
          </form>
        </div>
      </div>
  `
  );
}
