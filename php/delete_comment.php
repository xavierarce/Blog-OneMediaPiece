<?php
include 'config.php';

$data = json_decode(file_get_contents('php://input'), true);
$commentId = $data['commentId'];

try {
  $sql = "DELETE FROM comments WHERE id = :id";
  $stmt = $pdo->prepare($sql);
  $stmt->bindParam(':id', $commentId, PDO::PARAM_INT);
  $stmt->execute();
} catch (PDOException $e) {
  http_response_code(500);
  echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
  exit();
}
