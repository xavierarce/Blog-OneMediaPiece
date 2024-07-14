<?php
session_start();
header('Content-Type: application/json');

include 'config.php'; // Ensure this file contains PDO initialization
include 'sessionUtils.php'; // Ensure this file contains session utility functions like destroySessionWithMessage

// Fetching user data from JSON input
$data = json_decode(file_get_contents('php://input'), true);

if (!isset($data['login'])) {
  destroySessionWithMessage('Login not provided');
  exit;
}
if (!isset($data['password'])) {
  destroySessionWithMessage('Password not provided');
  exit;
}

$login = trim($data['login']);
$password = trim($data['password']);

try {
  // Checking user in database
  $sql = "SELECT nickname, user_id, role, password FROM users WHERE login = :login";
  $stmt = $pdo->prepare($sql);
  $stmt->bindParam(':login', $login);
  $stmt->execute();

  if ($stmt->rowCount() > 0) {
    $user = $stmt->fetch(PDO::FETCH_ASSOC); // Fetch the user data

    if (password_verify($password, $user['password'])) {
      $_SESSION['nickname'] = $user['nickname'];
      $_SESSION['user_id'] = $user['user_id'];
      $_SESSION['role'] = $user['role'];
      $_SESSION['section'] = 'public';
      $response = [
        'success' => true,
        'message' => 'Login successful!',
        'session_user_id' => $_SESSION['user_id'],
        'user' => $user,
      ];
      http_response_code(200); // 200 OK
    } else {
      destroySession();

      $response = [
        'success' => false,
        'message' => 'Invalid password',
        'userPSW' => $user['password'],
        'passwrd' => $password,
        'compared' => password_verify($password, $user['password']),

      ];
      http_response_code(401); // 401 Unauthorized
    }
  } else {
    destroySession();

    $response = [
      'success' => false,
      'message' => 'Invalid nickname',
    ];
    http_response_code(401); // 401 Unauthorized
  }

  echo json_encode($response);
} catch (PDOException $e) {
  destroySession();
  http_response_code(500);
  echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
}
