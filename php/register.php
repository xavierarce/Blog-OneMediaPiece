<?php
include 'config.php';
include 'sessionUtils.php';

session_start();
header('Content-Type: application/json');

function checkIfExists($pdo, $field, $value)
{
  $checkSql = "SELECT COUNT(*) AS count FROM users WHERE $field = :value";
  $checkStmt = $pdo->prepare($checkSql);
  $checkStmt->bindParam(':value', $value);
  $checkStmt->execute();
  $result = $checkStmt->fetch(PDO::FETCH_ASSOC);
  return $result['count'] > 0;
}
$data = json_decode(file_get_contents('php://input'), true);
$requiredFields = ['nickname', 'login', 'password'];
foreach ($requiredFields as $field) {
  if (!isset($data[$field])) {
    destroySessionWithMessage(ucfirst($field) . ' not provided');
    exit;
  }
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
  function handleDuplicateError($field)
  {
    destroySession();
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => "$field already exists"]);
    exit();
  }
  if (checkIfExists($pdo, 'nickname', $nickname)) {
    handleDuplicateError('Nickname');
  } elseif (checkIfExists($pdo, 'login', $login)) {
    handleDuplicateError('Login');
  }

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
    ];
    http_response_code(200);
  } else {
    destroySession();

    $response = [
      'success' => false,
      'message' => 'Registration failed. Please try again.'
    ];
    http_response_code(500);
  }

  echo json_encode($response);
} catch (PDOException $e) {
  destroySession();
  http_response_code(500);
  echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
}
