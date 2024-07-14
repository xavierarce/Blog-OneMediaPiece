<?php
include 'config.php';

$data = json_decode(file_get_contents('php://input'), true);
$articleId = $data['articleId'];
$title = $data['title'];
$content = $data['content'];
$type = $data['type'];

try {
  $sql = "UPDATE articles SET title = :title, content = :content, type = :type WHERE id = :id";
  $stmt = $pdo->prepare($sql);
  $stmt->bindParam(':id', $articleId, PDO::PARAM_INT);
  $stmt->bindParam(':title', $title, PDO::PARAM_STR);
  $stmt->bindParam(':content', $content, PDO::PARAM_STR);
  $stmt->bindParam(':type', $type, PDO::PARAM_STR);
  $stmt->execute();
} catch (PDOException $e) {
  http_response_code(500);
  echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
  exit();
}
