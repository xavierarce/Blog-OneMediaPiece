<?php
include '../config.php';
session_start();

if (!isset($_SESSION['role']) || $_SESSION['role'] !== 3) {
  http_response_code(403);
  echo json_encode(['error' => 'Unauthorized']);
  exit();
}

try {
  $sql = "SELECT * FROM users ORDER BY role ASC";
  $stmt = $pdo->prepare($sql);
  $stmt->execute();

  $users = $stmt->fetchAll(PDO::FETCH_ASSOC);

  header('Content-Type: application/json');
  echo json_encode($users);
} catch (PDOException $e) {
  http_response_code(500);
  echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
  exit();
}
