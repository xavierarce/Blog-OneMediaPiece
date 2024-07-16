<?php
include '../config.php';
header('Content-Type: application/json');
session_start();

if ($_SESSION['role'] !== 3) {
  echo json_encode(['success' => false, 'error' => 'You do not have permission to perform this action']);
  http_response_code(403);
  exit();
}

$data = json_decode(file_get_contents('php://input'), true);
$userId = $data['user_id'];
$role = $data['role'];
$banned = $data['banned'];
$deleted = $data['deleted'];

try {
  $sql = "UPDATE users SET role = :role, banned = :banned, deleted = :deleted WHERE user_id = :userId";
  $stmt = $pdo->prepare($sql);
  $stmt->bindParam(':role', $role, PDO::PARAM_STR);
  $stmt->bindParam(':banned', $banned, PDO::PARAM_BOOL);
  $stmt->bindParam(':deleted', $deleted, PDO::PARAM_BOOL);
  $stmt->bindParam(':userId', $userId, PDO::PARAM_INT);
  $stmt->execute();

  echo json_encode(['success' => true]);
} catch (PDOException $e) {
  http_response_code(500);
  echo json_encode(['success' => false, 'error' => 'Database error: ' . $e->getMessage()]);
  exit();
}
