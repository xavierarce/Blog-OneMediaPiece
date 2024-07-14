export const checkIfLoggedIn = async () => {
  const response = await fetch("php/check_session.php");
  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }
  const data = await response.json();
  if (data.success) {
    return data;
  }
  return false;
};
