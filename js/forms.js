export function setupFormHandlers() {
  document.getElementById("loginForm").onsubmit = async function (event) {
    event.preventDefault();

    var formData = new FormData(document.getElementById("loginForm"));
    var jsonObject = {};
    formData.forEach((value, key) => (jsonObject[key] = value));

    try {
      const response = await fetch("php/login.php", {
        method: "POST",
        body: JSON.stringify(jsonObject),
      });
      if (response.ok) {
        document.getElementById("loginModal").style.display = "none";
        window.location.reload();
      } else {
        const data = await response.json();
        alert(data.message);
      }
    } catch (error) {
      console.error("An error occurred: " + error);
    }
  };

  document.getElementById("registerForm").onsubmit = async function (event) {
    alert("registerForm");
    event.preventDefault();
    var formData = new FormData(document.getElementById("registerForm"));
    var jsonObject = {};
    formData.forEach((value, key) => (jsonObject[key] = value));

    try {
      const response = await fetch("php/register.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // Ensure JSON request
        },
        body: JSON.stringify(jsonObject),
      });
      if (response.ok) {
        document.getElementById("registerModal").style.display = "none";
        window.location.reload();
      } else {
        const responseJSON = await response.json();
        throw new Error(responseJSON.message);
      }
    } catch (error) {
      alert(error);
    }
  };
}
