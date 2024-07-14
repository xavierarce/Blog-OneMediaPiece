<?php
session_start();
header('Content-Type: application/json');

include 'config.php'; // Ensure this file contains PDO initialization
include 'sessionUtils.php'; // Ensure this file contains session utility functions like destroySessionWithMessage

// Function to check if nickname or login already exists
function checkIfExists($pdo, $field, $value)
{
  $checkSql = "SELECT COUNT(*) AS count FROM users WHERE $field = :value";
  $checkStmt = $pdo->prepare($checkSql);
  $checkStmt->bindParam(':value', $value);
  $checkStmt->execute();
  $result = $checkStmt->fetch(PDO::FETCH_ASSOC);
  return $result['count'] > 0;
}

// Fetching user data from JSON input
$data = json_decode(file_get_contents('php://input'), true);

if (!isset($data['nickname'])) {
  destroySessionWithMessage('Nickname not provided');
  exit;
}
if (!isset($data['login'])) {
  destroySessionWithMessage('Login not provided');
  exit;
}
if (!isset($data['password'])) {
  destroySessionWithMessage('Password not provided');
  exit;
}

$nickname = trim($data['nickname']);
$password = trim($data['password']);
$login = trim($data['login']);

// Additional validation if needed
if (strlen($nickname) < 3 || strlen($login) < 3 || strlen($password) < 6) {
  destroySession();
  http_response_code(400);
  echo json_encode(['success' => false, 'message' => 'Nickname and login should be at least 3 characters long and password should be at least 6 characters long']);
  exit();
}

try {
  // Check if the nickname already exists
  if (checkIfExists($pdo, 'nickname', $nickname)) {
    destroySession();
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Nickname already exists']);
    exit();
  }

  // Check if the login already exists
  if (checkIfExists($pdo, 'login', $login)) {
    destroySession();
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Login already exists']);
    exit();
  }

  // Inserting user data into the database
  $sql = "INSERT INTO users (nickname, login, password) VALUES (:nickname, :login, :password)";
  $stmt = $pdo->prepare($sql);
  $stmt->bindParam(':nickname', $nickname);
  $stmt->bindParam(':login', $login);
  $hashed_password = password_hash($password, PASSWORD_DEFAULT);
  $stmt->bindParam(':password', $hashed_password);
  $stmt->execute();

  if ($stmt->rowCount() > 0) {
    $_SESSION['nickname'] = $nickname;
    $_SESSION['role'] = 0;

    $response = [
      'success' => true,
      'message' => 'Registration successful!',
      'userPSW' => $password,
      'passwrd' => $hashed_password,
      'compared' => password_verify($password, $hashed_password),
      'compared1' => password_verify($password, $hashed_password),
      'compared2' => password_verify($password, $hashed_password),
    ];
    http_response_code(200); // 200 OK
  } else {
    destroySession();

    $response = [
      'success' => false,
      'message' => 'Registration failed. Please try again.'
    ];
    http_response_code(500); // 500 Internal Server Error
  }

  echo json_encode($response);
} catch (PDOException $e) {
  destroySession();
  http_response_code(500);
  echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
}
