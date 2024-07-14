<?php
include 'config.php';

$data = json_decode(file_get_contents('php://input'), true);
$commentId = $data['commentId'];
$content = $data['content'];

try {
  $sql = "UPDATE comments SET  content = :content WHERE id = :id";
  $stmt = $pdo->prepare($sql);
  $stmt->bindParam(':id', $commentId, PDO::PARAM_INT);
  $stmt->bindParam(':content', $content, PDO::PARAM_STR);
  $stmt->execute();
} catch (PDOException $e) {
  http_response_code(500);
  echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
  exit();
}
