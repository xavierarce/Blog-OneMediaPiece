import { checkIfLoggedIn } from "../../checkSession";

export async function setSection(section) {
  await fetch("php/context/context.php", {
    method: "POST",
    body: JSON.stringify({ section }),
  })
    .then(async (response) => {
      const data = await response.json();
      return data;
    })
    .catch((error) => {
      console.error("An error occurred: " + error);
    });
}

export async function onSetSession(button) {
  button.addEventListener("click", async () => {
    const isLogged = await checkIfLoggedIn();
    const category = button.dataset.category;
    if (category !== "public" && !isLogged) {
      return alert("You must be logged in to access this section.");
    }
    await setSection(category);
    window.location.reload();
  });
}
