<?php
include 'config.php';
include 'sessionUtils.php';

session_start();
header('Content-Type: application/json');

$data = json_decode(file_get_contents('php://input'), true);
$requiredFields = ['login', 'password'];
foreach ($requiredFields as $field) {
  if (!isset($data[$field])) {
    destroySessionWithMessage(ucfirst($field) . ' not provided');
    exit;
  }
}
$login = trim($data['login']);
$password = trim($data['password']);

try {
  $sql = "SELECT * FROM users WHERE login = :login";
  $stmt = $pdo->prepare($sql);
  $stmt->bindParam(':login', $login);
  $stmt->execute();

  if ($stmt->rowCount() === 0) {
    handleInvalidLogin();
  }

  $user = $stmt->fetch(PDO::FETCH_ASSOC);
  if (!password_verify($password, $user['password'])) {
    handleInvalidLogin();
  }

  $_SESSION['nickname'] = $user['nickname'];
  $_SESSION['user_id'] = $user['user_id'];
  $_SESSION['role'] = $user['role'];
  $_SESSION['section'] = 'public';

  $response = [
    'success' => true,
    'message' => 'Login successful!',
    'deleted' => $user['deleted'],
    'banned' => $user['banned'],
  ];
  http_response_code(200);

  echo json_encode($response);

  function handleInvalidLogin()
  {
    destroySession();
    $response = [
      'success' => false,
      'message' => 'Invalid credentials',
    ];
    http_response_code(401);
    echo json_encode($response);
    exit;
  }
} catch (PDOException $e) {
  destroySession();
  http_response_code(500);
  echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
}
